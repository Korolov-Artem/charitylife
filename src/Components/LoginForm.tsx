import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../services/authApi.ts";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      await login({ email, password }).unwrap();
      navigate("/"); // Redirect on success
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
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center py-12 px-6 font-sans selection:bg-black selection:text-white relative">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-12">
          <h2 className="mt-6 text-4xl lg:text-5xl font-serif text-black leading-tight tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-4 text-sm uppercase tracking-widest text-gray-500 font-bold">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
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

          <div className="relative">
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#BD3900] hover:text-black transition-colors"
              >
                Forgot?
              </Link>
            </div>
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {formError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="text-[#BD3900] text-sm font-serif italic text-center"
            >
              {formError}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-4 mt-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#BD3900] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>

          <div className="text-center mt-6">
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-black hover:text-[#BD3900] transition-colors underline decoration-1 underline-offset-4"
              >
                Register
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginForm;
