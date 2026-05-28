// TypeScript Types Module 
// Define the allowed statuses for campus events
export type EventStatus = 'Upcoming' | 'Managed' | 'Past' | 'Cancelled';

// Define the allowed tracking statuses for attendees
export type RegistrationStatus = 'Registered' | 'Attended' | 'Waitlisted';

// Model matching your 'venues' database table layout
export interface Venue {
  id: number;
  name: string;
  location: string;
  capacity: number;
  isAvailable: boolean;
}

// Model matching your 'events' database table layout
export interface Event {
  id: number;
  title: string;
  description?: string; // Optional field
  eventDate: string;     // ISO Date format (YYYY-MM-DD)
  startTime: string;     // e.g., "14:00:00"
  endTime: string;       // e.g., "16:00:00"
  venueId: number;
  maxCapacity: number;
  filledSlots: number;
  status: EventStatus;
  createdAt: string;
}

// Model matching your 'registrations' database table layout
export interface Registration {
  id: number;
  userId: string;        // Student ID (e.g., STU086423)
  eventId: number;
  status: RegistrationStatus;
  qrCodeHash?: string;   // Optional unique hash used for QR scanning code 
  registeredAt: string;
}