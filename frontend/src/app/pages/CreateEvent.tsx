import { Calendar, Clock, MapPin, Users, Tag, FileText } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { useEvents } from "../context/EventsContext";

export function CreateEvent() {
  const navigate = useNavigate();
  
  // Call hooks unconditionally at the absolute top level
  const context = useEvents();
  
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    time: "",
    venue: "",
    maxParticipants: "",
    category: "",
    description: "",
  });

  // If the context is missing, return fallback loading view cleanly
  if (!context || !context.addEvent) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const { addEvent } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.venue || formData.venue === "Select venue") {
      alert("Please fill in all required fields (Title, Date, Venue)");
      return;
    }

    // Add the event to global state
    addEvent({
      ...formData,
      image: "https://images.unsplash.com/photo-1613687969216-40c7b718c025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZXZlbnQlMjBjYW1wdXN8ZW58MXx8fHwxNzcyNjcxMDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    });

    alert(`Event Created Successfully! 🎉\n\nTitle: ${formData.title}\nDate: ${formData.date}\nVenue: ${formData.venue}\n\nRedirecting to My Events...`);
    
    // Reset form
    setFormData({
      title: "",
      date: "",
      time: "",
      venue: "",
      maxParticipants: "",
      category: "",
      description: "",
    });
    
    navigate("/dashboard/my-events");
  };

  const handleCancel = () => {
    if (formData.title || formData.date || (formData.venue && formData.venue !== "Select venue")) {
      if (confirm("Are you sure you want to cancel? All unsaved changes will be lost.")) {
        navigate("/dashboard");
      }
    } else {
      navigate("/dashboard");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="max-w-4xl space-y-6">
      <h2 className="text-gray-800 text-2xl font-bold">Create New Event</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Switched execution to the proper onSubmit container wrapper */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter event title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1 text-[#1e40af]" />
                Event Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1 text-[#1e40af]" />
                Event Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1 text-rose-500" />
              Venue <span className="text-rose-500">*</span>
            </label>
            <select
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              required
            >
              <option>Select venue</option>
              <option>Elida Hotel Auditorium</option>
              <option>Dr. Marciano D. Yanga Complex</option>
              <option>Sapientia Hall</option>
              <option>Elida Campus Covered Court</option>
              <option>STC Performing Arts Center</option>
              <option>Computer Lab (FOR PC APPS)</option>
              <option>RM 101 (FOR MOBILE APPS)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Users className="w-4 h-4 inline mr-1 text-slate-500" />
              Maximum Participants
            </label>
            <input
              type="number"
              placeholder="Enter maximum number of participants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1 text-slate-500" />
              Event Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            >
              <option>Select category</option>
              <option>Social</option>
              <option>Cultural</option>
              <option>Academic</option>
              <option>Workshop</option>
              <option>Environmental</option>
              <option>Sports</option>
              <option>Gaming</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1 text-slate-500" />
              Event Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe your event"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#1e40af] text-white py-3 px-6 rounded-lg hover:bg-[#1e3a8a] transition-colors font-semibold shadow-xs cursor-pointer"
            >
              Create Event
            </button>
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium cursor-pointer"
              onClick={handleCancel}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}