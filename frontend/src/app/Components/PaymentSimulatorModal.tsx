// src/app/Components/PaymentSimulatorModal.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventsContext'; // 🔔 IMPORTED CONTEXT HOOK FOR NOTIFICATIONS
import { X, CreditCard, ShieldCheck, Loader2 } from 'lucide-react';

interface PaymentSimulatorProps {
  eventTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentSimulatorModal({ eventTitle, isOpen, onClose }: PaymentSimulatorProps) {
  const navigate = useNavigate();
  const { addNotification } = useEvents(); // 🔔 Destructure the alert delivery pipeline
  
  const [isPaying, setIsPaying] = useState(false);
  const [ticketType, setTicketType] = useState<'general' | 'vip'>('general');
  const [quantity, setQuantity] = useState<number>(1);
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState(''); // 📅 Controlled clean numeric hook state
  const [cvv, setCvv] = useState('');

  if (!isOpen) return null;

  const pricePerTicket = ticketType === 'vip' ? 500 : 150;
  const totalAmount = pricePerTicket * quantity;

  // 📅 ✅ Text Block Filter: Strip text letters and auto-inject dynamic slashes
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let cleanedNum = e.target.value.replace(/\D/g, ''); // Drop anything that isn't a base number
    
    if (cleanedNum.length > 2) {
      cleanedNum = `${cleanedNum.slice(0, 2)}/${cleanedNum.slice(2, 4)}`; // Break down with a slash separator
    }
    
    setExpiry(cleanedNum);
  };

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPaying(true);
    
    // Simulate payment gateway authorization delay
    setTimeout(() => {
      setIsPaying(false);
      onClose(); // Shut the modal window context
      
      const referenceNo = `DYCI-${Math.floor(Math.random() * 900000 + 100000)}`;
      
      // 🔔 🚀 DISPATCH COMPREHENSIVE TICKET DATA OBJECT TO MATCH THE UPDATED CONTEXT INTERFACE
      addNotification({
        message: "Thank you for joining the event!",
        eventTitle: eventTitle,
        ticketType: ticketType.toUpperCase(),
        quantity: quantity,         // 🪑 Number of seats reserved passed safely
        totalAmount: totalAmount,   // 💰 Calculated numeric amount total passed
        referenceNo: referenceNo    // 🔍 Unique transaction hash string passed
      });

      // Navigate to the dedicated page and pass state variables safely!
      navigate('/dashboard/payment-success', {
        state: {
          eventTitle,
          totalAmount,
          quantity,
          ticketType: ticketType.toUpperCase(),
          referenceNo
        }
      });
    }, 2200);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none animate-in fade-in duration-200">
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div className="bg-white rounded-2xl w-full max-w-[440px] shadow-2xl overflow-hidden flex flex-col transform transition-all text-left border border-slate-100">
        <div className="bg-[#1e40af] px-6 py-4 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <CreditCard size={18} className="text-blue-200" />
            <h3 className="text-sm font-bold tracking-tight">Secure Campus Checkout</h3>
          </div>
          {!isPaying && (
            <button onClick={onClose} className="text-white/80 hover:text-white hover:bg-white/10 p-1 rounded-lg transition cursor-pointer">
              <X size={18} />
            </button>
          )}
        </div>

        <div className="p-6 bg-white flex-1">
          {isPaying ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <Loader2 className="w-8 h-8 text-[#1e40af] animate-spin" />
              <div>
                <h4 className="text-sm font-bold text-slate-800">Encrypting Transaction</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-[240px] mx-auto">Connecting to secure banking network infrastructure protocol layer...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleProcessPayment} className="space-y-4">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Purchasing Access For</p>
                <h4 className="text-sm font-extrabold text-slate-800 truncate mt-0.5">{eventTitle}</h4>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setTicketType('general')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    ticketType === 'general'
                      ? 'border-[#1e40af] bg-blue-50/40 text-[#1e40af]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold">General</span>
                  <span className="text-[11px] font-medium text-slate-400 mt-0.5">₱150.00</span>
                </button>
                <button
                  type="button"
                  onClick={() => setTicketType('vip')}
                  className={`p-3 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                    ticketType === 'vip'
                      ? 'border-[#1e40af] bg-blue-50/40 text-[#1e40af]'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-bold text-amber-600">VIP Ticket</span>
                  <span className="text-[11px] font-medium text-slate-400 mt-0.5">₱500.00</span>
                </button>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-600">Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-slate-50/50 focus:bg-white focus:border-[#1e40af] outline-none transition-all font-bold"
                />
              </div>

              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-600">Card Number</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim())}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs font-mono outline-none focus:border-[#1e40af] bg-slate-50/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">Expiration</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="MM/YY" 
                      maxLength={5} 
                      value={expiry} 
                      onChange={handleExpiryChange}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-center text-xs font-mono outline-none focus:border-[#1e40af] bg-slate-50/10" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-600">CVV</label>
                    <input 
                      type="password" 
                      required 
                      maxLength={3} 
                      placeholder="•••" 
                      value={cvv} 
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} 
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-center text-xs font-mono outline-none focus:border-[#1e40af] bg-slate-50/10" 
                    />
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center border border-slate-100">
                <span className="text-xs font-bold text-slate-500">Grand Total:</span>
                <span className="text-base font-extrabold text-slate-800">₱{totalAmount.toLocaleString()}.00</span>
              </div>

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm">
                <ShieldCheck size={14} />
                <span>Authorize Payment</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}