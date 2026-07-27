import React, { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  useVerifyResetTokenQuery,
  useConfirmPasswordResetMutation,
} from "../services/authApi.ts";
import {
  AuthShell,
  PasswordField,
  FormError,
  SubmitButton,
  AuthNote,
  KICKER,
} from "./AuthShell.tsx";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("resetToken") || "";

  const { isLoading: isVerifying, isError: isTokenInvalid } =
    useVerifyResetTokenQuery(token, { skip: !token });

  const [confirmReset, { isLoading: isResetting }] =
    useConfirmPasswordResetMutation();

  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (password.length < 8) {
      setFormError("Password must be at least 8 characters long.");
      return;
    }

    try {
      await confirmReset({ token, newPassword: password }).unwrap();
      setIsSuccess(true);
    } catch (error: any) {
      if (error.data) {
        setFormError(
          typeof error.data === "string"
            ? error.data
            : "Failed to reset password.",
        );
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (!token || isTokenInvalid) {
    return (
      <AuthShell
        kicker="Account recovery"
        title="This link has expired"
        standfirst="Reset links are single-use and time-limited. Request a fresh one and we'll send it straight over."
      >
        <Link
          to="/forgot-password"
          className={`inline-block w-full text-center bg-ink text-paper py-4 ${KICKER} hover:bg-accent transition-colors duration-300`}
        >
          Request New Link
        </Link>

        <AuthNote>
          <Link
            to="/login"
            className="text-ink-soft hover:text-accent transition-colors"
          >
            ← Return to sign in
          </Link>
        </AuthNote>
      </AuthShell>
    );
  }

  if (isVerifying) {
    return (
      <AuthShell kicker="Account recovery" title="Verifying your link">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="w-4 h-4 border border-rule border-t-accent rounded-full animate-spin"
          />
          <span className={`${KICKER} text-ink-soft`}>One moment…</span>
        </div>
      </AuthShell>
    );
  }

  if (isSuccess) {
    return (
      <AuthShell
        kicker="Account recovery"
        title="Password updated"
        standfirst="Your new password is active. You can sign in with it now."
      >
        <Link
          to="/login"
          className={`inline-block w-full text-center bg-ink text-paper py-4 ${KICKER} hover:bg-accent transition-colors duration-300`}
        >
          Log In Now
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      kicker="Account recovery"
      title="Set a new password"
      standfirst="Use at least eight characters."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <PasswordField
          id="password"
          label="New Password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
        />

        <FormError>{formError}</FormError>

        <SubmitButton
          isLoading={isResetting}
          idle="Update Password"
          busy="Saving…"
        />
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
