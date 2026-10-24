import { useId } from "react";
import { AlertCircle } from "lucide-react";

/**
 * Labelled text input with hint + error, wired for accessibility
 * (htmlFor/id, aria-invalid, aria-describedby).
 */
export default function Field({
  label,
  hint,
  error,
  prefix,
  id,
  className = "",
  ...inputProps
}) {
  const autoId = useId();
  const inputId = id || autoId;
  const errId = `${inputId}-error`;

  const input = (
    <input
      id={inputId}
      className="input"
      aria-invalid={error ? true : undefined}
      aria-describedby={error ? errId : undefined}
      {...inputProps}
    />
  );

  return (
    <div className={`field ${className}`}>
      {label && (
        <label htmlFor={inputId} className="field__label">
          {label}
        </label>
      )}
      {prefix ? (
        <div className="input-group">
          <span className="input-group__prefix">{prefix}</span>
          {input}
        </div>
      ) : (
        input
      )}
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
