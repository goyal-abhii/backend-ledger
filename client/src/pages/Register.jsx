import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../components/ui/Toast";
import { getErrorMessage } from "../api/client";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import Alert from "../components/ui/Alert";
import "./Auth.css";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { signUp } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
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
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) next.email = "Email is required.";
    else if (!EMAIL_RE.test(form.email)) next.email = "Enter a valid email address.";
    // The backend requires a password longer than 6 characters.
    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 7) next.password = "Use at least 7 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;
    setSubmitting(true);
    try {
      const user = await signUp(form);
      toast.success(`Welcome aboard, ${user.name.split(" ")[0]}!`);
      navigate("/", { replace: true });
    } catch (err) {
      setSubmitError(getErrorMessage(err, "Couldn't create your account."));
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
          <h1 className="auth__title">Create your account</h1>
          <p className="auth__subtitle">Start managing accounts and transfers.</p>
        </div>

        {submitError && <Alert variant="danger">{submitError}</Alert>}

        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <Field
            label="Full name"
            name="name"
            autoComplete="name"
            placeholder="Jane Doe"
            value={form.name}
            onChange={update}
            error={errors.name}
          />
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
            autoComplete="new-password"
            placeholder="At least 7 characters"
            value={form.password}
            onChange={update}
            error={errors.password}
            hint="Must be longer than 6 characters."
          />
          <Button type="submit" block loading={submitting}>
            Create account
          </Button>
        </form>

        <p className="auth__alt">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
