import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { listAccounts, getBalance } from "../api/accounts";
import { createTransfer } from "../api/transactions";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../components/ui/Toast";
import { getErrorMessage } from "../api/client";
import { formatCurrency, shortId, newIdempotencyKey } from "../utils/format";
import Field from "../components/ui/Field";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import Modal from "../components/ui/Modal";
import "./Transfer.css";

const OBJECT_ID_RE = /^[a-f0-9]{24}$/i;

export default function Transfer() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const fetchAccounts = useCallback(async () => {
    const accounts = await listAccounts();
    const balances = await Promise.all(
      accounts.map((a) =>
        getBalance(a._id)
          .then((r) => r.balance)
          .catch(() => null)
      )
    );
    return accounts.map((a, i) => ({ ...a, balance: balances[i] }));
  }, []);

  const { data: accounts, loading, error } = useFetch(fetchAccounts);

  const [form, setForm] = useState({ fromAccount: "", toAccount: "", amount: "" });
  const [errors, setErrors] = useState({});
  const [confirming, setConfirming] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const idempotencyKeyRef = useRef(null);

  // Pre-select the "from" account from the ?from= query param (or the only one).
  useEffect(() => {
    if (!accounts) return;
    setForm((f) => {
      if (f.fromAccount) return f;
      const fromParam = searchParams.get("from");
      const preset = accounts.find((a) => a._id === fromParam);
      if (preset) return { ...f, fromAccount: preset._id };
      if (accounts.length === 1) return { ...f, fromAccount: accounts[0]._id };
      return f;
    });
  }, [accounts, searchParams]);

  const selectedFrom = useMemo(
    () => (accounts || []).find((a) => a._id === form.fromAccount) || null,
    [accounts, form.fromAccount]
  );

  function update(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  }

  function validate() {
    const next = {};
    const to = form.toAccount.trim();
    const amount = Number(form.amount);

    if (!form.fromAccount) next.fromAccount = "Choose an account to send from.";
    if (!to) next.toAccount = "Enter the destination account ID.";
    else if (!OBJECT_ID_RE.test(to))
      next.toAccount = "That doesn't look like a valid account ID (24 characters).";
    else if (to === form.fromAccount) next.toAccount = "You can't transfer to the same account.";

    if (!form.amount) next.amount = "Enter an amount.";
    else if (!Number.isFinite(amount) || amount <= 0)
      next.amount = "Amount must be greater than zero.";
    else if (selectedFrom && selectedFrom.balance != null && amount > selectedFrom.balance)
      next.amount = `Exceeds available balance (${formatCurrency(selectedFrom.balance)}).`;

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function onReview(e) {
    e.preventDefault();
    if (!validate()) return;
    // One idempotency key per confirmed attempt — reused if a retry is needed.
    idempotencyKeyRef.current = newIdempotencyKey();
    setConfirming(true);
  }

  async function onConfirm() {
    setSubmitting(true);
    try {
      const res = await createTransfer({
        fromAccount: form.fromAccount,
        toAccount: form.toAccount.trim(),
        amount: Number(form.amount),
        idempotencyKey: idempotencyKeyRef.current,
      });
      setConfirming(false);
      toast.success(res.message || "Transfer completed.");
      navigate(`/accounts/${form.fromAccount}`);
    } catch (err) {
      setConfirming(false);
      toast.error(getErrorMessage(err, "Transfer failed. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="transfer">
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Back
      </Link>

      <div className="transfer__head">
        <h1 className="page-head__title">Send money</h1>
        <p className="muted">Move funds between ledger accounts.</p>
      </div>

      {loading && (
        <div className="card" aria-hidden="true">
          <div className="card__body stack" style={{ gap: 18 }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="skeleton" style={{ height: 42 }} />
            ))}
          </div>
        </div>
      )}

      {error && <Alert variant="danger">{getErrorMessage(error)}</Alert>}

      {!loading && !error && accounts?.length === 0 && (
        <Alert variant="warning">
          You need an account before you can send money. <Link to="/">Create one first</Link>.
        </Alert>
      )}

      {!loading && !error && accounts?.length > 0 && (
        <div className="card">
          <div className="card__body">
            <form className="transfer__form" onSubmit={onReview} noValidate>
              <Select
                label="From account"
                name="fromAccount"
                value={form.fromAccount}
                onChange={update}
                error={errors.fromAccount}
              >
                <option value="" disabled>
                  Select an account
                </option>
                {accounts.map((a) => (
                  <option key={a._id} value={a._id}>
                    {shortId(a._id)} — {a.balance == null ? "balance n/a" : formatCurrency(a.balance)}
                  </option>
                ))}
              </Select>

              {selectedFrom && (
                <p className="transfer__balance">
                  Available balance:{" "}
                  <strong className="tabular">
                    {selectedFrom.balance == null ? "—" : formatCurrency(selectedFrom.balance)}
                  </strong>
                </p>
              )}

              <Field
                label="To account ID"
                name="toAccount"
                placeholder="Paste the recipient's 24-character account ID"
                value={form.toAccount}
                onChange={update}
                error={errors.toAccount}
                hint="The recipient can find this on their account page."
              />

              <Field
                label="Amount"
                name="amount"
                type="number"
                min="1"
                step="any"
                inputMode="decimal"
                prefix="₹"
                placeholder="0.00"
                value={form.amount}
                onChange={update}
                error={errors.amount}
              />

              <Alert variant="info">
                Transfers are processed atomically and can take a few seconds to complete.
              </Alert>

              <Button type="submit" block>
                Review transfer
              </Button>
            </form>
          </div>
        </div>
      )}

      <Modal
        open={confirming}
        onClose={() => !submitting && setConfirming(false)}
        title="Confirm transfer"
        footer={
          <>
            <Button variant="secondary" onClick={() => setConfirming(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={onConfirm} loading={submitting}>
              {submitting ? "Sending…" : "Confirm & send"}
            </Button>
          </>
        }
      >
        <div className="confirm">
          <div className="confirm__amount tabular">{formatCurrency(Number(form.amount))}</div>
          <div className="confirm__route">
            <span className="mono">{shortId(form.fromAccount)}</span>
            <ArrowRight size={16} aria-label="to" />
            <span className="mono">{shortId(form.toAccount.trim())}</span>
          </div>
          {submitting && (
            <p className="confirm__note">
              Processing… this can take a few seconds. Please keep this window open.
            </p>
          )}
        </div>
      </Modal>
    </div>
  );
}
