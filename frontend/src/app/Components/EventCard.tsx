import { Calendar, Clock, MapPin, Users, ChevronDown } from "lucide-react";
import type { Event } from '../context/EventsContext';

interface EventCardProps {
  event: Event;
  formattedDate: string;
  onManage?: () => void;
}

export function EventCard({ event, formattedDate, onManage }: EventCardProps) {
  // Safe destructuring with fallback structural elements
  const { 
    image = "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80", 
    title = "Untitled Campus Event", 
    time = "TBD", 
    venue = "Main Campus Hall", 
    participants = 0 
  } = event || {};

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md border border-slate-100/80 transition-all duration-200 flex flex-col h-full select-none">
      {/* Event Header Banner Image */}
      <div className="relative h-36 bg-slate-100 shrink-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover"
          loading="lazy"
        />
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-1 rounded-md text-[10px] font-bold text-[#1e40af] shadow-2xs uppercase tracking-wide border border-white/20">
          Campus Life
        </div>
      </div>

      {/* Main Metadata Text Container */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="font-bold text-slate-800 text-sm mb-3 line-clamp-2 leading-snug tracking-tight min-h-[40px]">
            {title}
          </h3>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
              <Calendar className="w-4 h-4 text-[#1e40af] shrink-0 opacity-95" />
              <span className="truncate">{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
              <Clock className="w-4 h-4 text-[#1e40af] shrink-0 opacity-95" />
              <span className="truncate">{time}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="truncate">{venue}</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-slate-600 font-medium">
              <Users className="w-4 h-4 text-slate-400 shrink-0" />
              <span>{participants} registered</span>
            </div>
          </div>
        </div>

        {/* Form CTA Submission Trigger */}
        {onManage && (
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onManage();
            }}
            className="w-full bg-[#1e40af] text-white py-2 px-4 rounded-xl flex items-center justify-center gap-2 hover:bg-[#1e3a8a] active:scale-[0.98] transition-all text-xs font-bold shadow-2xs tracking-wide"
          >
            <span>Manage System</span>
            <ChevronDown className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </div>
  );
}