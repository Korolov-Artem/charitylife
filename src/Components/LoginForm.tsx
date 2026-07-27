import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/authApi.ts";
import {
  AuthShell,
  Field,
  PasswordField,
  FormError,
  SubmitButton,
  AuthNote,
  KICKER,
} from "./AuthShell.tsx";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      await login({ email, password }).unwrap();
      navigate("/");
    } catch (error: any) {
      if (error.data) {
        setFormError(
          typeof error.data === "string" ? error.data : "Invalid credentials.",
        );
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <AuthShell
      kicker="Account"
      title="Welcome back"
      standfirst="Sign in to continue reading and voting."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <Field
          id="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="your@example.com"
          autoComplete="email"
          required
        />

        <PasswordField
          id="password"
          label="Password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          required
          action={
            <Link
              to="/forgot-password"
              className={`${KICKER} text-accent hover:text-ink transition-colors`}
            >
              Forgot?
            </Link>
          }
        />

        <FormError>{formError}</FormError>

        <SubmitButton isLoading={isLoading} idle="Sign In" busy="Signing in…" />
      </form>

      <AuthNote>
        No account yet?{" "}
        <Link
          to="/register"
          className="text-ink hover:text-accent transition-colors underline decoration-1 underline-offset-4"
        >
          Register
        </Link>
      </AuthNote>
    </AuthShell>
  );
};

export default LoginForm;
