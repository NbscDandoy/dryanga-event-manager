import { useState } from "react";
// ✅ Path points to your explicit capitalized shared dashboard directory
import { Alert, AlertTitle, AlertDescription } from "../Components/Alert"; 
import { CheckCircle2, User, Mail, ShieldCheck } from "lucide-react";

export function ProfileSettingsPage() {
  // Local state to manage the success notification banner visibility
  const [showBanner, setShowBanner] = useState(false);

  const handleUpdateProfileDetails = () => {
    // 1. Structure the data exactly how your custom Header expects notification payloads
    const newProfileNotification = {
      id: Date.now(), // Generate unique numeric ID
      message: "Profile settings reviewed and loaded.",
      time: "Just now",
      details: `Account Profile configuration successfully mapped:
• Name: Mansilla Anyafrancine
• Student ID: STU00103
• Email: mansilla.anyafrancine.00103@dyci.edu.ph

System Notification Rules:
• Event Reminders: Enabled
• New Event Alerts: Enabled
• Email Notifications: Disabled`,
      read: false, // Explicitly false so the notification count badge updates instantly
    };

    // 2. Fetch current user notifications from localStorage safely
    const savedNotificationsRaw = localStorage.getItem("user_notifications");
    let currentCollection = [];

    if (savedNotificationsRaw) {
      try {
        currentCollection = JSON.parse(savedNotificationsRaw);
      } catch (e) {
        currentCollection = [];
      }
    }

    // 3. Prepend the profile information item directly to the top of the queue array
    const updatedCollection = [newProfileNotification, ...currentCollection];

    // 4. Update the client-side localStorage cluster
    localStorage.setItem("user_notifications", JSON.stringify(updatedCollection));

    // 5. Fire a global storage dispatch event so your Header component updates its view instantly
    window.dispatchEvent(new Event("storage"));

    // 6. Show on-page custom notification banner
    setShowBanner(true);
    
    // Clear banner layout smoothly after 5 seconds
    const timer = setTimeout(() => setShowBanner(false), 5000);
    return () => clearTimeout(timer);
  };

  return (
    <div className="space-y-6 max-w-2xl text-left select-none">
      <div>
        <h2 className="text-slate-800 text-2xl font-extrabold tracking-tight">Profile Settings</h2>
        <p className="text-xs text-slate-400 mt-1">Review account profile layouts and notification distribution paths.</p>
      </div>

      {/* 🟢 TAILWIND V4 READY DYNAMIC SUCCESS BANNER */}
      {showBanner && (
        <Alert className="bg-emerald-50/80 backdrop-blur-xs border-emerald-200 text-emerald-800 rounded-xl animate-in fade-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <AlertTitle className="font-bold text-sm">Synchronized Successfully!</AlertTitle>
          <AlertDescription className="text-emerald-700/90 text-xs">
            Your workspace configuration details have been pushed directly to your account notifications hub. Check the gold notification bell layout in the navigation bar above to view the logs!
          </AlertDescription>
        </Alert>
      )}

      {/* Profile Card Context Dashboard Template */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-xl shadow-xs">
            M
          </div>
          <div>
            <h4 className="text-base font-bold text-slate-800">Mansilla Anyafrancine</h4>
            <p className="text-xs font-semibold text-slate-400">Student Account Matrix</p>
          </div>
        </div>

        <hr className="border-slate-100" />

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Student Identifier</span>
              <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-semibold text-sm">
                STU00103
              </div>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Campus Email Link</span>
              <div className="px-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-slate-700 font-semibold text-sm truncate flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">mansilla.anyafrancine.00103@dyci.edu.ph</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-xl p-3 text-xs text-slate-500 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            <span>This account profile is managed, validated, and verified by the <strong className="text-slate-700">Dr. Yanga's Academic Registry Office</strong>.</span>
          </div>
        </div>

        {/* Form Submission Action Area */}
        <div className="pt-2">
          <button
            onClick={handleUpdateProfileDetails}
            className="w-full sm:w-auto px-5 py-3 bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold rounded-xl shadow-xs transition-all text-xs cursor-pointer"
          >
            Push to Notification Hub
          </button>
        </div>
      </div>
    </div>
  );
}