import React, { useState } from "react";
import { useRegisterMutation } from "../services/authApi.ts";
import { useNavigate, Link } from "react-router-dom";
import {
  AuthShell,
  Field,
  PasswordField,
  FormError,
  SubmitButton,
  AuthNote,
  KICKER,
} from "./AuthShell.tsx";

const RegisterForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const [register, { isLoading }] = useRegisterMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!name || !email || !password) {
      setFormError("Please fill out all fields.");
      return;
    }

    try {
      const response = await register({ email, password, name }).unwrap();

      if (response) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate("/login");
        }, 4000);
      } else {
        setFormError("Registration successful, but no confirmation received.");
      }
    } catch (error: any) {
      console.log("Failed to register: ", error);
      if (error.data && error.data.error) {
        setFormError(error.data.error);
      } else {
        setFormError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  if (isSuccess) {
    return (
      <AuthShell
        kicker="Confirm your address"
        title="Check your inbox"
        standfirst={`We've sent a confirmation link to ${email}.`}
      >
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="w-4 h-4 border border-rule border-t-accent rounded-full animate-spin"
          />
          <span className={`${KICKER} text-ink-soft`}>Redirecting to sign in…</span>
        </div>

        <AuthNote>
          Nothing arrived? Check your spam folder, or{" "}
          <Link
            to="/login"
            className="text-ink hover:text-accent transition-colors underline decoration-1 underline-offset-4"
          >
            sign in
          </Link>
          .
        </AuthNote>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      kicker="Account"
      title="Join the archive"
      standfirst="Create an account to follow the publication."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <Field
          id="name"
          label="Full Name"
          value={name}
          onChange={setName}
          placeholder="Joshua Jenkins"
          autoComplete="name"
          required
        />

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
          autoComplete="new-password"
          required
        />

        <FormError>{formError}</FormError>

        <SubmitButton
          isLoading={isLoading}
          idle="Create Account"
          busy="Creating account…"
        />
      </form>

      <AuthNote>
        Already registered?{" "}
        <Link
          to="/login"
          className="text-ink hover:text-accent transition-colors underline decoration-1 underline-offset-4"
        >
          Log In
        </Link>
      </AuthNote>
    </AuthShell>
  );
};

export default RegisterForm;
