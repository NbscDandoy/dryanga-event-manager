// src/app/pages/MyEvents.tsx
import { useState } from "react";
import { EventCard } from "../Components/EventCard";
import { ManageEventModal } from "../Components/ManageEventModal"; // ✅ FIXED: Changed to named import syntax
import { useEvents } from "../context/EventsContext";
import type { Event } from "../context/EventsContext";

// Safe top-level date formatting utility with empty-string edge case defense
const formatDate = (dateString: string) => {
  if (!dateString) return "No Date Provided";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export function MyEvents() {
  const context = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Unconditional context validation split securely past state declarations
  if (!context || !context.events) {
    return (
      <div className="flex items-center justify-center h-96 w-full">
        <p className="text-slate-400 font-medium animate-pulse">Loading events...</p>
      </div>
    );
  }

  const { events } = context;
  
  // Filtering user-managed events cleanly
  const myEvents = events.filter((event) => event.isMyEvent);

  const handleManageEvent = (event: Event) => {
    if (!event) return;
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      {/* MODAL MOUNT CONTROLLER */}
      {selectedEvent && (
        <ManageEventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={handleCloseModal}
        />
      )}
      
      <div className="w-full space-y-6 text-left select-none px-1 sm:px-0">
        {/* VIEW HEADER */}
        <div>
          <h2 className="text-gray-800 text-2xl font-bold tracking-tight">My Events</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Review and adjust operational variables for events managed by your account.
          </p>
        </div>
        
        {/* DYNAMIC CONTENT CONTAINER */}
        {myEvents.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-10 text-center shadow-sm max-w-2xl mx-auto">
            <p className="text-slate-400 text-sm font-semibold leading-relaxed">
              You haven't created any events yet. Create your first dashboard entry to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            {myEvents.map((event) => (
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
      </div>
    </>
  );
}