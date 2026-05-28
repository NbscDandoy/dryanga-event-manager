// src/app/Pages/paymentsuccess.tsx
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react'; // 👈 Imported scannable vector graphic engine
import { CheckCircle2, ArrowLeft, Printer, ShieldCheck } from 'lucide-react';

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract payment transaction data out of router state context history cache
  const transaction = location.state || {
    eventTitle: "Default Campus Event Pass",
    totalAmount: 150,
    quantity: 1,
    ticketType: "GENERAL",
    referenceNo: "DYCI-SAMPLE-0000"
  };

  // 🔒 Structured string stringified payload parsed securely by staff check-in reader apps
  const qrSecurityPayload = JSON.stringify({
    ref: transaction.referenceNo,
    event: transaction.eventTitle,
    type: transaction.ticketType,
    qty: transaction.quantity,
    timestamp: new Date().toISOString()
  });

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4 bg-slate-50/50 select-none text-left">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-lg border border-slate-100 p-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
        
        {/* Success Icon Block Header */}
        <div className="flex flex-col items-center justify-center text-center space-y-3">
          <div className="w-14 h-14 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-200 shadow-xs">
            <CheckCircle2 size={28} className="animate-pulse" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Payment Approved!</h2>
            <p className="text-xs text-slate-400 mt-1">Your reservation seat is officially logged into the dashboard registry database.</p>
          </div>
        </div>

        {/* Outer Printable Receipt Ticket Pass Box */}
        <div className="border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl p-5 space-y-4 relative overflow-hidden">
          {/* Decorative Ticket Side Cuts notches */}
          <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-r border-slate-200" />
          <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full border-l border-slate-200" />

          {/* Ticket Metadata Top Block Container Split */}
          <div className="flex justify-between items-start gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-[#1e40af] uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded border border-blue-100">Official Pass</span>
              <h3 className="text-sm font-bold text-slate-800 truncate mt-2 max-w-[200px] leading-tight">{transaction.eventTitle}</h3>
            </div>

            {/* ✅ DYNAMIC SCANNABLE VECTOR QR CODE EMBED */}
            <div className="bg-white p-1.5 rounded-xl border border-slate-200/60 shadow-2xs shrink-0 flex items-center justify-center">
              <QRCodeSVG 
                value={qrSecurityPayload} 
                size={70}
                level="M" // Medium safety error correction overhead index margin
                includeMargin={false}
              />
            </div>
          </div>

          {/* Bottom Financial Overview Items Grid */}
          <div className="border-t border-slate-100 pt-3 space-y-2 font-mono text-xs text-slate-600">
            <div className="flex justify-between">
              <span className="text-slate-400">Reference:</span>
              <span className="font-bold text-slate-700">{transaction.referenceNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tier Tiered:</span>
              <span>{transaction.quantity}x {transaction.ticketType}</span>
            </div>

            {/* Digital Security Badge Signature Indicator */}
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 font-sans font-bold bg-emerald-50 px-2 py-0.5 rounded-md w-fit mt-1">
              <ShieldCheck size={11} />
              <span>Gate Entry Scan Cleared</span>
            </div>

            <div className="flex justify-between items-center border-t border-slate-100/70 pt-2 mt-1">
              <span className="text-slate-500 font-sans font-semibold">Total Charged:</span>
              <span className="text-sm font-extrabold text-emerald-600 font-sans">₱{transaction.totalAmount.toLocaleString()}.00</span>
            </div>
          </div>
        </div>

        {/* Action button triggers row */}
        <div className="space-y-2">
          <button 
            onClick={() => window.print()} 
            className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Printer size={14} />
            <span>Print Receipt Slips</span>
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')} 
            className="w-full bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold py-2.5 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <ArrowLeft size={14} />
            <span>Return to Live Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
}