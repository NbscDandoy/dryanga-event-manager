// src/app/pages/AllEvents.tsx
import { useState } from "react";
import { EventCard } from "../Components/EventCard";
import ManageEventModal from "../Components/ManageEventModal";
import PaymentSimulatorModal from "../Components/PaymentSimulatorModal"; // 💳 IMPORTED SIMULATOR MODAL
import { useEvents } from "../context/EventsContext";
import type { Event } from "../context/EventsContext";
import { CreditCard } from "lucide-react"; // Optional visual helper icon

// Safe top-level date formatting utility with missing-string safety fallbacks
const formatDate = (dateString: string) => {
  if (!dateString) return "No Date Provided";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

export function AllEvents() {
  // Call hooks unconditionally at the top level
  const context = useEvents();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [paymentEvent, setPaymentEvent] = useState<Event | null>(null); // 💳 STATE TRACKER FOR ONLINE PAYMENT OBJECTS

  // Fallback state if context isn't ready or returns null
  if (!context || !context.events) {
    return (
      <div className="flex items-center justify-center h-96 w-full">
        <p className="text-slate-400 font-medium animate-pulse">Loading events...</p>
      </div>
    );
  }

  const { events } = context;

  const handleManageEvent = (event: Event) => {
    if (!event) return;
    setSelectedEvent(event);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
  };

  return (
    <>
      {/* 1. MANAGE EVENT MODAL CONTROLLER MOUNTED STATE */}
      {selectedEvent && (
        <ManageEventModal
          event={selectedEvent}
          isOpen={!!selectedEvent}
          onClose={handleCloseModal}
        />
      )}

      {/* 2. ✅ NEW ONLINE PAYMENT CONTROLLER GATEWAY MODAL */}
      {paymentEvent && (
        <PaymentSimulatorModal
          eventTitle={paymentEvent.title}
          isOpen={!!paymentEvent}
          onClose={() => setPaymentEvent(null)}
        />
      )}

      <div className="w-full space-y-6 text-left select-none px-1 sm:px-0">
        {/* VIEW HEADER */}
        <div>
          <h2 className="text-gray-800 text-2xl font-bold tracking-tight">All Events</h2>
          <p className="text-xs text-slate-400 mt-1 font-medium">
            Browse through the total aggregate history of all published and upcoming records.
          </p>
        </div>

        {/* DYNAMIC RENDERING BLOCK WITH MAXIMUM ACCESSIBLE ROW CARDS */}
        {events.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-100 p-10 text-center shadow-sm max-w-2xl mx-auto">
            <p className="text-slate-400 text-sm font-semibold leading-relaxed">
              No events available at the moment. Create an event context entry to get started!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {events.map((event) => (
              <div key={event.id} className="w-full flex flex-col justify-between bg-white rounded-2xl border border-slate-100 p-1 shadow-2xs hover:shadow-xs transition-all">
                
                {/* Standard Card Interface Layout wrapper */}
                <EventCard
                  event={event}
                  formattedDate={formatDate(event.date)}
                  onManage={() => handleManageEvent(event)}
                />
                
                {/* ✅ CHECKOUT TRIGGER DECK BUTTON */}
                <div className="px-4 pb-4 pt-1">
                  <button
                    onClick={() => setPaymentEvent(event)}
                    className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-2xs active:scale-[0.98]"
                  >
                    <CreditCard size={13} />
                    <span>Buy Passes Online</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}