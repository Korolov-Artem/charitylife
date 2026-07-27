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
      setFormError("Пароль має містити щонайменше 8 символів.");
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
            : "Не вдалося змінити пароль.",
        );
      } else {
        setFormError("Сталася непередбачувана помилка. Спробуйте ще раз.");
      }
    }
  };

  if (!token || isTokenInvalid) {
    return (
      <AuthShell
        kicker="Відновлення доступу"
        title="Посилання застаріло"
        standfirst="Посилання одноразові й діють обмежений час. Надішлемо нове одразу після запиту."
      >
        <Link
          to="/forgot-password"
          className={`inline-block w-full text-center bg-ink text-paper py-4 ${KICKER} hover:bg-accent transition-colors duration-300`}
        >
          Надіслати нове посилання
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
      <AuthShell kicker="Відновлення доступу" title="Перевіряємо посилання">
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="w-4 h-4 border border-rule border-t-accent rounded-full animate-spin"
          />
          <span className={`${KICKER} text-ink-soft`}>Хвилинку…</span>
        </div>
      </AuthShell>
    );
  }

  if (isSuccess) {
    return (
      <AuthShell
        kicker="Відновлення доступу"
        title="Пароль оновлено"
        standfirst="Новий пароль уже діє. Тепер ви можете увійти з ним."
      >
        <Link
          to="/login"
          className={`inline-block w-full text-center bg-ink text-paper py-4 ${KICKER} hover:bg-accent transition-colors duration-300`}
        >
          Увійти зараз
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      kicker="Відновлення доступу"
      title="Встановіть новий пароль"
      standfirst="Щонайменше вісім символів."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <PasswordField
          id="password"
          label="Новий пароль"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
        />

        <FormError>{formError}</FormError>

        <SubmitButton
          isLoading={isResetting}
          idle="Оновити пароль"
          busy="Збереження…"
        />
      </form>
    </AuthShell>
  );
};

export default ResetPassword;
