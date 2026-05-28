// src/app/pages/Register.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, User, Eye, EyeOff, GraduationCap, IdCard, ArrowLeft, Briefcase } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // Role selection state: 'student' or 'teacher'
  const [role, setRole] = useState<'student' | 'teacher'>("student");
  
  // Split Name Fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  const [idNumber, setIdNumber] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // Session preservation state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim() || !idNumber.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      
      // Combine first name and last name cleanly for backend compatibility
      const combinedFullName = `${firstName.trim()} ${lastName.trim()}`;
      
      // ✅ FIX: Aligned explicitly with your AuthContext signature layout order:
      // register(fullName, studentId, email, password, rememberMe)
      const result = await register(
        combinedFullName,
        idNumber.trim(),
        email.trim(),
        password,
        rememberMe
      );

      if (result) {
        // Pass the explicit first name through the navigation history state
        navigate("/dashboard", { 
          replace: true, 
          state: { registeredFirstName: firstName.trim() } 
        });
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("Register error:", err);
      setError("Registration failed. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-slate-50">
      <div className="flex flex-1 justify-center items-center p-6">
        <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-xl space-y-6 relative">
          
          {/* BACK BUTTON */}
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 flex items-center gap-1 text-slate-600 hover:text-slate-800 font-semibold text-sm cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* HEADER */}
          <div className="text-center space-y-2 mt-6 select-none">
            <div className="mx-auto w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center text-[#1e40af]">
              <GraduationCap className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Create Account
            </h1>
            <p className="text-sm text-slate-500 tracking-wider font-semibold">DR. YANGA'S EVENT REGISTRATION</p>
          </div>

          {/* ERROR DISPLAY */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-semibold">
              {error}
            </div>
          )}

          {/* ACCOUNT TYPE TOGGLE SELECTOR */}
          <div className="space-y-1.5 select-none">
            <label className="text-xs font-bold text-slate-700">Account Type *</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => { setRole("student"); setIdNumber(""); }}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  role === "student"
                    ? "bg-[#1e40af] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                Student
              </button>
              <button
                type="button"
                onClick={() => { setRole("teacher"); setIdNumber(""); }}
                className={`flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  role === "teacher"
                    ? "bg-[#1e40af] text-white shadow-sm"
                    : "text-slate-600 hover:text-slate-800 hover:bg-slate-50/50"
                }`}
              >
                <Briefcase className="w-4 h-4" />
                Teacher / Faculty
              </button>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            
            {/* NAME INPUT GRID (First Name and Last Name) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700">First Name *</label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Juan"
                    className="w-full pl-10 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-sm transition-colors"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700">Last Name *</label>
                <div className="relative mt-1">
                  <input
                    type="text"
                    placeholder="Dela Cruz"
                    className="w-full px-4 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-sm transition-colors"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </div>
            </div>

            {/* DYNAMIC ID NUMBER (Student vs Teacher) */}
            <div>
              <label className="text-xs font-bold text-slate-700">
                {role === "student" ? "Student ID *" : "Faculty ID *"}
              </label>
              <div className="relative mt-1">
                <IdCard className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder={role === "student" ? "STU123456" : "FAC999123"}
                  className="w-full pl-10 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-sm transition-colors"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* EMAIL ADDRESS */}
            <div>
              <label className="text-xs font-bold text-slate-700">Email Address *</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  placeholder={role === "student" ? "student@dyci.edu.ph" : "faculty@dyci.edu.ph"}
                  className="w-full pl-10 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-sm transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs font-bold text-slate-700">Password *</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full pl-10 pr-10 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-sm transition-colors"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="text-xs font-bold text-slate-700">Confirm Password *</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="w-full pl-10 pr-10 py-2.5 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-600 outline-none text-sm transition-colors"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-3 text-slate-400 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* REMEMBER ME TOGGLE */}
            <div className="flex items-center justify-between py-1 select-none">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-[#1e40af] focus:ring-[#1e40af] w-4 h-4 cursor-pointer"
                />
                Remember devices / Keep session persistent
              </label>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e40af] text-white font-bold py-3 rounded-xl disabled:opacity-60 transition-all active:scale-[0.99] cursor-pointer text-sm shadow-md"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          {/* LOGIN LINK */}
          <p className="text-center text-xs text-slate-500 select-none">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-auto w-full py-4 text-center text-[10px] text-gray-400 border-t border-gray-200/50 bg-white tracking-wider font-bold uppercase select-none">
        © 2026 DR. YANGA'S COLLEGES, INC. ALL RIGHTS RESERVED.
      </footer>
    </div>
  );
}