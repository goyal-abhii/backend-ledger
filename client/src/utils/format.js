// Formatting helpers shared across the app.

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

/** Format a number as Indian Rupee currency, e.g. 1500 -> "₹1,500.00". */
export function formatCurrency(amount, currency = "INR") {
  const value = Number(amount) || 0;
  if (currency === "INR") return inr.format(value);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Shorten a Mongo ObjectId for display, e.g. "6ad1...71e4". */
export function shortId(id) {
  if (!id || typeof id !== "string" || id.length < 10) return id || "";
  return `${id.slice(0, 4)}…${id.slice(-4)}`;
}

/** Human-readable date, e.g. "16 Oct 2026, 3:42 PM". */
export function formatDate(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * Generate an idempotency key for a transfer attempt. The same key is reused
 * across retries of one attempt so the backend treats them as a single transfer.
 */
export function newIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `idem-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}
