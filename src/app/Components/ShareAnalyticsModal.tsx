// src/app/Components/ShareAnalyticsModal.tsx
import { X, Copy, Mail, Check } from "lucide-react"; // ✅ FIXED: Cleaned up unused icon exports
import { useState } from "react";

interface ShareAnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: {
    totalRegistrations: string;
    checkIns: string;
    revenue: string;
  };
}

export function ShareAnalyticsModal({ isOpen, onClose, stats }: ShareAnalyticsModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareText = `📊 Event Report Summary:\n• Total Registrations: ${stats.totalRegistrations}\n• Check-ins Today: ${stats.checkIns}\n• Event Revenue: ${stats.revenue}\n\nManaged via Dr. Yanga's Events Manager.`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md border border-slate-100 shadow-2xl overflow-hidden p-6 relative">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold text-slate-800 tracking-tight">
            Share Analytics Metrics
          </h3>
          <button 
            onClick={onClose}
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Data Preview Box */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 mb-6 text-sm text-slate-600 space-y-1 font-mono whitespace-pre-line">
          {shareText}
        </div>

        {/* Quick Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleCopy}
            className="w-full flex items-center justify-center gap-2 bg-[#1e40af] hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl text-sm transition shadow-sm cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                Copied to Clipboard!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                Copy Raw Metrics Text
              </>
            )}
          </button>

          <hr className="border-slate-100 my-4" />

          {/* Social Streams Matrix */}
          <div className="grid grid-cols-2 gap-4"> {/* ✅ FIXED: Changed to grid-cols-2 for balanced spacing */}
            <a
              href={`mailto:?subject=Event Analytics Data Summary&body=${encodeURIComponent(shareText)}`}
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition text-slate-600 text-xs font-semibold cursor-pointer"
            >
              <Mail className="w-5 h-5 text-slate-500" />
              Email Summary
            </a>
            
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition text-slate-600 text-xs font-semibold cursor-pointer"
            >
              <X className="w-5 h-5 text-slate-800" />
              Twitter / X
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}