import Spinner from "./Spinner";

/**
 * Button primitive. Variants: primary | secondary | ghost | danger.
 * Pass `loading` to show a spinner and disable interaction.
 */
export default function Button({
  variant = "primary",
  size,
  block = false,
  loading = false,
  disabled = false,
  type = "button",
  className = "",
  children,
  ...rest
}) {
  const classes = [
    "btn",
    `btn--${variant}`,
    size === "sm" ? "btn--sm" : "",
    block ? "btn--block" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <Spinner size={16} />}
      {children}
    </button>
  );
}
