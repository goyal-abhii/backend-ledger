import api from "./client";

/**
 * POST /api/transactions/
 * body: { fromAccount, toAccount, amount, idempotencyKey }
 * -> { message, transaction }
 *
 * Note: the backend currently takes ~15s to complete a transfer (a delay in
 * its transaction code). The UI handles this with a loading state.
 */
export function createTransfer({ fromAccount, toAccount, amount, idempotencyKey }) {
  return api
    .post("/transactions/", { fromAccount, toAccount, amount, idempotencyKey })
    .then((r) => r.data);
}
