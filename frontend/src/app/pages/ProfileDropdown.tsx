// src/app/Components/ProfileDropdown.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function ProfileDropdown() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  return (
    <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-lg">
      <div className="px-4 py-3 border-b border-slate-100">
        <p className="text-sm font-bold text-slate-800">{user?.fullName}</p>
        <p className="text-xs text-slate-500">{user?.studentId}</p>
        <p className="text-xs text-slate-500">{user?.email}</p>
      </div>

      <div className="flex flex-col">
        {/* ✅ Link Profile Settings to Settings page */}
        <button
          onClick={() => navigate("/dashboard/settings")}
          className="px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 text-left"
        >
          Profile Settings
        </button>

        <button
          onClick={logout}
          className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 text-left"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
