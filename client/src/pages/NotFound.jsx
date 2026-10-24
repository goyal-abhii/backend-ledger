import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <div className="auth">
      <div className="auth__card card" style={{ textAlign: "center" }}>
        <h1 style={{ fontSize: "2.5rem", marginBottom: 8 }}>404</h1>
        <p className="muted" style={{ marginBottom: 24 }}>
          We couldn't find the page you were looking for.
        </p>
        <Link to="/">
          <Button>Back to dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
