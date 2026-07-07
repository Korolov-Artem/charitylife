import React, { useState } from "react";
import { useLoginMutation } from "../services/authApi.ts";
import { useNavigate, Link } from "react-router-dom";
import { setCredentials } from "../redux/authSlice.ts";
import { useDispatch } from "react-redux";
import { motion } from "framer-motion";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);

  const [login, { isLoading }] = useLoginMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!email || !password) {
      setFormError("Please enter a valid email and password.");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();

      if (response.accessToken) {
        localStorage.setItem("authToken", response.accessToken);
        localStorage.setItem("userRole", response.role);

        if (response.deviceId) {
          localStorage.setItem("deviceId", response.deviceId);
        }
        dispatch(
          setCredentials({
            accessToken: response.accessToken,
            deviceId: response.deviceId,
            role: response.role,
          }),
        );

        // Instantly send them to the homepage upon success
        navigate("/");
      } else {
        setFormError(
          "Login successful, but no authorization token was received.",
        );
      }
    } catch (error: any) {
      console.log("Failed to login: ", error);
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
      <button
        className="absolute top-10 left-6 lg:left-10 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-[#BD3900] transition-colors duration-300"
        onClick={() => navigate("/")}
      >
        ⇚ Back to Home
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
        className="sm:mx-auto sm:w-full sm:max-w-md px-6 lg:px-0"
      >
        {/* --- HEADER --- */}
        <div className="text-center mb-12">
          <h2 className="mt-6 text-4xl lg:text-5xl font-serif text-black leading-tight tracking-tight">
            Welcome Back
          </h2>
          <p className="mt-4 text-sm uppercase tracking-widest text-gray-500 font-bold">
            Access your editorial account
          </p>
        </div>

        {/* --- FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-8">
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
              // Minimalist styling: just a bottom border that turns red on focus
              className="w-full appearance-none border-b border-black/20 bg-transparent px-0 py-3 text-lg text-black placeholder-gray-300 focus:border-[#BD3900] focus:outline-none focus:ring-0 transition-colors"
            />
          </div>

          {/* Password Input */}
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
                className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-[#BD3900] transition-colors"
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
            {isLoading ? "Authenticating..." : "Log In"}
          </button>
        </form>

        {/* --- FOOTER LINK --- */}
        <div className="mt-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
            Don't have an account yet?{" "}
            {/* Use React Router's Link instead of a standard <a> tag */}
            <Link
              to="/register"
              className="text-black hover:text-[#BD3900] transition-colors ml-2 underline underline-offset-4 decoration-1"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginForm;
