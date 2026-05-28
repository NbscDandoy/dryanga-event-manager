// src/app/Components/DashboardLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";

export function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen w-screen flex bg-[#f4f6fa] text-[#1e293b] font-sans antialiased overflow-hidden relative selection:bg-[#1e40af]/10">
      
      {/* 🔵 FIXED LEFT NAVIGATION LAYER (Responsive Sliding Drawer) */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-blue-700 transform transition-transform duration-300 ease-in-out
          md:relative md:transform-none md:flex md:flex-col flex-shrink-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <Sidebar onCloseMenu={() => setIsSidebarOpen(false)} />
      </div>

      {/* ⬛ BACKDROP BLUR OVERLAY (Closes menu when tapping outside sidebar on mobile) */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 md:hidden transition-opacity duration-300"
        />
      )}
      
      {/* ⚪ FLEXIBLE RIGHT FRAME WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        
        {/* Top Global Banner Bar */}
        <Header onMenuToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Dynamic Nested Route View Outlet with Modern Minimalist Web Scrollbar */}
        <main className="flex-1 p-4 md:p-6 w-full mx-auto max-w-7xl overflow-y-auto overflow-x-hidden animate-fadeIn [scrollbar-width:thin] [scrollbar-color:#cbd5e1_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-slate-400">
          <Outlet />
        </main>
        
        {/* Master System Copyright Footer Layout */}
        <footer className="w-full py-3.5 text-center text-[10px] text-gray-400 border-t border-gray-200/50 bg-white tracking-wider font-bold uppercase shrink-0 select-none">
          © 2026 DR. YANGA'S COLLEGES, INC. ALL RIGHTS RESERVED.
        </footer>
        
      </div>
    </div>
  );
}