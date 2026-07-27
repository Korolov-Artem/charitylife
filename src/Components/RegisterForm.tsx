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
      setFormError("Заповніть усі поля.");
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
        setFormError("Реєстрація пройшла, але підтвердження не надійшло.");
      }
    } catch (error: any) {
      console.log("Failed to register: ", error);
      if (error.data && error.data.error) {
        setFormError(error.data.error);
      } else {
        setFormError("Сталася непередбачувана помилка. Спробуйте пізніше.");
      }
    }
  };

  if (isSuccess) {
    return (
      <AuthShell
        kicker="Підтвердіть адресу"
        title="Перевірте пошту"
        standfirst={`We've sent a confirmation link to ${email}.`}
      >
        <div className="flex items-center gap-4">
          <span
            aria-hidden
            className="w-4 h-4 border border-rule border-t-accent rounded-full animate-spin"
          />
          <span className={`${KICKER} text-ink-soft`}>Перенаправляємо до входу…</span>
        </div>

        <AuthNote>
          Нічого не надійшло? Перевірте теку спаму або{" "}
          <Link
            to="/login"
            className="text-ink hover:text-accent transition-colors underline decoration-1 underline-offset-4"
          >
            увійдіть
          </Link>
          .
        </AuthNote>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      kicker="Обліковий запис"
      title="Приєднуйтеся до архіву"
      standfirst="Створіть обліковий запис, щоб стежити за виданням."
    >
      <form onSubmit={handleSubmit} className="space-y-8">
        <Field
          id="name"
          label="Повне імʼя"
          value={name}
          onChange={setName}
          placeholder="Олена Ковальчук"
          autoComplete="name"
          required
        />

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

        <PasswordField
          id="password"
          label="Пароль"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
          required
        />

        <FormError>{formError}</FormError>

        <SubmitButton
          isLoading={isLoading}
          idle="Створити акаунт"
          busy="Створення акаунта…"
        />
      </form>

      <AuthNote>
        Вже зареєстровані?{" "}
        <Link
          to="/login"
          className="text-ink hover:text-accent transition-colors underline decoration-1 underline-offset-4"
        >
          Увійти
        </Link>
      </AuthNote>
    </AuthShell>
  );
};

export default RegisterForm;
