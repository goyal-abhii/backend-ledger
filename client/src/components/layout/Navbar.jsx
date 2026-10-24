import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LogOut, Menu, X, ArrowLeftRight, LayoutDashboard } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../ui/Toast";
import "./Navbar.css";

function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "U";
  return parts
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("");
}

export default function Navbar() {
  const { user, signOut } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await signOut();
    toast.success("You've been logged out.");
    navigate("/login");
  }

  const linkClass = ({ isActive }) => `nav__link${isActive ? " is-active" : ""}`;

  return (
    <header className="nav">
      <div className="container nav__inner">
        <NavLink to="/" className="nav__brand">
          <span className="nav__logo" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 32 32">
              <path d="M9 10h14M9 16h14M9 22h8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </span>
          Ledger
        </NavLink>

        <button
          type="button"
          className="nav__toggle"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>

        <nav className={`nav__menu${open ? " is-open" : ""}`} onClick={() => setOpen(false)}>
          <NavLink to="/" end className={linkClass}>
            <LayoutDashboard size={17} />
            Dashboard
          </NavLink>
          <NavLink to="/transfer" className={linkClass}>
            <ArrowLeftRight size={17} />
            Transfer
          </NavLink>

          <div className="nav__user">
            <span className="nav__avatar" aria-hidden="true">
              {initials(user?.name)}
            </span>
            <span className="nav__userinfo">
              <span className="nav__username">{user?.name}</span>
              <span className="nav__useremail">{user?.email}</span>
            </span>
          </div>

          <button
            type="button"
            className="btn btn--ghost btn--sm nav__logout"
            onClick={handleLogout}
            disabled={loggingOut}
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
