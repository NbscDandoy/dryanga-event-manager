import { ChevronRight, UserCheck, DollarSign, TrendingUp } from "lucide-react";
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
import { useState } from "react";
import { useNavigate } from "react-router";
import { MobilePreview } from "../Components/MobilePreview";
import { useEvents } from "../context/EventsContext";
import ManageEventModal from "../Components/ManageEventModal";
import type { Event } from "../context/EventsContext";

const analyticsData = [
  { id: "jan", month: "Jan", registrations: 85 },
  { id: "feb", month: "Feb", registrations: 120 },
  { id: "mar", month: "Mar", registrations: 180 },
  { id: "apr", month: "Apr", registrations: 350 },
  { id: "may", month: "May", registrations: 428 },
];

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // ✅ SAFE CONTEXT USAGE
  const context = useEvents();
  const events = context?.events ?? [];
  const updateEvent = context?.updateEvent ?? (() => {});

  const formatDate = (dateString: string) => {
    if (!dateString) return "No Date Provided";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const displayedEvents = events.slice(0, 3);
  const managedEventsLimit = events.slice(0, 3); // Dynamic slicing for safe table rows

  const handleManageEvent = (event?: Event) => {
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

      <div className="space-y-6 text-left select-none">
        {/* HEADER SECTION */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Upcoming Events</h2>

          <button
            onClick={() => navigate("/dashboard/all-events")}
            className="text-[#1e40af] flex items-center gap-1 hover:gap-2 transition-all text-sm font-semibold cursor-pointer"
          >
            View All
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* CONTROLS / TABS CONTAINER */}
        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
          <button
            className="px-6 py-2 rounded-lg bg-[#1e40af] hover:bg-blue-800 text-white text-sm font-medium transition cursor-pointer"
            onClick={() => navigate("/dashboard")}
          >
            Upcoming
          </button>

          <button
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition cursor-pointer"
            onClick={() => navigate("/dashboard/my-events")}
          >
            Managed
          </button>

          <button
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition cursor-pointer"
            onClick={() => navigate("/dashboard/past-events")}
          >
            Past
          </button>

          <button
            className="px-6 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition cursor-pointer"
            onClick={() => navigate("/dashboard/all-events")}
          >
            All
          </button>
        </div>

        {/* MAIN GRID BLOCK ARRANGEMENT */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          
          {/* LEFT SIDE DATA REGION */}
          <div className="xl:col-span-2 space-y-6">

            {/* EVENT GRID RENDER */}
            {displayedEvents.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-xl p-8 text-center text-gray-400 font-medium shadow-sm">
                No upcoming events found.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedEvents.map((event) => (
                  <EventCard
                    key={event.id}
                    event={event}
                    formattedDate={formatDate(event.date)}
                    onManage={() => handleManageEvent(event)}
                  />
                ))}
              </div>
            )}

            {/* EVENT ANALYTICS */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-800">Event Analytics</h2>
                <button
                  onClick={() => navigate("/dashboard/analytics")}
                  className="text-[#1e40af] flex items-center gap-1 hover:gap-2 transition-all text-sm font-semibold cursor-pointer"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  value="Public"
                  label="Access Mode"
                  color="#fbbf24"
                />
              </div>

              {/* RECHARTS PLOT CARD */}
              <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
                <h3 className="font-semibold text-gray-800 mb-4">Registration Trends</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={analyticsData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#f1f5f9"
                        vertical={false}
                      />
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

            {/* DATA TABLE (SAFE SYSTEM MAPPING) */}
            <div className="bg-white rounded-xl border border-slate-100 p-6 shadow-sm">
              <h3 className="font-semibold text-gray-800 mb-4">Recently Managed Events</h3>

              <div className="overflow-x-auto border border-slate-50 rounded-lg">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold text-xs uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4">Event Title</th>
                      <th className="py-3 px-4">Venue</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50 text-sm">
                    {managedEventsLimit.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="py-8 text-center text-slate-400 font-medium bg-white">
                          No records accessible. Create an event to begin.
                        </td>
                      </tr>
                    ) : (
                      managedEventsLimit.map((event) => (
                        <tr key={event.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 text-slate-500 font-medium">
                            {formatDate(event.date)}
                          </td>
                          <td className="py-3.5 px-4 font-bold text-slate-800">
                            {event.title}
                          </td>
                          <td className="py-3.5 px-4 text-slate-500 font-medium">
                            {event.venue || "Campus Main Hall"}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => handleManageEvent(event)}
                              className="bg-[#1e40af] hover:bg-blue-800 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition shadow-sm cursor-pointer"
                            >
                              Manage
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

          {/* RIGHT SIDEBAR PANEL WRAPPER */}
          <div className="space-y-6">
            <EventOverview />
            <MobilePreview />
          </div>

        </div>
      </div>
    </>
  );
}