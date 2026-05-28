// src/app/Components/MobilePreview.tsx
import { Calendar, Clock, MapPin, Users, Menu, Bell, Search } from "lucide-react";

interface MobilePreviewProps {
  events?: Array<{
    id: string;
    title: string;
    date: string;
    location: string;
    current_participants?: number;
  }>;
  onRegisterClick?: (eventId: string, eventTitle: string) => void; // 👈 Added click handler prop
}

export function MobilePreview({ events = [] , onRegisterClick}: MobilePreviewProps) {
  // Safe fallback mock events to prevent empty view states
  const displayEvents = events.length > 0 ? events.slice(0, 2) : [
    {
      id: "demo-1",
      title: "Student Organization Fair",
      date: "2026-04-26",
      location: "Sapientia Hall",
      current_participants: 42
    },
    {
      id: "demo-2",
      title: "Spring Music Festival",
      date: "2026-04-29",
      location: "Campus Lawn",
      current_participants: 230
    }
  ];

  const totalRegistered = displayEvents.reduce((acc, curr) => acc + (curr.current_participants || 0), 0);

  // Default fallback action if no parent callback handler is specified
  const handleButtonClick = (id: string, title: string) => {
    if (onRegisterClick) {
      onRegisterClick(id, title);
    } else {
      alert(`Preview Mode: Registration clicked for "${title}"`);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 select-none w-full max-w-full overflow-hidden">
      <h3 className="font-bold text-slate-800 text-sm tracking-tight mb-4">Mobile App Preview</h3>

      {/* Mobile Phone Mockup Frame */}
      <div className="mx-auto w-full max-w-[280px]">
        <div className="bg-slate-900 rounded-[2.5rem] p-3 shadow-2xl border border-slate-800 w-full">
          
          {/* Screen Content Window */}
          <div className="bg-white rounded-[2rem] overflow-hidden flex flex-col relative border border-slate-950/10 h-[520px] w-full">
            
            {/* Status Bar Element */}
            <div className="bg-[#1e40af] px-6 pt-2.5 pb-1.5 flex justify-between items-center text-white/95 text-[10px] font-medium tracking-tight flex-shrink-0">
              <span>9:41</span>
              <div className="flex items-center gap-1.5 opacity-90">
                <div className="flex items-end gap-[1px] h-2">
                  <div className="w-[2px] h-[3px] bg-white rounded-xs"></div>
                  <div className="w-[2px] h-[5px] bg-white rounded-xs"></div>
                  <div className="w-[2px] h-[7px] bg-white rounded-xs"></div>
                  <div className="w-[2px] h-[8px] bg-white rounded-xs"></div>
                </div>
                <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 16 16">
                  <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.444 12.444 0 0 0 8 3 12.44 12.44 0 0 0 .663 5.379a.485.485 0 0 0-.048.736.518.518 0 0 0 .668.05A11.448 11.448 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164a.517.517 0 0 0 .668-.049z"/>
                  <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.455 9.455 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.577 1.336.525.525 0 0 0 .652-.065z"/>
                </svg>
                <div className="w-[18px] h-[9px] border border-white/80 rounded-[3px] p-[1px] relative flex items-center">
                  <div className="h-full w-4/5 bg-white rounded-[1px]"></div>
                  <div className="w-[1px] h-1 bg-white/80 absolute -right-[2px] rounded-r-xs"></div>
                </div>
              </div>
            </div>

            {/* Mobile Branding Header */}
            <div className="bg-[#1e40af] px-4 pb-4 flex-shrink-0">
              <div className="flex justify-between items-center mb-3">
                <button type="button" className="text-white p-1.5 hover:bg-white/10 rounded-lg active:scale-95 transition-all cursor-pointer">
                  <Menu className="w-4 h-4" />
                </button>
                <h1 className="text-white text-xs font-bold tracking-tight">Dr. Yanga's Events</h1>
                <button type="button" className="text-white p-1.5 hover:bg-white/10 rounded-lg active:scale-95 transition-all relative cursor-pointer">
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#fbbf24] rounded-full"></span>
                </button>
              </div>

              {/* Input Field Wrapper */}
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-3 py-1.5 flex items-center gap-2 border border-white/10">
                <Search className="w-3.5 h-3.5 text-white/70" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="bg-transparent text-white placeholder-white/60 text-[11px] w-full outline-none border-none focus:ring-0 p-0"
                  readOnly
                />
              </div>
            </div>

            {/* Scrollable View Feed Content Container */}
            <div className="p-3 bg-slate-50 flex-1 overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-slate-200 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent">
              
              {/* Metric Tracker Blocks */}
              <div className="grid grid-cols-3 gap-1.5 mb-4">
                <div className="bg-white rounded-xl p-1.5 text-center shadow-sm border border-slate-100">
                  <div className="text-[#1e40af] font-black text-sm">{displayEvents.length}</div>
                  <div className="text-slate-500 text-[8px] font-bold">Events</div>
                </div>
                <div className="bg-white rounded-xl p-1.5 text-center shadow-sm border border-slate-100">
                  <div className="text-[#10b981] font-black text-sm">{totalRegistered}</div>
                  <div className="text-slate-500 text-[8px] font-bold">Joined</div>
                </div>
                <div className="bg-white rounded-xl p-1.5 text-center shadow-sm border border-slate-100">
                  <div className="text-[#f59e0b] font-black text-sm">{displayEvents.length}</div>
                  <div className="text-slate-500 text-[8px] font-bold">Active</div>
                </div>
              </div>

              {/* Header Feed Controller row */}
              <div className="flex justify-between items-center mb-2 px-0.5">
                <h3 className="font-extrabold text-slate-800 text-[11px] tracking-tight">Upcoming Stack</h3>
                <button type="button" className="text-[#1e40af] text-[10px] flex items-center font-bold hover:opacity-80 cursor-pointer">
                  See All &nbsp;&rsaquo;
                </button>
              </div>

              {/* Dynamic Cards Loop Mapping */}
              {displayEvents.map((event, index) => {
                let formattedDate = "TBD";
                if (event.date) {
                  const parsedDate = new Date(event.date);
                  if (!isNaN(parsedDate.getTime())) {
                    formattedDate = parsedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                  }
                }

                return (
                  <div key={event.id || index} className="bg-white rounded-xl shadow-sm border border-slate-100 mb-3 overflow-hidden flex flex-col min-h-[210px]">
                    {index % 2 === 0 ? (
                      <div className="h-16 bg-gradient-to-br from-blue-500 to-blue-700 flex-shrink-0"></div>
                    ) : (
                      <div className="h-16 bg-gradient-to-br from-amber-400 to-orange-500 flex-shrink-0"></div>
                    )}
                    
                    <div className="p-2.5 flex flex-col flex-1 justify-between">
                      <div>
                        <h4 className="font-bold text-slate-800 text-[11px] mb-1.5 leading-tight line-clamp-1">
                          {event.title}
                        </h4>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                            <Calendar className="w-3 h-3 text-[#1e40af] shrink-0" />
                            <span className="truncate">{formattedDate}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                            <Clock className="w-3 h-3 text-[#1e40af] shrink-0" />
                            <span className="truncate">1:00 PM - 4:00 PM</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                            <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] font-medium text-slate-500">
                            <Users className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{event.current_participants || 0} participants</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* ✅ FIX: Added onClick execution mapping link */}
                      <button 
                        type="button" 
                        onClick={() => handleButtonClick(event.id, event.title)}
                        className={`w-full text-white py-1.5 px-3 rounded-lg text-[10px] font-bold transition-all shadow-sm active:scale-[0.97] mt-3 flex-shrink-0 cursor-pointer ${
                          index % 2 === 0 ? "bg-[#1e40af] hover:bg-[#1e3a8a]" : "bg-[#f59e0b] hover:bg-orange-600"
                        }`}
                      >
                        Register Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Navigation Bar Block */}
            <div className="bg-white border-t border-slate-100 px-1 py-1 flex justify-around items-center z-10 flex-shrink-0">
              <button type="button" className="flex flex-col items-center gap-0.5 py-1 px-1.5 cursor-pointer">
                <div className="w-5 h-5 bg-[#1e40af] rounded-full flex items-center justify-center shadow-sm">
                  <Calendar className="w-3 h-3 text-white" />
                </div>
                <span className="text-[8px] text-[#1e40af] font-bold">Events</span>
              </button>
              <button type="button" className="flex flex-col items-center gap-0.5 py-1 px-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                <Users className="w-3.5 h-3.5" />
                <span className="text-[8px] font-medium text-slate-500">Joined</span>
              </button>
              <button type="button" className="flex flex-col items-center gap-0.5 py-1 px-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                <Bell className="w-3.5 h-3.5" />
                <span className="text-[8px] font-medium text-slate-500">Alerts</span>
              </button>
              <button type="button" className="flex flex-col items-center gap-0.5 py-1 px-1.5 text-slate-400 hover:text-slate-600 cursor-pointer">
                <Menu className="w-3.5 h-3.5" />
                <span className="text-[8px] font-medium text-slate-500">More</span>
              </button>
            </div>

          </div>

          {/* Software iOS-Style Home Indicator Bar */}
          <div className="flex justify-center mt-2">
            <div className="w-20 h-1 bg-slate-700/80 rounded-full"></div>
          </div>
        </div>
      </div>

      <p className="text-center text-slate-400 text-[11px] font-medium mt-4">
        Live viewport emulation of the attendee registration stream
      </p>
    </div>
  );
}