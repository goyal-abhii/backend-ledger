import "./EmptyState.css";

/** Friendly placeholder shown when a list has no records. */
export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="empty">
      {Icon && (
        <div className="empty__icon" aria-hidden="true">
          <Icon size={22} />
        </div>
      )}
      <h3 className="empty__title">{title}</h3>
      {description && <p className="empty__desc">{description}</p>}
      {action && <div className="empty__action">{action}</div>}
    </div>
  );
}
