import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/** Redirects unauthenticated users to /login, remembering where they were. */
export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children;
}
