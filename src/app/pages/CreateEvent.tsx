import { Calendar, Clock, MapPin, Users, Tag, FileText, X, CheckCircle2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventsContext";

export function CreateEvent() {
  const navigate = useNavigate();
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

  // Native custom modal visibility and UI control states
  const [modalType, setModalType] = useState<"none" | "success" | "confirm-cancel" | "validation-error">("none");

  if (!context || !context.addEvent) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-500 font-medium">Loading workspace templates...</p>
      </div>
    );
  }

  const { addEvent } = context;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.date || !formData.venue || formData.venue === "Select venue") {
      setModalType("validation-error");
      return;
    }

    addEvent({
      ...formData,
      image: "https://images.unsplash.com/photo-1613687969216-40c7b718c025?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx1bml2ZXJzaXR5JTIwZXZlbnQlMjBjYW1wdXN8ZW58MXx8fHwxNzcyNjcxMDQ3fDA&ixlib=rb-4.1.0&q=80&w=1080",
    });

    setModalType("success");
  };

  const finalizeSuccessRedirect = () => {
    setModalType("none");
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

  const handleCancelClick = () => {
    if (formData.title || formData.date || (formData.venue && formData.venue !== "Select venue")) {
      setModalType("confirm-cancel");
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
    <div className="max-w-4xl space-y-6 select-none text-left">
      <h2 className="text-slate-800 text-2xl font-extrabold tracking-tight">Create New Event</h2>
      
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Event Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter event title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] text-sm text-slate-800"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Calendar className="w-4 h-4 inline mr-1.5 text-[#1e40af]" />
                Event Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] text-sm text-slate-800"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1.5 text-[#1e40af]" />
                Event Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] text-sm text-slate-800"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1.5 text-rose-500" />
              Venue <span className="text-rose-500">*</span>
            </label>
            <select
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] text-sm text-slate-800 bg-white"
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Users className="w-4 h-4 inline mr-1.5 text-slate-500" />
              Maximum Participants
            </label>
            <input
              type="number"
              placeholder="Enter maximum number of participants"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] text-sm text-slate-800"
              min="1"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <Tag className="w-4 h-4 inline mr-1.5 text-slate-500" />
              Event Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] text-sm text-slate-800 bg-white"
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
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <FileText className="w-4 h-4 inline mr-1.5 text-slate-500" />
              Event Description
            </label>
            <textarea
              rows={4}
              placeholder="Describe your event"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1e40af] text-sm text-slate-800"
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="submit"
              className="flex-1 bg-[#1e40af] text-white py-3 px-6 rounded-xl hover:bg-[#1e3a8a] transition-all font-semibold shadow-xs cursor-pointer text-sm"
            >
              Create Event
            </button>
            <button
              type="button"
              className="px-6 py-3 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-all font-semibold cursor-pointer text-sm"
              onClick={handleCancelClick}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* ========================================================================= */}
      {/* PREMIUM INTERACTIVE MODAL ROUTINES                 */}
      {/* ========================================================================= */}
      {modalType !== "none" && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all animate-in zoom-in-95 duration-150">
            
            {/* 1. SUCCESS CREATION WORKFLOW */}
            {modalType === "success" && (
              <>
                <div className="p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Event Created Successfully</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Your campus registration event <strong className="text-slate-600">"{formData.title}"</strong> is now live on the student network grid.
                    </p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-left space-y-1 text-xs border border-slate-100 font-medium text-slate-600">
                    <p className="truncate"><span className="text-slate-400 font-bold">Venue:</span> {formData.venue}</p>
                    <p><span className="text-slate-400 font-bold">Date:</span> {formData.date}</p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex">
                  <button
                    type="button"
                    onClick={finalizeSuccessRedirect}
                    className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Go to My Events
                  </button>
                </div>
              </>
            )}

            {/* 2. DESTRUCTIVE CANCEL ABORT CONTEXT */}
            {modalType === "confirm-cancel" && (
              <>
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Discard Event Changes?</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Are you sure you want to exit? All current inputs entered on this workspace form configuration will be permanently wiped out.
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="flex-1 bg-rose-600 hover:bg-rose-700 text-white py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Discard Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalType("none")}
                    className="flex-1 bg-white border border-slate-200 text-slate-600 py-2 px-4 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    Keep Editing
                  </button>
                </div>
              </>
            )}

            {/* 3. MISSING MANDATORY FORM REQUISITES WARNING */}
            {modalType === "validation-error" && (
              <>
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-800">Required Parameters Missing</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                      Please satisfy all fundamental event parameters before publication. Make sure Title, Date, and Venue are cleanly assigned.
                    </p>
                  </div>
                </div>
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex">
                  <button
                    type="button"
                    onClick={() => setModalType("none")}
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white py-2 px-4 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Review Fields
                  </button>
                </div>
              </>
            )}

          </div>
        </div>
      )}
    </div>
  );
}