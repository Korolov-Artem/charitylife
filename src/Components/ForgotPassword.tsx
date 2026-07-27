import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useRequestPasswordResetMutation } from "../services/authApi.ts";
import {
  AuthShell,
  Field,
  FormError,
  SubmitButton,
  AuthNote,
} from "./AuthShell.tsx";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [requestReset, { isLoading }] = useRequestPasswordResetMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email) {
      setFormError("Please enter a valid email address.");
      return;
    }

    try {
      await requestReset({ email }).unwrap();
      setIsSubmitted(true);
    } catch (error: any) {
      console.error("Reset request failed:", error);
      if (error.data) {
        setFormError(
          typeof error.data === "string"
            ? error.data
            : "Failed to process request.",
        );
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (isSubmitted) {
    return (
      <AuthShell kicker="Account recovery" title="Check your inbox">
        <p className="font-serif text-[1.0625rem] leading-[1.6] text-ink">
          If an account exists for{" "}
          <span className="text-accent">{email}</span>, a reset link is on its
          way.
        </p>
        <p className="mt-4 font-serif text-[0.9375rem] leading-[1.55] text-ink-soft">
          Check your spam folder if it hasn't arrived within a few minutes.
        </p>

        <AuthNote>
          <Link
            to="/login"
            className="text-ink hover:text-accent transition-colors underline decoration-1 underline-offset-4"
          >
            ← Return to sign in
          </Link>
        </AuthNote>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      kicker="Account recovery"
      title="Reset your password"
      standfirst="Enter your email and we'll send a link to set a new one."
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

        <FormError>{formError}</FormError>

        <SubmitButton
          isLoading={isLoading}
          idle="Send Reset Link"
          busy="Sending link…"
        />
      </form>

      <AuthNote>
        <Link
          to="/login"
          className="text-ink-soft hover:text-accent transition-colors"
        >
          Cancel
        </Link>
      </AuthNote>
    </AuthShell>
  );
};

export default ForgotPassword;
