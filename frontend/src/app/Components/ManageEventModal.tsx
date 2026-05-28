import React, { useState, useEffect } from 'react';
import { X, Users, Edit, Bell, ClipboardList, Download, Send } from 'lucide-react';
import type { ActiveView, Event as CustomEvent } from '../../types'; 

interface ModalProps {
  event: CustomEvent | null;
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'attendees' | 'edit' | 'notifications' | 'reports';
}

export default function ManageEventModal({ event, isOpen, onClose, initialTab = 'attendees' }: ModalProps) {
  const [modalTab, setModalTab] = useState(initialTab);

  // Sync internal state when initialTab prop updates externally
  useEffect(() => {
    if (isOpen) {
      setModalTab(initialTab);
    }
  }, [initialTab, isOpen]);

  if (!isOpen) return null;

  const mockAttendees = [
    { name: 'Maria Santos', email: 'maria.santos@student.edu', date: 'Apr 1, 2024', type: 'General Admission', status: 'Checked In' },
    { name: 'John Reyes', email: 'john.reyes@student.edu', date: 'Apr 2, 2024', type: 'VIP', status: 'Checked In' },
    { name: 'Anna Cruz', email: 'anna.cruz@student.edu', date: 'Apr 3, 2024', type: 'General Admission', status: 'Registered' },
    { name: 'Carlos Dela Cruz', email: 'carlos.dela@student.edu', date: 'Apr 4, 2024', type: 'Student', status: 'Checked In' },
    { name: 'Sofia Rodriguez', email: 'sofia.rod@student.edu', date: 'Apr 5, 2024', type: 'General Admission', status: 'Registered' },
  ];

  // ✅ FIXED: Download pipeline engine for managing this active event's attendees
  const handleExportAttendeesCSV = () => {
    try {
      const targetTitle = event?.title || 'Event';
      
      // 1. Setup row headers
      const headers = ["Attendee Name", "Email Address", "Registration Date", "Ticket Type", "Attendance Status"];
      
      // 2. Generate matrix records array
      const rows = mockAttendees.map(att => [
        `"${att.name.replace(/"/g, '""')}"`,
        `"${att.email.replace(/"/g, '""')}"`,
        `"${att.date}"`,
        `"${att.type}"`,
        `"${att.status}"`
      ]);

      // 3. Join together CSV data stream contents
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");

      // 4. Dispatch simulated streaming download node instance
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      
      const safeFilename = targetTitle.toLowerCase().replace(/[^a-z0-9]/g, '_');
      link.setAttribute("href", url);
      link.setAttribute("download", `${safeFilename}_attendee_masterlist.csv`);
      link.style.visibility = "hidden";
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failure:", error);
      alert("An issue occurred generating the report list download spreadsheet.");
    }
  };

  const handleSendNotificationAlert = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Broadcast notification successfully transmitted to all registered event attendees!");
  };

  const handleSaveChangesMock = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Changes saved successfully!");
    onClose();
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-200">
      
      {/* Clickable Backdrop Shield */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      {/* Modal Main Box */}
      <div className="bg-white rounded-xl w-full max-w-[850px] shadow-xl overflow-hidden flex flex-col max-h-[90vh] transform transition-all">
        
        {/* Modal Header */}
        <div className="bg-[#1e40af] px-6 py-4 text-white flex justify-between items-center shrink-0">
          <div>
            <h3 className="text-lg font-bold tracking-tight">Manage Event</h3>
            <p className="text-xs text-blue-200 mt-0.5 font-medium">{event?.title || 'Mr. and Ms. DYCI pageant'}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-white/80 hover:text-white hover:bg-white/10 p-1.5 rounded-lg transition cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Tabs Row */}
        <div className="flex border-b border-slate-100 px-4 bg-white overflow-x-auto scrollbar-none shrink-0">
          {([
            { id: 'attendees', label: 'Attendees', icon: <Users size={15} /> },
            { id: 'edit', label: 'Edit Event', icon: <Edit size={15} /> },
            { id: 'notifications', label: 'Notifications', icon: <Bell size={15} /> },
            { id: 'reports', label: 'Reports', icon: <ClipboardList size={15} /> }
          ] as const).map((tab) => {
            const isActive = modalTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setModalTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs sm:text-sm font-semibold transition-colors cursor-pointer shrink-0 ${
                  isActive 
                    ? 'border-[#1e40af] text-[#1e40af]' 
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Wrapper */}
        <div className="p-6 bg-white overflow-y-auto flex-1 text-left">
          
          {/* TAB: ATTENDEES */}
          {modalTab === 'attendees' && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div>
                  <h4 className="text-base font-bold text-slate-800">Attendee List</h4>
                  <p className="text-xs text-slate-400 mt-0.5">5 registered &bull; 3 checked in</p>
                </div>
                {/* ✅ FIXED: Bound download callback routine directly here */}
                <button 
                  onClick={handleExportAttendeesCSV}
                  className="bg-[#1e40af] hover:bg-blue-800 text-white border-none rounded-lg px-4 py-2 text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 self-start sm:self-auto transition-colors shadow-sm"
                >
                  <Download size={14} /> Export List
                </button>
              </div>

              <div className="border border-slate-100 rounded-xl overflow-x-auto shadow-sm">
                <table className="w-full border-collapse text-left text-xs sm:text-sm min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-50/70 border-b border-slate-100 text-slate-500 font-bold">
                      <th className="p-3.5 pl-5">Name</th>
                      <th className="p-3.5">Email</th>
                      <th className="p-3.5">Registered</th>
                      <th className="p-3.5">Ticket Type</th>
                      <th className="p-3.5 pr-5">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {mockAttendees.map((att, i) => (
                      <tr key={i} className="text-slate-600 hover:bg-slate-50/40 transition-colors">
                        <td className="p-3.5 pl-5 font-semibold text-slate-700">{att.name}</td>
                        <td className="p-3.5">{att.email}</td>
                        <td className="p-3.5 text-slate-400">{att.date}</td>
                        <td className="p-3.5 font-medium">{att.type}</td>
                        <td className="p-3.5 pr-5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold ${
                            att.status === 'Checked In' 
                              ? 'bg-green-50 text-green-700 border border-green-200/40' 
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {att.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: EDIT */}
          {modalTab === 'edit' && (
            <form onSubmit={handleSaveChangesMock} className="flex flex-col gap-5">
              <h4 className="text-base font-bold text-slate-800">Edit Event Details</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Event Title</label>
                  <input type="text" defaultValue={event?.title || ''} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#1e40af] outline-none transition-all" required />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700">Category</label>
                  <select defaultValue={event?.category || 'Social'} className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#1e40af] outline-none transition-all cursor-pointer">
                    <option value="Social">Social</option>
                    <option value="Academic">Academic</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-100 pt-4 mt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 border-none bg-[#1e40af] hover:bg-blue-800 text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors shadow-sm">Save Changes</button>
              </div>
            </form>
          )}

          {/* TAB: NOTIFICATIONS */}
          {modalTab === 'notifications' && (
            <form onSubmit={handleSendNotificationAlert} className="flex flex-col gap-4">
              <h4 className="text-base font-bold text-slate-800">Send Notification</h4>
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-700">Message</label>
                <textarea rows={5} placeholder="Type your message here..." className="w-full p-2.5 border border-slate-200 rounded-lg text-sm bg-slate-50/50 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-[#1e40af] outline-none transition-all resize-none" required></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={onClose} className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#1e40af] hover:bg-blue-800 text-white border-none rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer transition-colors shadow-sm">
                  <Send size={14} /> Send Notification
                </button>
              </div>
            </form>
          )}

          {/* TAB: REPORTS */}
          {modalTab === 'reports' && (
            <div className="flex flex-col gap-4">
              <h4 className="text-base font-bold text-slate-800">Available Reports</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="border border-slate-100 rounded-xl p-4 flex gap-4 items-start bg-slate-50/30">
                  <div className="bg-blue-50 text-[#1e40af] p-2.5 rounded-lg shrink-0"><Users size={18} /></div>
                  <div>
                    <h5 className="text-sm font-bold text-slate-800">Attendee Report</h5>
                    {/* ✅ FIXED: Bound the download pipeline to this button link too */}
                    <button 
                      onClick={handleExportAttendeesCSV}
                      className="bg-none border-none p-0 mt-1 text-xs text-[#1e40af] hover:text-blue-800 font-bold cursor-pointer transition-colors inline-flex items-center gap-1"
                    >
                      Download CSV File
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}