import { useState } from "react";
import { Building, MapPin, Users, Calendar, Clock, X } from "lucide-react";

interface Venue {
  name: string;
  capacity: number;
  location: string;
  available: boolean;
}


export function Venues() {
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [duration, setDuration] = useState("2");
  const [eventType, setEventType] = useState("");

  const venues: Venue[] = [
    { name: "Elida Hotel Auditorium", capacity: 300, location: "Elida Hotel, Main Building", available: true },
    { name: "Dr. Marciano D. Yanga Complex", capacity: 500, location: "Main Campus", available: true },
    { name: "Sapientia Hall", capacity: 1000, location: "Main Building", available: false },
    { name: "Elida Campus Covered Court", capacity: 800, location: "Sports Complex", available: true },
    { name: "STC Performing Arts Center", capacity: 400, location: "STC Building", available: true },
    { name: "Computer Lab (FOR PC APPS)", capacity: 40, location: "IT Building, 2nd Floor", available: true },
    { name: "RM 101 (FOR MOBILE APPS)", capacity: 35, location: "IT Building, 1st Floor", available: true },
  ];

  const eventTypes = [
    "Academic Conference",
    "Workshop",
    "Cultural Event",
    "Sports Event",
    "Social Gathering",
    "Student Organization Meeting",
    "Seminar",
    "Concert/Performance",
    "Exhibition",
    "Other"
  ];

  const durationOptions = [
    { value: "1", label: "1 hour" },
    { value: "2", label: "2 hours" },
    { value: "3", label: "3 hours" },
    { value: "4", label: "4 hours" },
    { value: "6", label: "6 hours" },
    { value: "8", label: "8 hours" },
    { value: "full-day", label: "Full Day" },
    { value: "multiple", label: "Multiple Days" }
  ];

  const handleBookVenue = (venue: Venue) => {
    if (!venue.available) {
      alert(`${venue.name} is currently booked.\n\nNext available date: May 15, 2024\n\nWould you like to check availability?`);
      return;
    }
    
    setSelectedVenue(venue);
    setShowBookingModal(true);
    // Reset form
    setBookingDate("");
    setBookingTime("");
    setDuration("2");
    setEventType("");
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedVenue(null);
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingDate || !bookingTime || !eventType) {
      alert("Please fill in all required fields.");
      return;
    }

    // Format the booking details
    const durationLabel = durationOptions.find(d => d.value === duration)?.label || duration;
    const bookingDetails = `
Venue Booking Confirmed!

Venue: ${selectedVenue?.name}
Location: ${selectedVenue?.location}
Capacity: ${selectedVenue?.capacity} people

Date: ${new Date(bookingDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
Time: ${bookingTime}
Duration: ${durationLabel}
Event Type: ${eventType}

A confirmation email has been sent to your registered email address.
    `;

    alert(bookingDetails);
    handleCloseModal();
  };

  // Get minimum date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">
      <h2 className="text-gray-800">Venue Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {venues.map((venue) => (
          <div key={venue.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Building className="w-6 h-6 text-[#1e40af]" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs ${
                venue.available 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {venue.available ? 'Available' : 'Booked'}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-800 mb-3">{venue.name}</h3>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4 text-[#1e40af]" />
                <span>{venue.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Users className="w-4 h-4 text-[#1e40af]" />
                <span>Capacity: {venue.capacity}</span>
              </div>
            </div>

            <button 
              className="w-full bg-[#1e40af] text-white py-2 px-4 rounded-lg hover:bg-[#1e3a8a] transition-colors flex items-center justify-center gap-2"
              onClick={() => handleBookVenue(venue)}
            >
              <Calendar className="w-4 h-4" />
              <span>Book Venue</span>
            </button>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedVenue && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#1e40af] text-white p-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">Book Venue</h3>
                <p className="text-sm opacity-90">{selectedVenue.name}</p>
              </div>
              <button
                onClick={handleCloseModal}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Venue Info */}
            <div className="p-6 bg-blue-50 border-b border-blue-100">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-[#1e40af]" />
                  <span className="text-gray-700">
                    <span className="font-medium">Location:</span> {selectedVenue.location}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-[#1e40af]" />
                  <span className="text-gray-700">
                    <span className="font-medium">Capacity:</span> {selectedVenue.capacity} people
                  </span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <form onSubmit={handleSubmitBooking} className="flex-1 overflow-y-auto p-6">
              <div className="space-y-5">
                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="date"
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={today}
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="time"
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      required
                      className="w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Duration Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                  >
                    {durationOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Event Type Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent"
                  >
                    <option value="">Select event type...</option>
                    {eventTypes.map(type => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Any special requirements or notes..."
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent resize-none"
                  />
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitBooking}
                className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] text-sm font-medium"
              >
                Confirm Booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}