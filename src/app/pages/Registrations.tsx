import { useState } from "react";
import { X, Download, Mail, CheckCircle, Search, Filter } from "lucide-react";

interface Attendee {
  id: string;
  name: string;
  email: string;
  registrationDate: string;
  status: "confirmed" | "pending" | "checked-in";
  ticketType: string;
}

interface EventRegistration {
  eventName: string;
  date: string;
  registrations: number;
  capacity: number;
  status: string;
  attendees: Attendee[];
}

export function Registrations() {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventRegistration | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [selectedAttendees, setSelectedAttendees] = useState<Set<string>>(new Set());

  // Mock attendee data
  const mockAttendees: Attendee[] = [
    {
      id: "1",
      name: "Maria Santos",
      email: "maria.santos@email.com",
      registrationDate: "March 15, 2024",
      status: "confirmed",
      ticketType: "General Admission"
    },
    {
      id: "2",
      name: "Juan dela Cruz",
      email: "juan.delacruz@email.com",
      registrationDate: "March 16, 2024",
      status: "checked-in",
      ticketType: "VIP"
    },
    {
      id: "3",
      name: "Ana Reyes",
      email: "ana.reyes@email.com",
      registrationDate: "March 18, 2024",
      status: "confirmed",
      ticketType: "General Admission"
    },
    {
      id: "4",
      name: "Pedro Garcia",
      email: "pedro.garcia@email.com",
      registrationDate: "March 20, 2024",
      status: "pending",
      ticketType: "Student"
    },
    {
      id: "5",
      name: "Sofia Martinez",
      email: "sofia.martinez@email.com",
      registrationDate: "March 21, 2024",
      status: "confirmed",
      ticketType: "General Admission"
    },
    {
      id: "6",
      name: "Luis Fernandez",
      email: "luis.fernandez@email.com",
      registrationDate: "March 22, 2024",
      status: "checked-in",
      ticketType: "Student"
    }
  ];

  const handleViewDetails = (eventName: string, date: string, registrations: number, capacity: number, status: string) => {
    setSelectedEvent({
      eventName,
      date,
      registrations,
      capacity,
      status,
      attendees: mockAttendees
    });
    setShowDetailsModal(true);
    setSelectedAttendees(new Set());
  };

  const handleExportToCSV = () => {
    if (!selectedEvent) return;
    
    const headers = ["Name", "Email", "Registration Date", "Status", "Ticket Type"];
    const csvData = selectedEvent.attendees.map(attendee => [
      attendee.name,
      attendee.email,
      attendee.registrationDate,
      attendee.status,
      attendee.ticketType
    ]);
    
    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${selectedEvent.eventName.replace(/\s+/g, "_")}_attendees.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleSendConfirmationEmails = () => {
    const count = selectedAttendees.size > 0 ? selectedAttendees.size : selectedEvent?.attendees.length || 0;
    alert(`Confirmation emails sent to ${count} attendee(s).`);
  };

  const handleCheckInAttendees = () => {
    if (selectedAttendees.size === 0) {
      alert("Please select attendees to check in.");
      return;
    }
    alert(`${selectedAttendees.size} attendee(s) checked in successfully.`);
    setSelectedAttendees(new Set());
  };

  const toggleAttendeeSelection = (id: string) => {
    const newSelected = new Set(selectedAttendees);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedAttendees(newSelected);
  };

  const toggleSelectAll = () => {
    if (!selectedEvent) return;
    
    const filteredAttendees = getFilteredAttendees();
    if (selectedAttendees.size === filteredAttendees.length) {
      setSelectedAttendees(new Set());
    } else {
      setSelectedAttendees(new Set(filteredAttendees.map(a => a.id)));
    }
  };

  const getFilteredAttendees = () => {
    if (!selectedEvent) return [];
    
    return selectedEvent.attendees.filter(attendee => {
      const matchesSearch = attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           attendee.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterStatus === "all" || attendee.status === filterStatus;
      return matchesSearch && matchesFilter;
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      confirmed: "bg-blue-100 text-blue-800",
      pending: "bg-yellow-100 text-yellow-800",
      "checked-in": "bg-green-100 text-green-800"
    };
    return styles[status as keyof typeof styles] || "bg-gray-100 text-gray-800";
  };

  const filteredAttendees = getFilteredAttendees();

  return (
    <div className="space-y-6">
      <h2 className="text-gray-800">Event Registrations</h2>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Event Name</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Registrations</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Capacity</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-800">Mr. and Ms. DYCI pageant</td>
                <td className="py-3 px-4 text-sm text-gray-600">April 26, 2024</td>
                <td className="py-3 px-4 text-sm text-gray-600">42</td>
                <td className="py-3 px-4 text-sm text-gray-600">100</td>
                <td className="py-3 px-4">
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs">Open</span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleViewDetails("Mr. and Ms. DYCI pageant", "April 26, 2024", 42, 100, "Open")}
                    className="bg-[#1e40af] text-white px-4 py-1.5 rounded text-xs hover:bg-[#1e3a8a]"
                  >
                    View Details
                  </button>
                </td>
              </tr>
              <tr className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-800">Festival Showdown and Streetdance Competition</td>
                <td className="py-3 px-4 text-sm text-gray-600">April 29, 2024</td>
                <td className="py-3 px-4 text-sm text-gray-600">230</td>
                <td className="py-3 px-4 text-sm text-gray-600">250</td>
                <td className="py-3 px-4">
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs">Almost Full</span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleViewDetails("Festival Showdown and Streetdance Competition", "April 29, 2024", 230, 250, "Almost Full")}
                    className="bg-[#1e40af] text-white px-4 py-1.5 rounded text-xs hover:bg-[#1e3a8a]"
                  >
                    View Details
                  </button>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-3 px-4 text-sm text-gray-800">Bloodletting Activity</td>
                <td className="py-3 px-4 text-sm text-gray-600">May 5, 2024</td>
                <td className="py-3 px-4 text-sm text-gray-600">145</td>
                <td className="py-3 px-4 text-sm text-gray-600">150</td>
                <td className="py-3 px-4">
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs">Limited</span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleViewDetails("Bloodletting Activity", "May 5, 2024", 145, 150, "Limited")}
                    className="bg-[#1e40af] text-white px-4 py-1.5 rounded text-xs hover:bg-[#1e3a8a]"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Details Modal */}
      {showDetailsModal && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="bg-[#1e40af] text-white p-6 flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold mb-2">{selectedEvent.eventName}</h3>
                <p className="text-sm opacity-90">{selectedEvent.date}</p>
                <div className="mt-2 flex gap-4 text-sm">
                  <span>{selectedEvent.registrations} Registrations</span>
                  <span>•</span>
                  <span>Capacity: {selectedEvent.capacity}</span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="border-b border-gray-200 p-4 bg-gray-50 flex flex-wrap gap-3">
              <button
                onClick={handleExportToCSV}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
              >
                <Download className="w-4 h-4" />
                Export to CSV
              </button>
              <button
                onClick={handleSendConfirmationEmails}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                <Mail className="w-4 h-4" />
                Send Confirmation Emails {selectedAttendees.size > 0 && `(${selectedAttendees.size})`}
              </button>
              <button
                onClick={handleCheckInAttendees}
                className="flex items-center gap-2 bg-[#1e40af] text-white px-4 py-2 rounded hover:bg-[#1e3a8a] text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                Check In Attendees {selectedAttendees.size > 0 && `(${selectedAttendees.size})`}
              </button>
            </div>

            {/* Search and Filter */}
            <div className="p-4 bg-white border-b border-gray-200 flex flex-wrap gap-3">
              <div className="flex-1 min-w-[200px] relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-[#1e40af]"
                >
                  <option value="all">All Status</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="checked-in">Checked In</option>
                </select>
              </div>
            </div>

            {/* Attendee List */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-semibold text-gray-800">
                  Attendee List ({filteredAttendees.length})
                </h4>
                <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedAttendees.size === filteredAttendees.length && filteredAttendees.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 text-[#1e40af] border-gray-300 rounded focus:ring-[#1e40af]"
                  />
                  Select All
                </label>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50">
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Select</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Name</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Email</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Registration Date</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Ticket Type</th>
                      <th className="text-left py-3 px-4 text-xs font-semibold text-gray-600 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendees.map((attendee) => (
                      <tr key={attendee.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <input
                            type="checkbox"
                            checked={selectedAttendees.has(attendee.id)}
                            onChange={() => toggleAttendeeSelection(attendee.id)}
                            className="w-4 h-4 text-[#1e40af] border-gray-300 rounded focus:ring-[#1e40af]"
                          />
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800 font-medium">{attendee.name}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{attendee.email}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{attendee.registrationDate}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{attendee.ticketType}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs ${getStatusBadge(attendee.status)}`}>
                            {attendee.status === "checked-in" ? "Checked In" : attendee.status.charAt(0).toUpperCase() + attendee.status.slice(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredAttendees.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No attendees found matching your criteria.
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}



