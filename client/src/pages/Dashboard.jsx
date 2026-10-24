import { useCallback, useState } from "react";
import { Plus, Wallet } from "lucide-react";
import { listAccounts, createAccount, getBalance } from "../api/accounts";
import { useFetch } from "../hooks/useFetch";
import { useToast } from "../components/ui/Toast";
import { getErrorMessage } from "../api/client";
import { formatCurrency } from "../utils/format";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import EmptyState from "../components/ui/EmptyState";
import AccountCard from "../components/AccountCard";
import "./Dashboard.css";

function StatTile({ label, value }) {
  return (
    <div className="stat">
      <span className="stat__label">{label}</span>
      <span className="stat__value tabular">{value}</span>
    </div>
  );
}

function GridSkeleton() {
  return (
    <div className="account-grid" aria-hidden="true">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="acct">
          <div className="skeleton" style={{ height: 24, width: 70 }} />
          <div className="skeleton" style={{ height: 30, width: "60%", marginTop: 16 }} />
          <div className="skeleton" style={{ height: 16, width: "40%", marginTop: 14 }} />
          <div className="skeleton" style={{ height: 34, width: "100%", marginTop: 18 }} />
        </div>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const toast = useToast();
  const [creating, setCreating] = useState(false);

  const fetchData = useCallback(async () => {
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

  const { data: accounts, loading, error, reload } = useFetch(fetchData);

  async function handleCreate() {
    setCreating(true);
    try {
      await createAccount();
      toast.success("New account created.");
      await reload();
    } catch (err) {
      toast.error(getErrorMessage(err, "Couldn't create the account."));
    } finally {
      setCreating(false);
    }
  }

  const hasAccounts = !loading && !error && accounts?.length > 0;
  const total = (accounts || []).reduce((sum, a) => sum + (Number(a.balance) || 0), 0);
  const activeCount = (accounts || []).filter((a) => a.status === "ACTIVE").length;

  return (
    <div className="stack" style={{ gap: 24 }}>
      <header className="page-head">
        <div>
          <h1 className="page-head__title">Accounts</h1>
          <p className="muted">Manage your ledger accounts and balances.</p>
        </div>
        <Button onClick={handleCreate} loading={creating}>
          <Plus size={17} />
          New account
        </Button>
      </header>

      {hasAccounts && (
        <div className="stat-row">
          <StatTile label="Total balance" value={formatCurrency(total)} />
          <StatTile label="Accounts" value={accounts.length} />
          <StatTile label="Active" value={activeCount} />
        </div>
      )}

      {loading && <GridSkeleton />}

      {error && (
        <Alert variant="danger">
          {getErrorMessage(error, "Couldn't load your accounts.")}{" "}
          <button className="link-btn" onClick={reload}>
            Try again
          </button>
        </Alert>
      )}

      {!loading && !error && accounts?.length === 0 && (
        <div className="card">
          <EmptyState
            icon={Wallet}
            title="No accounts yet"
            description="Create your first account to start tracking balances and making transfers."
            action={
              <Button onClick={handleCreate} loading={creating}>
                <Plus size={17} />
                Create account
              </Button>
            }
          />
        </div>
      )}

      {hasAccounts && (
        <div className="account-grid">
          {accounts.map((account) => (
            <AccountCard key={account._id} account={account} />
          ))}
        </div>
      )}
    </div>
  );
}
