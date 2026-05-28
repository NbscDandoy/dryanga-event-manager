import { BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react'; // Separate type declaration row

interface AnalyticsCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  color?: string;
}

export function AnalyticsCard({ icon: Icon, value, label, color = "#1e40af" }: AnalyticsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-600 text-sm mb-1">{label}</p>
          <p className="text-3xl font-bold" style={{ color }}>{value}</p>
        </div>
        <div 
          className="p-3 rounded-lg" 
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color }} />
        </div>
      </div>
    </div>
  );
}
