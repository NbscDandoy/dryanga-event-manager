// src/app/Components/EventOverview.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Calendar, 
  MapPin, 
  Edit, 
  Eye, 
  MoreHorizontal, 
  Copy, 
  Share2, 
  XCircle, 
  FileText,
  Building, 
  Megaphone, 
  Plus,
  Download // 👈 Clean layout download icon
} from "lucide-react";

import { useEvents } from "../context/EventsContext";
import ManageEventModal from "./ManageEventModal";
import type { Event } from "../context/EventsContext";

// UI Primitives 
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"; 

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog"; 

export function EventOverview() {
  const navigate = useNavigate();
  
  // Safely grab context metrics with standard explicit fallback definitions
  let events: Event[] = [];
  let updateEvent: (id: string, data: Partial<Event>) => void = () => {};
  let addEvent: (data: Omit<Event, "id">) => void = () => {};
  let deleteEvent: (id: string) => void = () => {};
  
  try {
    const context = useEvents();
    events = context?.events || [];
    updateEvent = context?.updateEvent;
    addEvent = context?.addEvent;
    deleteEvent = context?.deleteEvent;
  } catch (error) {
    console.error("Context map error:", error);
  }
  
  const [showManageModal, setShowManageModal] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [manageModalTab, setManageModalTab] = useState<"attendees" | "edit" | "notifications" | "reports">("attendees");
  
  // Isolate current campus target event row
  const featuredEvent = events.find(e => e.isMyEvent) || events[0];

  const handleEditEvent = () => {
    setManageModalTab("edit");
    setShowManageModal(true);
  };

  const handleViewRegistrations = () => {
    setManageModalTab("attendees");
    setShowManageModal(true);
  };

  const handleCreateEvent = () => {
    navigate("/dashboard/create-event");
  };

  const handleManageVenues = () => {
    navigate("/dashboard/venues");
  };

  const handleSendNotifications = () => {
    setManageModalTab("notifications");
    setShowManageModal(true);
  };

  // ✅ FIXED: Self-contained spreadsheet file engine downloading ALL system events
  const handleDownloadAllEventsList = () => {
    if (!events || events.length === 0) {
      alert("No campus events found in the database to download.");
      return;
    }

    try {
      // 1. Set headers for spreadsheet
      const headers = ["Event ID", "Title", "Scheduled Date", "Venue Location", "Participants Registered"];
      
      // 2. Map all events to clean table records
      const rows = events.map(event => [
        `"${event.id || "N/A"}"`,
        `"${(event.title || "").replace(/"/g, '""')}"`,
        `"${event.date ? new Date(event.date).toLocaleDateString('en-US') : "No Date"}"`,
        `"${(event.venue || event.location || "Main Campus Hall").replace(/"/g, '""')}"`,
        event.current_participants || 0
      ]);

      // 3. Assemble full system string content array
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      // 4. Create local download instance streams 
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const tempLink = document.createElement("a");
      
      tempLink.setAttribute("href", url);
      tempLink.setAttribute("download", `DYCI_All_Events_Masterlist_${new Date().toISOString().split('T')[0]}.csv`);
      tempLink.style.visibility = "hidden";
      
      document.body.appendChild(tempLink);
      tempLink.click(); // 🚀 Force browser download pipeline action
      document.body.removeChild(tempLink);
      
      // Clean up memory cache instance reference
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export script error:", err);
      alert("An unexpected error occurred while downloading the masterlist.");
    }
  };

  const handleDuplicateEvent = () => {
    if (featuredEvent) {
      const duplicatedEvent = {
        title: `${featuredEvent.title} (Copy)`,
        date: featuredEvent.date,
        time: featuredEvent.time,
        venue: featuredEvent.venue || featuredEvent.location || "",
        maxParticipants: featuredEvent.maxParticipants || 100,
        category: featuredEvent.category || "General",
        description: featuredEvent.description || "",
        image: featuredEvent.image || "",
        current_participants: 0
      };
      addEvent(duplicatedEvent);
      alert(`Event "${featuredEvent.title}" has been duplicated successfully!`);
    }
  };

  const handleShareEvent = () => {
    setShowShareDialog(true);
  };

  const handleCopyLink = () => {
    if (featuredEvent) {
      const eventLink = `${window.location.origin}/events/${featuredEvent.id}`;
      navigator.clipboard.writeText(eventLink);
      setShowShareDialog(false);
      alert("Event link copied to clipboard!");
    }
  };

  const handleCancelEvent = () => {
    setShowCancelDialog(true);
  };

  const confirmCancelEvent = () => {
    if (featuredEvent) {
      const eventTitle = featuredEvent.title;
      deleteEvent(featuredEvent.id);
      setShowCancelDialog(false);
      alert(`Event "${eventTitle}" has been cancelled and removed.`);
    }
  };

  const handleViewReports = () => {
    setManageModalTab("reports");
    setShowManageModal(true);
  };

  // If there are zero events at all, still show the box structure, but let them download or create!
  return (
    <>
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 select-none text-left">
        <h3 className="font-bold text-gray-800 text-sm tracking-tight mb-4">Event Overview</h3>
        
        {/* Featured Card Blueprint Container */}
        {featuredEvent ? (
          <div className="bg-gradient-to-br from-blue-50/60 to-white rounded-xl p-4 mb-4 border border-blue-100/50 shadow-xs">
            <h4 className="font-extrabold text-gray-800 text-sm tracking-tight mb-2 leading-snug line-clamp-2">
              {featuredEvent.title}
            </h4>
            <div className="space-y-1.5 mb-4">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-[#1e40af] shrink-0" />
                <span className="truncate">
                  {new Date(featuredEvent.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} 
                  {featuredEvent.time && ` • ${featuredEvent.time}`}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                <span className="truncate">{featuredEvent.venue || featuredEvent.location || "Main Campus Hall"}</span>
              </div>
            </div>

            <img 
              src={featuredEvent.image || "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=400&q=80"} 
              alt={featuredEvent.title} 
              className="w-full h-36 object-cover rounded-xl mb-4 shadow-xs border border-slate-100"
            />

            <div className="flex gap-2 mb-3">
              <button className="flex-1 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-[0.97] transition-all text-xs font-bold cursor-pointer shadow-xs" onClick={handleEditEvent}>
                <Edit className="w-3.5 h-3.5 text-[#1e40af]" />
                <span>Edit Event</span>
              </button>
              <button className="flex-1 border border-slate-200 text-slate-700 py-2 px-3 rounded-xl flex items-center justify-center gap-1.5 hover:bg-slate-50 active:scale-[0.97] transition-all text-xs font-bold cursor-pointer shadow-xs" onClick={handleViewRegistrations}>
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>Attendees</span>
              </button>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-full text-[#1e40af] py-1.5 px-4 rounded-lg flex items-center justify-center gap-1 hover:bg-blue-50/50 transition-colors text-xs font-bold cursor-pointer">
                  <span>More Actions</span>
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="w-52 rounded-xl shadow-md border border-slate-100 bg-white p-1">
                <DropdownMenuItem onClick={handleDuplicateEvent} className="cursor-pointer py-2 rounded-lg font-semibold text-xs text-slate-700 hover:bg-slate-50">
                  <Copy className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  Duplicate Event
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleShareEvent} className="cursor-pointer py-2 rounded-lg font-semibold text-xs text-slate-700 hover:bg-slate-50">
                  <Share2 className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  Share Event
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleViewReports} className="cursor-pointer py-2 rounded-lg font-semibold text-xs text-slate-700 hover:bg-slate-50">
                  <FileText className="w-3.5 h-3.5 mr-2 text-slate-400" />
                  View Reports
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-slate-100 my-1" />
                <DropdownMenuItem onClick={handleCancelEvent} className="cursor-pointer py-2 rounded-lg font-bold text-xs text-red-600 focus:text-red-600 focus:bg-red-50">
                  <XCircle className="w-3.5 h-3.5 mr-2" />
                  Cancel Event
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="bg-slate-50 text-slate-400 text-xs font-medium py-8 text-center rounded-xl border border-dashed border-slate-200 mb-4">
            No system records initialized.
          </div>
        )}

        {/* Quick Actions Grid layout */}
        <div className="border-t border-slate-100 pt-4">
          <h4 className="font-extrabold text-[10px] uppercase tracking-wider text-slate-400 mb-3">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2.5">
            <button className="border border-slate-200/80 rounded-xl p-2.5 hover:bg-blue-50/30 hover:border-[#1e40af]/40 transition-all group cursor-pointer text-center" onClick={handleCreateEvent}>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 bg-slate-50 group-hover:bg-[#1e40af] rounded-lg flex items-center justify-center transition-colors">
                  <Plus className="w-4 h-4 text-[#1e40af] group-hover:text-white transition-colors" />
                </div>
                <span className="text-[11px] font-bold text-slate-700">Create Event</span>
              </div>
            </button>
            <button className="border border-slate-200/80 rounded-xl p-2.5 hover:bg-blue-50/30 hover:border-[#1e40af]/40 transition-all group cursor-pointer text-center" onClick={handleManageVenues}>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 bg-slate-50 group-hover:bg-[#1e40af] rounded-lg flex items-center justify-center transition-colors">
                  <Building className="w-4 h-4 text-[#1e40af] group-hover:text-white transition-colors" />
                </div>
                <span className="text-[11px] font-bold text-slate-700">Venues</span>
              </div>
            </button>
            <button className="border border-slate-200/80 rounded-xl p-2.5 hover:bg-blue-50/30 hover:border-[#1e40af]/40 transition-all group cursor-pointer text-center" onClick={handleSendNotifications}>
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 bg-slate-50 group-hover:bg-[#1e40af] rounded-lg flex items-center justify-center transition-colors">
                  <Megaphone className="w-4 h-4 text-[#1e40af] group-hover:text-white transition-colors" />
                </div>
                <span className="text-[11px] font-bold text-slate-700">Broadcast</span>
              </div>
            </button>

            {/* ✅ FIXED: High-priority full context download execution mapping link */}
            <button 
              className="border border-slate-200/80 rounded-xl p-2.5 bg-emerald-50/30 hover:bg-emerald-50 hover:border-emerald-600 transition-all group cursor-pointer text-center" 
              onClick={handleDownloadAllEventsList}
            >
              <div className="flex flex-col items-center gap-1.5">
                <div className="w-9 h-9 bg-emerald-50 group-hover:bg-emerald-600 rounded-lg flex items-center justify-center transition-colors">
                  <Download className="w-4 h-4 text-emerald-600 group-hover:text-white transition-colors" />
                </div>
                <span className="text-[11px] font-bold text-emerald-700">Export System</span>
              </div>
            </button>
          </div>
        </div>

        <button className="w-full bg-[#fbbf24] text-[#1e293b] py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 hover:bg-[#f59e0b] active:scale-[0.97] transition-all font-bold text-xs mt-4 shadow-xs cursor-pointer" onClick={handleCreateEvent}>
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create New Event</span>
        </button>
      </div>

      {showManageModal && featuredEvent && (
        <ManageEventModal
          event={featuredEvent}
          isOpen={showManageModal}
          initialTab={manageModalTab}
          onClose={() => setShowManageModal(false)}
        />
      )}

      {/* Cancel Event Confirmation Dialog */}
      {featuredEvent && (
        <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
          <AlertDialogContent className="rounded-xl bg-white max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-sm font-bold text-slate-900">Cancel Event</AlertDialogTitle>
              <AlertDialogDescription className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to cancel "{featuredEvent.title}"? This action will mark the event as cancelled and notify all registered attendees.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="rounded-xl text-xs font-semibold px-4 py-2">No, Keep Event</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmCancelEvent}
                className="bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold px-4 py-2"
              >
                Yes, Cancel Event
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}

      {/* Share Event Dialog */}
      {featuredEvent && (
        <AlertDialog open={showShareDialog} onOpenChange={setShowShareDialog}>
          <AlertDialogContent className="rounded-xl bg-white max-w-sm">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-sm font-bold text-slate-900">Share Event</AlertDialogTitle>
              <AlertDialogDescription className="space-y-3" asChild>
                <div>
                  <p className="text-xs text-slate-500">Share "{featuredEvent.title}" with your campus community</p>
                  <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide mb-1">Url Link Location:</p>
                    <p className="text-xs text-slate-700 break-all font-mono select-all bg-white p-2 rounded-lg border border-slate-200/60">
                      {window.location.origin}/events/{featuredEvent.id}
                    </p>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="rounded-xl text-xs font-semibold px-4 py-2">Close</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleCopyLink}
                className="bg-[#1e40af] hover:bg-[#1e3a8a] text-white rounded-xl text-xs font-bold px-4 py-2 flex items-center gap-1"
              >
                <Copy className="w-3.5 h-3.5 mr-0.5" />
                Copy Link
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}