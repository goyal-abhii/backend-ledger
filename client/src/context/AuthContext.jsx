import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { login as loginApi, logout as logoutApi, register as registerApi } from "../api/auth";
import { setAuthToken, setUnauthorizedHandler } from "../api/client";

const STORAGE_KEY = "ledger.user";
const AuthContext = createContext(null);

function readStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  // Only the non-sensitive user object is persisted — never the token.
  const [user, setUser] = useState(readStoredUser);

  const clearSession = useCallback(() => {
    setUser(null);
    setAuthToken(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* storage unavailable — ignore */
    }
  }, []);

  // If any request comes back 401 (expired or blacklisted token), log out.
  useEffect(() => {
    setUnauthorizedHandler(clearSession);
    return () => setUnauthorizedHandler(null);
  }, [clearSession]);

  const saveSession = useCallback((nextUser, token) => {
    setUser(nextUser);
    setAuthToken(token);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
      /* storage unavailable — ignore */
    }
  }, []);

  const signIn = useCallback(
    async (credentials) => {
      const data = await loginApi(credentials);
      saveSession(data.user, data.token);
      return data.user;
    },
    [saveSession]
  );

  const signUp = useCallback(
    async (payload) => {
      const data = await registerApi(payload);
      saveSession(data.user, data.token);
      return data.user;
    },
    [saveSession]
  );

  const signOut = useCallback(async () => {
    try {
      await logoutApi();
    } catch {
      /* even if the network call fails, clear the client session */
    }
    clearSession();
  }, [clearSession]);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), signIn, signUp, signOut }),
    [user, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
