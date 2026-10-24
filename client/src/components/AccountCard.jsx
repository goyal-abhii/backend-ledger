import { Link } from "react-router-dom";
import { Wallet, ArrowUpRight } from "lucide-react";
import StatusBadge from "./ui/StatusBadge";
import { formatCurrency, shortId } from "../utils/format";

/** Summary card for a single account in the dashboard grid. */
export default function AccountCard({ account }) {
  const { _id, status, currency, balance } = account;

  return (
    <article className="acct">
      <div className="acct__top">
        <span className="acct__icon" aria-hidden="true">
          <Wallet size={18} />
        </span>
        <StatusBadge status={status} />
      </div>

      <p className="acct__balance tabular">
        {balance === null || balance === undefined
          ? "—"
          : formatCurrency(balance, currency)}
      </p>

      <div className="acct__meta">
        <span className="acct__id mono" title={_id}>
          {shortId(_id)}
        </span>
        <span className="acct__currency">{currency}</span>
      </div>

      <div className="acct__actions">
        <Link to={`/accounts/${_id}`} className="btn btn--secondary btn--sm">
          View
        </Link>
        <Link to={`/transfer?from=${_id}`} className="btn btn--ghost btn--sm">
          Send
          <ArrowUpRight size={15} />
        </Link>
      </div>
    </article>
  );
}
