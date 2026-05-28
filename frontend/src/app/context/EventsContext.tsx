import React, { createContext, useContext, useState, ReactNode } from "react";

// 🌟 Explicitly exported named structural primitive interface
export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  maxParticipants: string;
  category: string;
  description: string;
  image: string;
  participants: number;
  isMyEvent: boolean;
}

// 🔔 Expanded structural block to hold the receipt details and QR payloads
export interface Notification {
  id: string;
  message: string;       // e.g., "Thank you for joining the event!"
  eventTitle: string;    // Captured event name
  time: string;
  unread: boolean;
  
  // 🎫 Transaction Details (Optional: Only populated for event registrations/payments)
  ticketType?: string;    // GENERAL or VIP
  quantity?: number;      // Number of seats reserved from the checkout form
  totalAmount?: number;   // Calculated transaction receipt total
  referenceNo?: string;   // Unique transactional scanning ID
}

interface EventsContextType {
  events: Event[];
  notifications: Notification[]; 
  addEvent: (event: Omit<Event, "id" | "participants" | "isMyEvent">) => void;
  updateEvent: (eventId: string, updates: Partial<Event>) => void;
  deleteEvent: (eventId: string) => void;
  // 🚀 Accepts a structural object layout from either announcements or your checkout components
  addNotification: (details: Omit<Notification, "id" | "time" | "unread">) => void; 
  clearNotifications: () => void; 
}

const EventsContext = createContext<EventsContextType | undefined>(undefined);

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Mr. and Ms. DYCI pageant",
    date: "2026-04-26",
    time: "1:00 PM - 4:00 PM",
    venue: "Dr. Marciano D. Yanga Complex",
    maxParticipants: "100",
    category: "Social",
    description: "Annual event to showcase student organizations",
    image: "https://images.unsplash.com/photo-1701709304274-bd9e5402d979?w=400&h=200&fit=crop",
    participants: 42,
    isMyEvent: true,
  },
  {
    id: "2",
    title: "Festival Showdown and Streetdance Competition",
    date: "2026-04-29",
    time: "6:00 PM - 9:00 PM",
    venue: "Sapientia Hall",
    maxParticipants: "300",
    category: "Cultural",
    description: "Celebrate spring with live music performances",
    image: "https://images.unsplash.com/photo-1559582759-e86a26070265?w=400&h=200&fit=crop",
    participants: 230,
    isMyEvent: true,
  },
  {
    id: "3",
    title: "Bloodletting Activity",
    date: "2026-05-05",
    time: "10:00 AM - 3:00 PM",
    venue: "Elida Hotel Auditorium",
    maxParticipants: "200",
    category: "Academic",
    description: "Annual leadership and development conference",
    image: "https://images.unsplash.com/photo-1769284021492-064a397420dc?w=400&h=200&fit=crop",
    participants: 145,
    isMyEvent: false,
  },
  {
    id: "4",
    title: "Research Exhibit and Workshop",
    date: "2026-05-10",
    time: "9:00 AM - 5:00 PM",
    venue: "STC Performing Arts Center",
    maxParticipants: "150",
    category: "Workshop",
    description: "Explore latest innovations in technology",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
    participants: 95,
    isMyEvent: false,
  },
  {
    id: "5",
    title: "Tree Planting Activity",
    date: "2026-05-15",
    time: "8:00 AM - 12:00 PM",
    venue: "Maria Yanga Bautista Quadrangle",
    maxParticipants: "80",
    category: "Environmental",
    description: "Environmental awareness and tree planting activity",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400&h=200&fit=crop",
    participants: 60,
    isMyEvent: false,
  },
  {
    id: "6",
    title: "DYCI SportsFest",
    date: "2026-05-20",
    time: "7:00 AM - 6:00 PM",
    venue: "Elida Campus Covered Court",
    maxParticipants: "500",
    category: "Sports",
    description: "Annual inter-department sports festival",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=200&fit=crop",
    participants: 380,
    isMyEvent: true,
  },
  {
    id: "7",
    title: "DYCI Esports Tournament",
    date: "2026-05-25",
    time: "2:00 PM - 8:00 PM",
    venue: "Computer Lab (FOR PC APPS)",
    maxParticipants: "64",
    category: "Gaming",
    description: "Competitive esports tournament for students",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=200&fit=crop",
    participants: 58,
    isMyEvent: false,
  },
  {
    id: "8",
    title: "Film Showing and music performances",
    date: "2026-06-01",
    time: "5:00 PM - 9:00 PM",
    venue: "STC Performing Arts Center",
    maxParticipants: "250",
    category: "Cultural",
    description: "Evening of film screenings and live music",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400&h=200&fit=crop",
    participants: 195,
    isMyEvent: true,
  },
];

export function EventsProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  
  // Set default fallback notifications cleanly
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "welcome-alert",
      message: "Enjoy managing and checking into your campus events!",
      eventTitle: "Welcome to Dr. Yanga's Events Manager Portal!",
      time: "Just now",
      unread: true
    }
  ]);

  const addEvent = (eventData: Omit<Event, "id" | "participants" | "isMyEvent">) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      participants: 0,
      isMyEvent: true,
    };
    setEvents((prevEvents) => [newEvent, ...prevEvents]);
  };

  const updateEvent = (eventId: string, updates: Partial<Event>) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
  };

  const deleteEvent = (eventId: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
  };

  // 🚀 Builds structural notifications array containing dynamic fields if provided
  const addNotification = (details: Omit<Notification, "id" | "time" | "unread">) => {
    const newAlert: Notification = {
      ...details,
      id: Date.now().toString(),
      time: "Just now",
      unread: true,
    };
    setNotifications((prev) => [newAlert, ...prev]);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <EventsContext.Provider 
      value={{ 
        events, 
        notifications, 
        addEvent, 
        updateEvent, 
        deleteEvent, 
        addNotification, 
        clearNotifications 
      }}
    >
      {children}
    </EventsContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventsContext);
  if (context === undefined) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
}