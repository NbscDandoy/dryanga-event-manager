import { AnalyticsCard } from "../Components/AnalyticsCard";
import { UserCheck, TrendingUp, DollarSign, Calendar, Users, Award, Download, Share2 } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const monthlyData = [
  { id: "jan", month: "Jan", registrations: 85, events: 5 },
  { id: "feb", month: "Feb", registrations: 120, events: 8 },
  { id: "mar", month: "Mar", registrations: 180, events: 12 },
  { id: "apr", month: "Apr", registrations: 350, events: 15 },
  { id: "may", month: "May", registrations: 428, events: 18 },
];

const categoryData = [
  { id: "academic", name: "Academic", value: 35 },
  { id: "cultural", name: "Cultural", value: 25 },
  { id: "sports", name: "Sports", value: 20 },
  { id: "social", name: "Social", value: 20 },
];

const COLORS = ['#1e40af', '#fbbf24', '#10b981', '#f59e0b'];

export function Analytics() {
  const handleExportReport = () => {
    alert("Export Analytics Report\n\nGenerating comprehensive report...\n\nFormats available:\n• PDF\n• Excel (CSV)\n• PowerPoint\n\nThe report will include all charts and statistics.");
  };

  const handleShareAnalytics = () => {
    alert("Share Analytics\n\nShare this analytics dashboard with:\n• Email recipients\n• Team members\n• Download shareable link\n\nPermissions: View only");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-gray-800">Event Analytics</h2>
        <div className="flex gap-2">
          <button
            onClick={handleExportReport}
            className="bg-[#1e40af] text-white px-4 py-2 rounded-lg hover:bg-[#1e3a8a] transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button
            onClick={handleShareAnalytics}
            className="border border-[#1e40af] text-[#1e40af] px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>
      </div>
      
      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <AnalyticsCard
          icon={UserCheck}
          value="428"
          label="Total Registrations"
          color="#1e40af"
        />
        <AnalyticsCard
          icon={Calendar}
          value="40"
          label="Total Events"
          color="#10b981"
        />
        <AnalyticsCard
          icon={Users}
          value="216"
          label="Active Participants"
          color="#fbbf24"
        />
        <AnalyticsCard
          icon={Award}
          value="92%"
          label="Attendance Rate"
          color="#f59e0b"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Registration Trends */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Registration Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} key="grid-line" />
              <XAxis dataKey="month" stroke="#64748b" key="xaxis-line" />
              <YAxis stroke="#64748b" key="yaxis-line" />
              <Tooltip
                key="tooltip-line"
                contentStyle={{
                  backgroundColor: '#fff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend key="legend-line" />
              <Line
                key="line-registrations"
                type="monotone"
                dataKey="registrations"
                stroke="#1e40af"
                strokeWidth={2}
                dot={{ fill: '#1e40af', r: 4 }}
                name="Registrations"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Event Categories */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Event Categories</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                key="pie-categories"
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry) => (
                  <Cell key={entry.id} fill={COLORS[categoryData.indexOf(entry) % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip key="tooltip-pie" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Overview */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Monthly Event Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} key="grid-bar" />
            <XAxis dataKey="month" stroke="#64748b" key="xaxis-bar" />
            <YAxis stroke="#64748b" key="yaxis-bar" />
            <Tooltip
              key="tooltip-bar"
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #e2e8f0',
                borderRadius: '0.5rem'
              }}
            />
            <Legend key="legend-bar" />
            <Bar dataKey="events" fill="#1e40af" radius={[8, 8, 0, 0]} name="Events" key="bar-events" />
            <Bar dataKey="registrations" fill="#fbbf24" radius={[8, 8, 0, 0]} name="Registrations" key="bar-registrations" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}