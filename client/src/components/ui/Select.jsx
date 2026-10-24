import { useId } from "react";
import { AlertCircle } from "lucide-react";

/** Labelled <select> matching the Field component's look and a11y. */
export default function Select({
  label,
  hint,
  error,
  id,
  className = "",
  children,
  ...selectProps
}) {
  const autoId = useId();
  const selectId = id || autoId;
  const errId = `${selectId}-error`;

  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={selectId} className="field__label">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className="select"
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errId : undefined}
        {...selectProps}
      >
        {children}
      </select>
      {hint && !error && <span className="field__hint">{hint}</span>}
      {error && (
        <span id={errId} className="field__error" role="alert">
          <AlertCircle size={14} />
          {error}
        </span>
      )}
    </div>
  );
}
