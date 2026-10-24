import { AlertCircle, Info, AlertTriangle } from "lucide-react";

const ICONS = { danger: AlertCircle, info: Info, warning: AlertTriangle };

/** Inline, non-dismissible message block. */
export default function Alert({ variant = "danger", children, className = "" }) {
  const Icon = ICONS[variant] || AlertCircle;
  return (
    <div
      className={`alert alert--${variant} ${className}`}
      role={variant === "danger" ? "alert" : "status"}
    >
      <Icon size={18} className="alert__icon" aria-hidden="true" />
      <div>{children}</div>
    </div>
  );
}
