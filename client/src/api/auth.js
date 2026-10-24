import api from "./client";

/** POST /api/auth/register -> { user, token } */
export function register({ name, email, password }) {
  return api.post("/auth/register", { name, email, password }).then((r) => r.data);
}

/** POST /api/auth/login -> { user, token } */
export function login({ email, password }) {
  return api.post("/auth/login", { email, password }).then((r) => r.data);
}

/** POST /api/auth/logout -> { message } */
export function logout() {
  return api.post("/auth/logout").then((r) => r.data);
}
