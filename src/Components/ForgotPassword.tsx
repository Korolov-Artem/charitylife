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
      setFormError("Введіть коректну електронну пошту.");
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
            : "Не вдалося обробити запит.",
        );
      } else {
        setFormError("Сталася непередбачувана помилка. Спробуйте ще раз.");
      }
    }
  };

  if (isSubmitted) {
    return (
      <AuthShell kicker="Відновлення доступу" title="Перевірте пошту">
        <p className="font-serif text-[1.0625rem] leading-[1.6] text-ink">
          Якщо акаунт для{" "}
          <span className="text-accent">{email}</span>, a reset link is on its
          way.
        </p>
        <p className="mt-4 font-serif text-[0.9375rem] leading-[1.55] text-ink-soft">
          Перевірте теку спаму, якщо лист не надійшов за кілька хвилин.
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
      kicker="Відновлення доступу"
      title="Скидання пароля"
      standfirst="Введіть свою пошту — ми надішлемо посилання для встановлення нового."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <Field
          id="email"
          label="Електронна пошта"
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
          idle="Надіслати посилання"
          busy="Надсилання…"
        />
      </form>

      <AuthNote>
        <Link
          to="/login"
          className="text-ink-soft hover:text-accent transition-colors"
        >
          Скасувати
        </Link>
      </AuthNote>
    </AuthShell>
  );
};

export default ForgotPassword;
