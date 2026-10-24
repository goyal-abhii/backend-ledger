import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AccountDetail from "./pages/AccountDetail";
import Transfer from "./pages/Transfer";
import NotFound from "./pages/NotFound";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public auth routes — redirect to dashboard if already signed in */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route
        path="/register"
        element={isAuthenticated ? <Navigate to="/" replace /> : <Register />}
      />

      {/* Protected app — shares the navbar layout */}
      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/accounts/:id" element={<AccountDetail />} />
        <Route path="/transfer" element={<Transfer />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
