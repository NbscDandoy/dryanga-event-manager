// src/app/Components/Header.tsx
import { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChevronDown,
  User,
  LogOut,
  CalendarDays,
  Menu,
  QrCode,
  X,
  CheckCircle2,
  Megaphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEvents } from "../context/EventsContext";
import type { Notification } from "../context/EventsContext";
import { QRCodeSVG } from "qrcode.react";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export function Header({ onMenuToggle }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  
  // Controls the screen-centered modal pop up context
  const [modalNotif, setModalNotif] = useState<Notification | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications } = useEvents(); 

  const displayUser = {
    name: user?.fullName || "Mansilla Anyafrancine",
    studentId: user?.studentId || "STU077579",
    email: user?.email || "mansilla.anyafrancine.00103@dyci.edu.ph",
  };

  const avatarLetter = displayUser.name.trim().charAt(0).toUpperCase();
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSelectNotification = (notif: Notification) => {
    setModalNotif(notif); 
    setNotifOpen(false);  
    notif.unread = false; 
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔍 Helper to detect if the notification is an official registration transaction
  const isRegistrationNotif = !!(modalNotif?.referenceNo || modalNotif?.totalAmount);

  return (
    <header className="h-[70px] bg-[#1e40af] px-2 sm:px-4 w-full flex justify-between items-center relative z-40 shrink-0 select-none border-b border-white/5">
      
      {/* LEFT - BRAND LAYOUT */}
      <div className="flex items-center gap-1 sm:gap-2 min-w-0 flex-1 mr-1">
        <button
          onClick={onMenuToggle}
          className="p-1.5 rounded-lg text-blue-100 hover:bg-white/10 active:bg-white/20 transition md:hidden flex-shrink-0 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0 space-y-0">
          <p className="text-[10px] sm:text-xs font-black tracking-widest text-blue-200/90 uppercase leading-none mb-0.5">
            Welcome To
          </p>
          <h1 className="text-sm sm:text-lg font-black text-white tracking-wide truncate leading-tight">
            Dr. Yanga's Events Manager
          </h1>
        </div>
      </div>

      {/* RIGHT - NAVIGATION WRAPPER CONTROL */}
      <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
        
        {/* NOTIFICATIONS BELL DROPDOWN */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-xl bg-white/10 hover:bg-white/20 transition text-white border border-white/5 cursor-pointer"
          >
            <Bell className="w-[19px] h-[19px] sm:w-[21px] sm:h-[21px]" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center border-2 border-[#1e40af]">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-[-45px] sm:right-0 mt-3 w-72 sm:w-80 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden max-sm:fixed max-sm:left-4 max-sm:right-4 max-sm:top-[65px] max-sm:w-auto z-40 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-3 border-b font-bold text-slate-800 text-sm bg-slate-50/50">
                Notifications
              </div>
              <div className="max-h-64 sm:max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400 font-medium">No alerts available</div>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => handleSelectNotification(notif)}
                      className={`px-4 py-3 border-b cursor-pointer hover:bg-slate-50 flex gap-3 text-left transition-colors ${
                        !notif.unread ? "opacity-60 bg-white" : "bg-blue-50/40"
                      }`}
                    >
                      <CalendarDays className={`w-4 h-4 mt-0.5 flex-shrink-0 ${!notif.unread ? 'text-slate-400' : 'text-blue-500'}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-xs sm:text-sm line-clamp-1 truncate ${!notif.unread ? 'text-slate-500 font-normal' : 'font-semibold text-slate-700'}`}>
                          {notif.eventTitle || "Campus Bulletin"}
                        </p>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{notif.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* DIVIDER */}
        <div className="h-5 w-[1px] bg-white/20"></div>

        {/* PROFILE DROPDOWN */}
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none block cursor-pointer">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-[32px] h-[32px] md:w-[36px] md:h-[36px] rounded-full bg-amber-500 text-white font-black flex items-center justify-center text-xs md:text-sm shadow-sm flex-shrink-0 border-2 border-white/20">
                {avatarLetter}
              </div>
              <div className="text-left hidden sm:block max-w-[130px] md:max-w-[180px]">
                <div className="text-[13px] font-extrabold flex items-center gap-0.5 text-white leading-none">
                  <span className="truncate">{displayUser.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-blue-200 flex-shrink-0" />
                </div>
                <div className="text-[10px] text-blue-200/70 font-semibold truncate mt-0.5">
                  {displayUser.studentId}
                </div>
              </div>
            </div>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-3 w-56 sm:w-64 bg-white border border-slate-100 rounded-xl shadow-xl py-1 transform origin-top-right transition-all z-50">
              <div className="px-4 py-3 border-b border-slate-100 text-left bg-slate-50/50">
                <p className="font-bold text-slate-800 text-xs sm:text-sm truncate">{displayUser.name}</p>
                <p className="text-[11px] text-slate-400 truncate mt-0.5">{displayUser.email}</p>
              </div>
              <div className="p-1.5 space-y-0.5">
                <button
                  onClick={() => {
                    navigate("/dashboard/settings");
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs sm:text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors text-left font-semibold cursor-pointer"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  Profile Settings
                </button>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    navigate("/login");
                  }}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs sm:text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors text-left font-semibold cursor-pointer"
                >
                  <LogOut className="w-4 h-4 text-red-400" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* 🚨 SCREEN POPUP OVERLAY MODAL WINDOW */}
      {modalNotif && (
        <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-200">
          <div className="absolute inset-0 -z-10" onClick={() => setModalNotif(null)} />

          <div className="bg-white rounded-2xl w-full max-w-[420px] shadow-2xl overflow-hidden flex flex-col transform transition-all text-left border border-slate-100 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header (Changes color based on event context) */}
            <div className={`px-5 py-4 text-white flex justify-between items-center shrink-0 ${isRegistrationNotif ? 'bg-[#00a669]' : 'bg-[#1e40af]'}`}>
              <div className="flex items-center gap-2">
                {isRegistrationNotif ? <CheckCircle2 size={18} className="text-white" /> : <Megaphone size={18} className="text-blue-200" />}
                <h3 className="text-sm font-bold tracking-tight">
                  {isRegistrationNotif ? "Registration Complete" : "Campus Notice"}
                </h3>
              </div>
              <button 
                onClick={() => setModalNotif(null)} 
                className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content Body */}
            <div className="p-5 space-y-4">
              
              {/* LAYOUT A: STANDARD BULLETIN NOTICE (NO QR, JUST A WELCOME MESSAGE) */}
              {!isRegistrationNotif ? (
                <div className="space-y-4 py-2">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-blue-500 tracking-wider">Event Highlight</span>
                    <h4 className="text-base font-extrabold text-slate-800 leading-snug">{modalNotif.eventTitle}</h4>
                  </div>
                  
                  <div className="bg-blue-50/50 border border-blue-100/70 p-4 rounded-xl text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    👋 Welcome! {modalNotif.message || "We are happy to have you view this campus bulletin update notification."}
                  </div>
                </div>
              ) : (
                /* LAYOUT B: OFFICIAL REGISTRATION RECEIPT FLOW */
                <div className="space-y-4">
                  
                  {/* 1. THE CORRESPONDING REGISTERED EVENT TITLE */}
                  <div>
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block">Registered Event Target</span>
                    <h4 className="text-sm font-extrabold text-slate-800 leading-snug mt-0.5">
                      {modalNotif.eventTitle}
                    </h4>
                  </div>

                  {/* 2. SCANNABLE QR CODE MATRIX */}
                  <div className="flex flex-col items-center justify-center bg-white rounded-xl p-4 border border-slate-200 shadow-xs">
                    <QRCodeSVG 
                      value={JSON.stringify({
                        ref: modalNotif.referenceNo,
                        title: modalNotif.eventTitle,
                        seats: modalNotif.quantity
                      })}
                      size={140}
                      level="H"
                    />
                    <span className="text-[9px] font-mono font-bold tracking-widest text-slate-400 mt-2.5 uppercase">
                      Authorized Scan Token
                    </span>
                  </div>

                  {/* 3. ITEMIZATION TRANSACTION RECEIPT */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 font-mono text-[11px] space-y-1 text-slate-600">
                    <div className="flex justify-between">
                      <span>Ref No:</span>
                      <span className="text-slate-800 font-bold">{modalNotif.referenceNo || "DYCI-START-0000"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Pass Variant:</span>
                      <span className="text-slate-800 font-bold uppercase">{modalNotif.ticketType || "SYSTEM"}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Reserved Seats:</span>
                      {/* 🪑 Dynamically calculates true checked out seat count */}
                      <span className="text-slate-800 font-bold">
                        {modalNotif.quantity && modalNotif.quantity > 0 ? modalNotif.quantity : 1} Position(s)
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-slate-200 pt-2 text-xs font-sans mt-2">
                      <span className="font-bold text-slate-500">Grand Total:</span>
                      <span className="font-extrabold text-[#00a669]">
                        ₱{(modalNotif.totalAmount || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  {/* 4. THE THANKS MESSAGE TO JOINING AN EVENT */}
                  <div className="text-center bg-emerald-50 text-[#00a669] border border-emerald-100 p-3 rounded-xl text-xs font-bold shadow-2xs">
                    🎉 Thanks for joining the event! See you there!
                  </div>
                </div>
              )}

              {/* Dismiss Action Button */}
              <button 
                onClick={() => setModalNotif(null)} 
                className="w-full bg-[#1c2434] hover:bg-[#2c364a] text-white font-bold py-2.5 rounded-xl text-xs transition-all text-center cursor-pointer shadow-sm mt-2"
              >
                Close Viewport
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}