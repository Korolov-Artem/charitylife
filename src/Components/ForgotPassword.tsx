import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useRequestPasswordResetMutation } from "../services/authApi.ts";

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
        setFormError(typeof error.data === "string" ? error.data : "Failed to process request.");
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
            Account Recovery
          </h2>
          <p className="mt-4 text-sm uppercase tracking-widest text-gray-500 font-bold">
            Reset your password
          </p>
        </div>

        {isSubmitted ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center space-y-6"
          >
            <div className="p-6 border border-black/10 bg-white shadow-sm">
              <p className="text-lg font-serif leading-relaxed text-black">
                If an account exists for <span className="font-bold text-[#BD3900]">{email}</span>, we have sent a password reset link to your inbox.
              </p>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                Please check your spam folder if it doesn't arrive within a few minutes.
              </p>
            </div>

            <Link
              to="/login"
              className="inline-block mt-8 text-xs font-bold uppercase tracking-[0.2em] text-black hover:text-[#BD3900] transition-colors underline decoration-1 underline-offset-4"
            >
              ← Return to Login
            </Link>
          </motion.div>
        ) : (
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
              {isLoading ? "Sending Link..." : "Send Reset Link"}
            </button>

            <div className="text-center mt-6">
              <Link
                to="/login"
                className="text-xs font-bold uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
