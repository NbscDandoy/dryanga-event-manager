// src/app/pages/Login.tsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, GraduationCap } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Login() {
  const navigate = useNavigate();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.email) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail || !password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    // 🎓 VALIDATE EXACT STUDENT FORMAT: username.studentNumber@dyci.edu.ph
    const dyciStudentRegex = /^[a-z0-9.-]+\.[0-9]+@dyci\.edu\.ph$/;

    if (!dyciStudentRegex.test(trimmedEmail)) {
      setError("Invalid format. Please use your official student email: username.studentNumber@dyci.edu.ph");
      return;
    }

    try {
      setLoading(true);
      const result = await login(trimmedEmail, password, rememberMe);

      if (result) {
        navigate("/dashboard", { replace: true });
      } else {
        setError("Invalid email or password. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-slate-50 via-[#f8fafc] to-[#f1f5f9] font-sans antialiased">
      <div className="flex flex-1 flex-col justify-center items-center p-4 sm:p-6 pb-12">
        
        {/* LOGO AND MAIN EXTERNAL HEADERS */}
        <div className="text-center mb-8 space-y-3 max-w-sm px-4">
          <div className="mx-auto w-16 h-16 bg-[#1e40af] rounded-full flex items-center justify-center text-white shadow-md">
            <GraduationCap className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-[#1e293b] tracking-wide uppercase leading-tight">
              Dr Yanga's Event Registration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Sign in to your account
            </p>
          </div>
        </div>

        {/* MAIN CONTAINER PANEL CARD */}
        <div className="w-full max-w-[440px] bg-white border border-slate-100 p-6 sm:p-10 rounded-2xl shadow-xl shadow-slate-200/50 space-y-6">
          
          <div className="text-center">
            <h2 className="text-lg sm:text-2xl font-bold text-[#1e293b] tracking-tight">
              Welcome Back
            </h2>
          </div>

          {/* ERROR STATUS WINDOW */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-semibold text-left leading-relaxed">
              {error}
            </div>
          )}

          {/* FORM ROOT INPUTS */}
          <form onSubmit={handleLoginSubmit} className="space-y-5 text-left">
            
            {/* EMAIL INPUT FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide flex items-center">
                Email Address <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="username.studentNumber@dyci.edu.ph"
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 rounded-xl bg-white focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af] outline-none text-sm transition-all placeholder:text-slate-300 font-medium text-slate-800"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD INPUT FIELD */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 tracking-wide flex items-center">
                Password <span className="text-rose-500 ml-0.5">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3 border border-slate-200 rounded-xl bg-white focus:border-[#1e40af] focus:ring-1 focus:ring-[#1e40af] outline-none text-sm transition-all placeholder:text-slate-300 font-medium text-slate-800"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-slate-600 transition-colors p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* ACTION CHECKS LAYER */}
            <div className="flex items-center justify-between text-xs font-medium select-none pt-1">
              <label className="flex items-center gap-2 text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-[#1e40af] focus:ring-[#1e40af] transition-all cursor-pointer"
                />
                Remember me
              </label>
              <Link to="/forgot-password" className="text-[#1e40af] font-semibold hover:underline transition-all">
                Forgot password?
              </Link>
            </div>

            {/* SUBMIT EXECUTION TRIGGER BUTTON */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#1e40af] hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl disabled:opacity-60 transition-colors shadow-sm cursor-pointer text-sm tracking-wide"
              >
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </div>
          </form>

          {/* REGISTER FORWARD LINK PORTAL */}
          <p className="text-center text-xs text-slate-500 font-medium pt-1 select-none">
            Don't have an account?{" "}
            <Link to="/register" className="text-[#1e40af] font-bold hover:underline ml-0.5">
              Sign Up
            </Link>
          </p>
        </div>
      </div>

      {/* PLATFORM COPYRIGHT BRAND FOOTER */}
      <footer className="w-full py-4 text-center text-[10px] text-slate-400 border-t border-slate-200/40 bg-white/60 backdrop-blur-xs tracking-wider font-bold uppercase select-none mt-auto">
        © 2026 DR. YANGA'S COLLEGES, INC. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}