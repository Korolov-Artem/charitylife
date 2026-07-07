import React, { useState } from "react";
import { useRegisterMutation } from "../services/authApi.ts";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const RegisterForm = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  // 1. ДОДАНО: Стан для відстеження успішної реєстрації
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
        // 2. ДОДАНО: Замість миттєвого переходу, показуємо повідомлення про успіх
        setIsSuccess(true);

        // Чекаємо 4 секунди перед редіректом на сторінку логіну
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

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-black selection:text-white relative">
      {/* --- BACK BUTTON --- */}
      {/* Ховаємо кнопку "Назад", якщо реєстрація успішна, щоб користувач не перервав процес */}
      {!isSuccess && (
        <button
          className="absolute top-10 left-6 lg:left-10 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#BD3900] transition-colors duration-300"
          onClick={() => navigate("/")}
        >
          ⇚ Back to Home
        </button>
      )}

      <div className="sm:mx-auto sm:w-full sm:max-w-md px-6 lg:px-0">
        <AnimatePresence mode="wait">
          {/* 3. ДОДАНО: Умовний рендеринг. Якщо успіх - показуємо повідомлення, якщо ні - форму */}
          {isSuccess ? (
            <motion.div
              key="success-message"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              className="text-center py-10"
            >
              <h2 className="text-4xl lg:text-5xl font-serif text-black leading-tight tracking-tight mb-6">
                Check Your Inbox
              </h2>
              <p className="text-sm uppercase tracking-[0.15em] text-gray-500 font-bold leading-relaxed mb-8">
                We've sent a confirmation link to <br />
                <span className="text-[#BD3900] lowercase tracking-normal">
                  {email}
                </span>
              </p>

              <div className="flex flex-col items-center justify-center gap-4">
                {/* Маленький індикатор завантаження, який показує, що відбувається редірект */}
                <div className="w-5 h-5 border-2 border-gray-300 border-t-[#BD3900] rounded-full animate-spin" />
                <p className="text-[10px] uppercase tracking-widest text-gray-400">
                  Redirecting to login...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="register-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
            >
              {/* --- HEADER --- */}
              <div className="text-center mb-12">
                <h2 className="mt-6 text-4xl lg:text-5xl font-serif text-black leading-tight tracking-tight">
                  Join the Archive
                </h2>
                <p className="mt-4 text-sm uppercase tracking-widest text-gray-500 font-bold">
                  Create your editorial account
                </p>
              </div>

              {/* --- FORM --- */}
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Name Input */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    placeholder="Joshua Jenkins"
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full appearance-none border-b border-black/20 bg-transparent px-0 py-3 text-lg text-black placeholder-gray-300 focus:border-[#BD3900] focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    placeholder="your@example.com"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full appearance-none border-b border-black/20 bg-transparent px-0 py-3 text-lg text-black placeholder-gray-300 focus:border-[#BD3900] focus:outline-none focus:ring-0 transition-colors"
                  />
                </div>

                {/* Password Input */}
                <div className="relative">
                  <label
                    htmlFor="password"
                    className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      value={password}
                      placeholder="••••••••"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full appearance-none border-b border-black/20 bg-transparent px-0 py-3 text-lg text-black placeholder-gray-300 focus:border-[#BD3900] focus:outline-none focus:ring-0 transition-colors pr-16"
                    />
                    {/* Password Toggle Button */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {formError && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="text-[#BD3900] text-sm font-serif italic text-center"
                  >
                    {formError}
                  </motion.div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white py-4 mt-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#BD3900] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </button>
              </form>

              {/* --- FOOTER LINK --- */}
              <div className="mt-10 text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-black hover:text-[#BD3900] transition-colors ml-2 underline underline-offset-4 decoration-1"
                  >
                    Log In
                  </Link>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RegisterForm;
