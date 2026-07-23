import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useSearchParams } from "react-router-dom";
import {
  useVerifyResetTokenQuery,
  useConfirmPasswordResetMutation
} from "../services/authApi.ts";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("resetToken") || "";

  const {
    isLoading: isVerifying,
    isError: isTokenInvalid
  } = useVerifyResetTokenQuery(token, {
    skip: !token,
  });

  const [confirmReset, { isLoading: isResetting }] = useConfirmPasswordResetMutation();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        setFormError(typeof error.data === "string" ? error.data : "Failed to reset password.");
      } else {
        setFormError("An unexpected error occurred. Please try again.");
      }
    }
  };

  if (!token || isTokenInvalid) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center py-12 px-6 font-sans">
        <div className="w-full max-w-md text-center">
          <h2 className="text-3xl font-serif text-[#BD3900] mb-4">Invalid Link</h2>
          <p className="text-gray-500 mb-8">
            This password reset link is missing, expired, or has already been used.
          </p>
          <Link
            to="/forgot-password"
            className="inline-block bg-black text-white px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#BD3900] transition-all duration-300"
          >
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center items-center py-12 px-6 font-sans">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">
          Verifying secure link...
        </p>
      </div>
    );
  }

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
            Secure Account
          </h2>
          <p className="mt-4 text-sm uppercase tracking-widest text-gray-500 font-bold">
            Create a new password
          </p>
        </div>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <div className="p-6 border border-black/10 bg-white shadow-sm">
              <p className="text-lg font-serif text-black">
                Your password has been successfully reset.
              </p>
            </div>

            <Link
              to="/login"
              className="inline-block mt-8 bg-black text-white w-full py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#BD3900] transition-colors"
            >
              Log In Now
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400"
                >
                  New Password
                </label>
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
              disabled={isResetting}
              className="w-full bg-black text-white py-4 mt-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#BD3900] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isResetting ? "Saving..." : "Update Password"}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ResetPassword;
