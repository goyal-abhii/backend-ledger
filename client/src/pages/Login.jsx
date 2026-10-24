import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import { getErrorMessage } from "../api/client";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import "./Auth.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const { signIn } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  }

  function validate() {
    const next = {};
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email address.";
    if (!form.password) next.password = "Password is required.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await signIn(form);
      toast.success(`Welcome back, ${user.name.split(" ")[0]}.`);
      navigate(from, { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Couldn't sign you in."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth">
      <div className="auth__card card">
        <div className="auth__head">
          <span className="auth__logo" aria-hidden="true">
            <svg width="22" height="22" viewBox="0 0 32 32">
              <path d="M9 10h14M9 16h14M9 22h8" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" />
            </svg>
          </span>
          <h1 className="auth__title">Welcome back</h1>
          <p className="auth__subtitle">Sign in to your Ledger account.</p>
        </div>

        {submitError && <Alert variant="danger">{submitError}</Alert>}

        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <Field
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update}
            error={errors.email}
          />
          <Field
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
            value={form.password}
            onChange={update}
            error={errors.password}
          />
          <Button type="submit" block loading={submitting}>
            Sign in
          </Button>
        </form>

        <p className="auth__alt">
          New to Ledger? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
}
