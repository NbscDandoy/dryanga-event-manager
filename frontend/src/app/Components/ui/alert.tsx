import { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "./Alert"; // Adjust this path to where your Alert file lives
import { CheckCircle2 } from "lucide-react";

export function ProfileSettingsPage() {
  // Local state to show an on-page success banner after saving
  const [showBanner, setShowBanner] = useState(false);

  const handleUpdateProfileDetails = () => {
    // 1. Structure the data exactly how your custom Header expect notification payloads
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
      read: false, // Explicitly false so the amber badge counts it immediately
    };

    // 2. Fetch current user notifications from localStorage
    const savedNotificationsRaw = localStorage.getItem("user_notifications");
    let currentCollection = [];

    if (savedNotificationsRaw) {
      try {
        currentCollection = JSON.parse(savedNotificationsRaw);
      } catch (e) {
        currentCollection = [];
      }
    }

    // 3. Prepend the profile information item directly to the top of the list
    const updatedCollection = [newProfileNotification, ...currentCollection];

    // 4. Update the client-side localStorage cluster
    localStorage.setItem("user_notifications", JSON.stringify(updatedCollection));

    // 5. Fire a global storage dispatch event so Header.tsx forces a visual re-render immediately
    window.dispatchEvent(new Event("storage"));

    // 6. Show on-page success state feedback to user
    setShowBanner(true);
    setTimeout(() => setShowBanner(false), 5000); // clear page banner banner automatically after 5s
  };

  return (
    <div className="space-y-6 max-w-2xl p-6 bg-white rounded-xl shadow-xs border border-slate-100">
      
      {/* 🟢 DYNAMIC ON-PAGE APP-LEVEL ALERT BANNER */}
      {showBanner && (
        <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <AlertTitle className="font-bold">Success!</AlertTitle>
          <AlertDescription className="text-emerald-700/90">
            Profile data has been pushed directly into your system notifications hub. Click your navigation bell icon at the top to view the full log!
          </AlertDescription>
        </Alert>
      )}

      {/* Mock Profile Card Preview Content UI layout */}
      <div>
        <h3 className="text-lg font-bold text-slate-800">Profile Details</h3>
        <p className="text-xs text-slate-500 mb-4">Review account details and notification parameters mapping structures.</p>
        
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-sm text-slate-700 font-medium">
          <p><strong>Name:</strong> Mansilla Anyafrancine</p>
          <p><strong>Student ID:</strong> STU00103</p>
          <p><strong>Email:</strong> mansilla.anyafrancine.00103@dyci.edu.ph</p>
        </div>
      </div>

      <button
        onClick={handleUpdateProfileDetails}
        className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition text-sm"
      >
        Push to Notification Hub
      </button>
    </div>
  );
}