// src/app/pages/ForgotPassword.tsx
import React, { useState } from "react";
import { Mail, GraduationCap, ArrowLeft } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export function ForgotPassword() {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      const result = await resetPassword(email);
      if (result) {
        setMessage("Password reset link sent to your email.");
      } else {
        setError("Failed to send reset link. Please try again.");
      }
    } catch (err) {
      console.error("Reset error:", err);
      setError("Something went wrong. Try again later.");
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50">
      <div className="flex flex-1 justify-center items-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-xl space-y-6 relative">
          {/* BACK BUTTON inside the box */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center gap-1 text-slate-600 hover:text-slate-800 font-semibold text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* HEADER */}
          <div className="text-center space-y-2 mt-6">
            <div className="mx-auto w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-[#1e40af]">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Forgot Password
            </h1>
            <p className="text-sm text-slate-500">Enter your email to reset</p>
          </div>

          {/* ERROR / MESSAGE */}
          {error && (
            <div className="p-3 bg-red-50 text-xs text-red-600 font-semibold">
              {error}
            </div>
          )}
          {message && (
            <div className="p-3 bg-green-50 text-xs text-green-600 font-semibold">
              {message}
            </div>
          )}

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700">Email *</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="Enter your school email"
                  className="w-full pl-10 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#1e40af] text-white font-bold py-3 rounded-xl"
            >
              Send Reset Link
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
