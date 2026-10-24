import api from "./client";

/** GET /api/accounts/ -> Account[] */
export function listAccounts() {
  return api.get("/accounts/").then((r) => r.data.accounts);
}

/** POST /api/accounts/ -> Account */
export function createAccount() {
  return api.post("/accounts/").then((r) => r.data.account);
}

/** GET /api/accounts/balance/:accountId -> { accountId, balance } */
export function getBalance(accountId) {
  return api.get(`/accounts/balance/${accountId}`).then((r) => r.data);
}
