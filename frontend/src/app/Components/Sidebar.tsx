// src/app/Components/Sidebar.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarRange,
  PlusCircle,
  UserCheck,
  MapPin,
  BarChart3,
  History,
  Settings,
  X, // Added close icon for mobile views
} from "lucide-react";

interface SidebarProps {
  onCloseMenu?: () => void;
}

export function Sidebar({ onCloseMenu }: SidebarProps) {
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={18} />, path: "/dashboard" },
    { id: "my-events", label: "My Events", icon: <CalendarDays size={18} />, path: "/dashboard/my-events" },
    { id: "all-events", label: "All Events", icon: <CalendarRange size={18} />, path: "/dashboard/all-events" },
    { id: "create", label: "Create Event", icon: <PlusCircle size={18} />, path: "/dashboard/create-event", isSpecial: true },
    { id: "registrations", label: "Registrations", icon: <UserCheck size={18} />, path: "/dashboard/registrations" },
    { id: "venues", label: "Venues", icon: <MapPin size={18} />, path: "/dashboard/venues" },
    { id: "analytics", label: "Analytics", icon: <BarChart3 size={18} />, path: "/dashboard/analytics" },
    { id: "past-events", label: "Past Events", icon: <History size={18} />, path: "/dashboard/past-events" },
    { id: "settings", label: "Settings", icon: <Settings size={18} />, path: "/dashboard/settings" },
  ];

  return (
    <div className="w-full h-full bg-[#1e40af] text-white flex flex-col select-none">
      
      {/* --- BRAND HEADER LAYOUT --- */}
      <div className="p-5 flex items-start justify-between border-b border-blue-700/30">
        <div className="flex items-start gap-3 min-w-0">
          <div className="bg-amber-400 text-[#1e40af] p-2 rounded-xl flex items-center justify-center shadow-md shrink-0">
            <CalendarDays size={24} className="stroke-[2.5]" />
          </div>
          <div className="flex flex-col min-w-0">
            <h2 className="font-extrabold text-base tracking-tight leading-tight truncate">Dr. Yanga's</h2>
            <span className="text-xs text-amber-300 font-bold uppercase tracking-wider mt-0.5">Events Manager</span>
            <p className="text-[10px] text-blue-200/70 truncate mt-1 hidden sm:block">Campus Event Planning System</p>
          </div>
        </div>

        {/* MOBILE ONLY DRAWER INTERACTIVE CLOSE TRIGGER */}
        <button
          onClick={onCloseMenu}
          className="p-1 rounded-lg hover:bg-blue-700/50 text-blue-200 hover:text-white md:hidden transition flex-shrink-0"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      {/* --- SIDE NAVIGATION MENU --- */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto custom-scrollbar">
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.id}
              onClick={() => {
                navigate(item.path);
                onCloseMenu?.(); // Smoothly close drawer frame auto-click window adjustments on mobile phone
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all text-left ${
                isActive
                  ? "bg-blue-800 text-white shadow-inner"
                  : "text-blue-100 hover:bg-blue-700/50 hover:text-white"
              }`}
            >
              <div className={isActive ? "text-white" : "text-blue-300"}>
                {item.icon}
              </div>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>
      
    </div>
  );
}