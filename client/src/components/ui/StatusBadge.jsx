const MAP = {
  ACTIVE: ["success", "Active"],
  FROZEN: ["warning", "Frozen"],
  CLOSED: ["neutral", "Closed"],
  COMPLETED: ["success", "Completed"],
  PENDING: ["warning", "Pending"],
  FAILED: ["danger", "Failed"],
  REVERSED: ["neutral", "Reversed"],
};

/** Coloured status pill for account/transaction statuses. */
export default function StatusBadge({ status }) {
  const [tone, label] = MAP[status] || ["neutral", status || "Unknown"];
  return (
    <span className={`badge badge--${tone}`}>
      <span className="badge__dot" aria-hidden="true" />
      {label}
    </span>
  );
}
