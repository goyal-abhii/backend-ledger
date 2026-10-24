import axios from "axios";

/**
 * Single axios instance for the whole app.
 *
 * - baseURL comes from an env var; in dev it's "/api" so Vite's proxy forwards
 *   to the Express backend (same-origin, so the auth cookie works).
 * - withCredentials sends the backend's auth cookie on every request. That
 *   cookie is the primary auth mechanism, so we never store the JWT in
 *   localStorage.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  withCredentials: true,
});

/**
 * Belt-and-suspenders: after login we also set the token as an in-memory
 * Authorization header (the backend accepts either cookie or Bearer token).
 * It lives only in memory — cleared on refresh, where the cookie takes over.
 */
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}

/** Lets AuthContext react to 401s (expired/blacklisted token) globally. */
let unauthorizedHandler = null;
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = fn;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

/** Turn any axios error into a user-friendly message using the real cause. */
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.code === "ERR_NETWORK") {
    return "Can't reach the server. Make sure the backend is running on port 3000.";
  }
  return error?.message || fallback;
}

export default api;
