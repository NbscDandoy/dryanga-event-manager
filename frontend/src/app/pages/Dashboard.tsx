// src/app/pages/Dashboard.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight,
  UserCheck,
  DollarSign,
  TrendingUp,
} from "lucide-react";

import { EventCard } from "../Components/EventCard";
import { AnalyticsCard } from "../Components/AnalyticsCard";
import { EventOverview } from "../Components/EventOverview";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { MobilePreview } from "../Components/MobilePreview";
import { useEvents } from "../context/EventsContext";
import { useAuth } from "../context/AuthContext";
import ManageEventModal from "../Components/ManageEventModal";
import type { Event } from "../context/EventsContext";

const analyticsData = [
  { month: "Jan", registrations: 85 },
  { month: "Feb", registrations: 120 },
  { month: "Mar", registrations: 180 },
  { month: "Apr", registrations: 350 },
  { month: "May", registrations: 428 },
];

export function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [greeting, setGreeting] = useState("Welcome");

  const context = useEvents();
  const events = context?.events ?? [];

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) {
      setGreeting("Good Morning");
    } else if (currentHour < 18) {
      setGreeting("Good Afternoon");
    } else {
      setGreeting("Good Evening");
    }
  }, []);

  // Safe helper parsing handler to clean emails or full name strings down to just a first name
  const parseFirstName = (): string => {
    const rawIdentifier = user?.fullName || user?.name || user?.email;
    if (!rawIdentifier) return "Anyafrancine";

    let cleanString = rawIdentifier.includes("@") 
      ? rawIdentifier.split("@")[0] 
      : rawIdentifier;

    cleanString = cleanString.replace(/[0-9]/g, "");
    const firstWord = cleanString.trim().split(" ")[0];
    if (!firstWord) return "Anyafrancine";

    return firstWord.charAt(0).toUpperCase() + firstWord.slice(1).toLowerCase();
  };

  const studentFirstName = parseFirstName();

  const formatDate = (dateString: string) => {
    if (!dateString) return "No Date Provided";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  // ✅ NEW: Native Data Exporter Logic for System Management
  const handleExportSystemData = () => {
    if (!events || events.length === 0) {
      alert("No active events dataset found to export.");
      return;
    }

    try {
      // Build standard layout matrix for CSV translation
      const csvHeaders = ["Event ID", "Title", "Date", "Location/Venue", "Participants Count"];
      const csvRows = events.map(event => [
        `"${event.id}"`,
        `"${event.title.replace(/"/g, '""')}"`,
        `"${formatDate(event.date)}"`,
        `"${(event.venue || event.location || "Main Campus Hall").replace(/"/g, '""')}"`,
        event.current_participants || 0
      ]);

      const csvContent = [
        csvHeaders.join(","),
        ...csvRows.map(row => row.join(","))
      ].join("\n");

      // Initialize clean client browser link allocation streams
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      link.setAttribute("href", url);
      link.setAttribute("download", `DYCI_System_Export_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean garbage collection values
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export stream interrupted:", error);
      alert("System data packaging failed. Check log references.");
    }
  };

  const displayedEvents = events.slice(0, 3);
  const tableEvents = events.slice(0, 3);

  const handleManageEvent = (event: Event) => {
    if (!event) return;
    setSelectedEvent(event);
  };

  return (
    <>
      {/* MODAL WRAPPER */}
      {selectedEvent && (
        <ManageEventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}

      <div className="w-full space-y-6 font-sans text-left select-none px-1 sm:px-0">

        {/* 🎓 INSTITUTIONAL IDENTITY & WORKSPACE GREETING SECTION */}
        <div className="space-y-1">
          <p className="text-[11px] sm:text-xs font-black tracking-widest text-[#1e40af] uppercase">
            Dr. Yanga's Colleges, Inc.
          </p>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
            {greeting}, {studentFirstName}! 👋
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-400 font-semibold tracking-wide uppercase">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>

        <hr className="border-slate-100" />

        {/* SECTION HEADER */}
        <div className="flex justify-between items-center w-full gap-4">
          <h2 className="text-xl font-bold text-gray-800 tracking-tight shrink-0">
            Upcoming Events
          </h2>

          <button
            className="text-[#1e40af] flex items-center gap-1 hover:gap-2 transition-all text-sm font-bold cursor-pointer whitespace-nowrap"
            onClick={() => navigate("/dashboard/all-events")}
          >
            View All
            <ChevronRight className="w-4 h-4 shrink-0" />
          </button>
        </div>

        {/* TABS CONTROLLER */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 w-full">
          {[
            ["Upcoming", "/dashboard"],
            ["Managed", "/dashboard/my-events"],
            ["Past", "/dashboard/past-events"],
            ["All", "/dashboard/all-events"],
          ].map(([label, path]) => {
            const isActive = location.pathname === path;
            return (
              <button
                key={label}
                onClick={() => navigate(path)}
                className={`flex-1 sm:flex-none text-center px-5 py-2.5 rounded-xl text-sm font-semibold transition shadow-sm cursor-pointer whitespace-nowrap ${
                  isActive
                    ? "bg-[#1e40af] text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 w-full">

          {/* LEFT CONTENT CONTAINER */}
          <div className="xl:col-span-2 space-y-6 w-full min-w-0">

            {/* EVENT CARDS SUB-GRID */}
            {displayedEvents.length === 0 ? (
              <div className="bg-white border border-slate-100 rounded-xl p-8 text-center text-sm font-medium text-slate-400 shadow-sm w-full">
                No upcoming events yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                {displayedEvents.map((event) => (
                  <div key={event.id} className="w-full flex flex-col justify-between">
                    <EventCard
                      event={event}
                      formattedDate={formatDate(event.date)}
                      onManage={() => handleManageEvent(event)}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* ANALYTICS BLOCK */}
            <div className="space-y-4 w-full">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">
                Event Analytics
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
                <AnalyticsCard
                  icon={UserCheck}
                  value="428"
                  label="Total Registrations"
                  color="#1e40af"
                />
                <AnalyticsCard
                  icon={TrendingUp}
                  value="216"
                  label="Check-ins Today"
                  color="#10b981"
                />
                <AnalyticsCard
                  icon={DollarSign}
                  value="₱10,000"
                  label="Event Revenue"
                  color="#fbbf24"
                />
              </div>

              {/* ANALYTICS GRAPH CARD */}
              <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm w-full">
                <h3 className="font-semibold text-gray-800 mb-4">
                  Registration Trends
                </h3>

                <div className="h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="month" stroke="#94a3b8" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                      <YAxis stroke="#94a3b8" tickLine={false} axisLine={false} className="text-xs font-semibold" />
                      <Tooltip cursor={{ fill: '#f8fafc' }} />
                      <Bar
                        dataKey="registrations"
                        fill="#1e40af"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={40}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* RECENTLY MANAGED DATA TABLE */}
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm w-full">
              <h3 className="font-semibold text-gray-800 mb-4">
                Recently Managed Events
              </h3>

              <div className="overflow-x-auto border border-slate-50 rounded-xl w-full">
                <table className="w-full text-left border-collapse min-w-[550px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                      <th className="py-4 px-5">Date</th>
                      <th className="py-4 px-5">Name</th>
                      <th className="py-4 px-5">Venue</th>
                      <th className="py-4 px-5 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-50 text-sm">
                    {tableEvents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 font-medium bg-white">
                          No records accessible. Create an event to begin.
                        </td>
                      </tr>
                    ) : (
                      tableEvents.map((event) => (
                        <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-5 text-slate-500 font-medium whitespace-nowrap">
                            {formatDate(event.date)}
                          </td>
                          <td className="py-4 px-5 font-bold text-slate-800">
                            {event.title}
                          </td>
                          <td className="py-4 px-5 text-slate-500 font-medium">
                            {event.venue || event.location || "Main Campus Hall"}
                          </td>
                          <td className="py-4 px-5 text-right whitespace-nowrap">
                            <button
                              className="bg-[#1e40af] hover:bg-blue-800 text-white px-5 py-2 rounded-xl text-xs font-bold transition shadow-sm cursor-pointer inline-block tracking-wide"
                              onClick={() => handleManageEvent(event)}
                            >
                              Manage Event
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR WRAPPER */}
          <div className="space-y-6 w-full shrink-0">
            {/* ✅ FIX: We pass the export logic action down into the overview module component */}
            <EventOverview onExport={handleExportSystemData} />
            <MobilePreview />
          </div>
        </div>
      </div>
    </>
  );
}