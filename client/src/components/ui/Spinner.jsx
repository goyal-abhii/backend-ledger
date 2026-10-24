export default function Spinner({ size = 16, className = "" }) {
  return (
    <span
      className={`spinner ${className}`}
      style={{ width: size, height: size }}
      aria-hidden="true"
    />
  );
}
