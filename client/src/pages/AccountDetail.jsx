import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight, Copy, Check, RefreshCw } from "lucide-react";
import { listAccounts, getBalance } from "../api/accounts";
import { useFetch } from "../hooks/useFetch";
import { getErrorMessage } from "../api/client";
import { formatCurrency, formatDate } from "../utils/format";
import StatusBadge from "../components/ui/StatusBadge";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import "./AccountDetail.css";

export default function AccountDetail() {
  const { id } = useParams();
  const [copied, setCopied] = useState(false);

  // The backend has no "get one account" endpoint, so we read the account's
  // metadata from the list and its balance from the balance endpoint.
  const fetchAccount = useCallback(async () => {
    const [accounts, bal] = await Promise.all([listAccounts(), getBalance(id)]);
    const account = accounts.find((a) => a._id === id);
    if (!account) {
      throw new Error("This account doesn't exist or doesn't belong to you.");
    }
    return { account, balance: bal.balance };
  }, [id]);

  const { data, loading, error, reload } = useFetch(fetchAccount);

  function copyId() {
    navigator.clipboard
      ?.writeText(id)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      })
      .catch(() => {});
  }

  return (
    <div className="stack" style={{ gap: 20 }}>
      <Link to="/" className="back-link">
        <ArrowLeft size={16} />
        Back to accounts
      </Link>

      {loading && (
        <div className="card" aria-hidden="true">
          <div className="card__body">
            <div className="skeleton" style={{ height: 16, width: 120 }} />
            <div className="skeleton" style={{ height: 40, width: "50%", marginTop: 12 }} />
            <div className="skeleton" style={{ height: 80, width: "100%", marginTop: 24 }} />
          </div>
        </div>
      )}

      {error && (
        <Alert variant="danger">
          {getErrorMessage(error)}{" "}
          <button className="link-btn" onClick={reload}>
            Retry
          </button>
        </Alert>
      )}

      {!loading && !error && data && (
        <div className="card detail">
          <div className="detail__head">
            <div>
              <p className="detail__label">Available balance</p>
              <p className="detail__balance tabular">
                {formatCurrency(data.balance, data.account.currency)}
              </p>
            </div>
            <StatusBadge status={data.account.status} />
          </div>

          <dl className="detail__grid">
            <div className="detail__item">
              <dt>Account ID</dt>
              <dd className="id-copy">
                <span className="mono" title={id}>
                  {id}
                </span>
                <button
                  type="button"
                  className="icon-btn"
                  onClick={copyId}
                  aria-label="Copy account ID"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                </button>
              </dd>
            </div>
            <div className="detail__item">
              <dt>Currency</dt>
              <dd>{data.account.currency}</dd>
            </div>
            <div className="detail__item">
              <dt>Status</dt>
              <dd>{data.account.status}</dd>
            </div>
            <div className="detail__item">
              <dt>Opened</dt>
              <dd>{formatDate(data.account.createdAt)}</dd>
            </div>
          </dl>

          <div className="detail__actions">
            <Link to={`/transfer?from=${id}`} className="btn btn--primary">
              <ArrowUpRight size={17} />
              Send money
            </Link>
            <Button variant="secondary" onClick={reload} loading={loading}>
              <RefreshCw size={16} />
              Refresh balance
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
