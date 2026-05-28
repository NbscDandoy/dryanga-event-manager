import { useState } from "react";
import { Calendar, Users, MapPin, Clock, TrendingUp, Award, History, ChevronDown } from "lucide-react";
import { useEvents } from "../context/EventsContext";
import type { Event } from "../context/EventsContext";

// Safe top-level date formatting utility with missing-string safety fallbacks
const formatDate = (dateString: string) => {
  if (!dateString) return "No Date Provided";
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'long', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

export function PastEvents() {
  const context = useEvents();
  const [activeTab, setActiveTab] = useState<"managed" | "attended">("managed");

  // Fallback state if context isn't ready or returns null
  if (!context || !context.events) {
    return (
      <div className="flex items-center justify-center h-96 w-full">
        <p className="text-slate-400 font-medium animate-pulse">Loading events archive...</p>
      </div>
    );
  }

  const { events } = context;

  // Filter past events safely
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const pastEvents = events.filter(event => {
    if (!event.date) return false;
    const eventDate = new Date(event.date);
    return eventDate < today;
  });

  const managedPastEvents = pastEvents.filter(event => event.isMyEvent);
  const attendedPastEvents = pastEvents.filter(event => !event.isMyEvent);

  const calculateAttendanceRate = (event: Event) => {
    const maxParts = parseInt(event.maxParticipants) || 0;
    const participantsCount = event.participants || 0;
    if (maxParts === 0) return 0;
    return Math.min(Math.round((participantsCount / maxParts) * 100), 100);
  };

  // INNER COMPONENT ARTIFACT MATCHING IMAGE 5
  const PastEventCard = ({ event }: { event: Event }) => {
    const attendanceRate = calculateAttendanceRate(event);
    const fallBackImage = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80";

    return (
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition flex flex-col justify-between w-full min-w-0">
        <div>
          <div className="relative">
            <img
              src={event.image || fallBackImage}
              alt={event.title || "Event Image"}
              className="w-full h-48 object-cover opacity-90"
            />
            <div className="absolute top-3 right-3 bg-slate-800/90 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-xs tracking-wide">
              Completed
            </div>
          </div>

          <div className="p-5 space-y-4">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight leading-snug break-words">
              {event.title}
            </h3>

            <div className="space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                <Calendar className="w-4 h-4 text-[#1e40af] shrink-0" />
                <span className="truncate">{formatDate(event.date)}</span>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                <Clock className="w-4 h-4 text-[#1e40af] shrink-0" />
                <span className="truncate">{event.time || "All Day Event"}</span>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                <MapPin className="w-4 h-4 text-[#1e40af] shrink-0" />
                <span className="truncate">{event.venue || event.location || "Campus Main Hall"}</span>
              </div>

              <div className="flex items-center gap-2.5 text-sm text-slate-600 font-medium">
                <Users className="w-4 h-4 text-[#1e40af] shrink-0" />
                <span className="truncate">{event.participants || 0} registered</span>
              </div>
            </div>

            {/* Attendance Rate Progress Bar */}
            <div className="pt-1">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Attendance Rate</span>
                <span className="text-xs font-bold text-slate-800">{attendanceRate}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    attendanceRate >= 80 ? 'bg-emerald-500' :
                    attendanceRate >= 50 ? 'bg-amber-500' :
                    'bg-rose-500'
                  }`}
                  style={{ width: `${attendanceRate}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Action button layout updated to match Image 5 mockup specs */}
        <div className="p-5 pt-0 space-y-3">
          <div className="flex items-center justify-between pt-3 border-t border-slate-100 w-full gap-2">
            <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs rounded-lg font-bold uppercase tracking-wide truncate">
              {event.category || "CAMPUS LIFE"}
            </span>
            {event.isMyEvent && (
              <span className="text-xs font-bold text-slate-400 flex items-center gap-1 uppercase tracking-wider shrink-0">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                Managed
              </span>
            )}
          </div>

          {/* MAXIMIZED FULL WIDTH INTERACTIVE DROP-DOWN BUTTON BAR */}
          <button className="w-full bg-[#1e40af] hover:bg-blue-800 text-white font-bold py-2.5 px-4 rounded-xl text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm">
            <span>Manage System</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const StatCard = ({ icon: Icon, label, value, bgColor }: { icon: any, label: string, value: number, bgColor: string }) => (
    <div className={`${bgColor} rounded-2xl shadow-sm p-6 flex flex-col justify-between w-full`}>
      <div className="flex items-center justify-between mb-2 w-full">
        <Icon className="w-8 h-8 text-white opacity-80 shrink-0" />
        <span className="text-3xl font-extrabold text-white tracking-tight">{value}</span>
      </div>
      <p className="text-white/90 text-xs font-bold uppercase tracking-wider truncate">{label}</p>
    </div>
  );

  const totalManaged = managedPastEvents.length;
  const totalAttended = attendedPastEvents.length;
  const totalParticipants = managedPastEvents.reduce((sum, event) => sum + (event.participants || 0), 0);

  return (
    <div className="w-full space-y-6 font-sans text-left select-none px-1 sm:px-0">
      
      {/* HEADER BAR */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center text-[#1e40af] shrink-0">
          <History className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Past Events Archive</h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">Metrics and history records gathered from platform logs.</p>
        </div>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
        <StatCard
          icon={Award}
          label="Events Managed"
          value={totalManaged}
          bgColor="bg-[#1e40af]"
        />
        <StatCard
          icon={Users}
          label="Events Attended"
          value={totalAttended}
          bgColor="bg-amber-500"
        />
        <StatCard
          icon={TrendingUp}
          label="Total Managed Impact"
          value={totalParticipants}
          bgColor="bg-emerald-500"
        />
      </div>

      {/* FIXED TAB BAR DESIGN (MATCHES IMAGE 6 EXACTLY) */}
      <div className="bg-[#f1f5f9] border border-slate-200/60 p-1.5 rounded-2xl flex gap-1 w-full max-w-md">
        <button
          onClick={() => setActiveTab("managed")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold tracking-tight transition cursor-pointer text-center whitespace-nowrap ${
            activeTab === "managed"
              ? "bg-[#1e40af] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Managed Events ({managedPastEvents.length})
        </button>
        <button
          onClick={() => setActiveTab("attended")}
          className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-bold tracking-tight transition cursor-pointer text-center whitespace-nowrap ${
            activeTab === "attended"
              ? "bg-[#1e40af] text-white shadow-sm"
              : "text-slate-500 hover:text-slate-800"
          }`}
        >
          Attended Events ({attendedPastEvents.length})
        </button>
      </div>

      {/* Dynamic Content Mapping Pipeline */}
      <div className="w-full">
        {activeTab === "managed" ? (
          managedPastEvents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm max-w-2xl mx-auto w-full">
              <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-700 text-lg font-bold tracking-tight">No past managed events</p>
              <p className="text-slate-400 text-sm font-medium mt-1">Events you create will appear here automatically after closure.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {managedPastEvents.map((event) => (
                <PastEventCard key={event.id} event={event} />
              ))}
            </div>
          )
        ) : (
          attendedPastEvents.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-2xl p-16 text-center shadow-sm max-w-2xl mx-auto w-full">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-700 text-lg font-bold tracking-tight">No past attended events</p>
              <p className="text-slate-400 text-sm font-medium mt-1">Events you join appear here seamlessly after completion.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              {attendedPastEvents.map((event) => (
                <PastEventCard key={event.id} event={event} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}