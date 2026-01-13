import React, { useState } from 'react';
import { X, Send, User, Wallet, CheckCircle2, ArrowRight, Activity, ExternalLink } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSend: (recipient: string, amount: number) => void;
  currentBalance: number;
}

export const SendMoneyModal: React.FC<Props> = ({ isOpen, onClose, onSend, currentBalance }) => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'scanning' | 'confirming' | 'success'>('idle');
  const [txHash, setTxHash] = useState('');

  if (!isOpen) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    setStatus('scanning');
    await new Promise(r => setTimeout(r, 1000));
    
    setStatus('confirming');
    await new Promise(r => setTimeout(r, 1500));
    
    // Generate mock hash
    const mockHash = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    setTxHash(mockHash);
    
    onSend(recipient, parseFloat(amount));
    setStatus('success');
  };

  const handleClose = () => {
    setRecipient('');
    setAmount('');
    setStatus('idle');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-700">
        
        <div className="bg-slate-900 p-6 text-white flex justify-between items-center relative overflow-hidden">
           <div className="absolute top-0 right-0 p-6 opacity-5">
               <Send size={120} />
           </div>
           <div className="flex items-center gap-3 relative z-10">
             <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-900/50">
                <Send size={20} className="text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold">P2P Transfer</h2>
                <p className="text-slate-400 text-xs">Blockchain & UPI Enabled</p>
            </div>
           </div>
           <button onClick={handleClose} className="text-slate-400 hover:text-white transition-colors relative z-10">
             <X size={20} />
           </button>
        </div>

        <div className="p-6">
            {status === 'success' ? (
                <div className="text-center py-4">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                        <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Transfer Complete!</h3>
                    <p className="text-slate-500 text-sm mb-6">Sent ₹{parseFloat(amount).toLocaleString()} to {recipient}</p>
                    
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-6 text-left">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Transaction Hash</p>
                        <p className="font-mono text-xs text-slate-600 break-all">{txHash}</p>
                        <div className="flex justify-end mt-2">
                            <span className="text-[10px] text-blue-600 font-bold flex items-center gap-1 cursor-pointer hover:underline">
                                View on Explorer <ExternalLink size={10} />
                            </span>
                        </div>
                    </div>
                    
                    <button 
                        onClick={handleClose}
                        className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                    >
                        Done
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSend} className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Recipient</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                value={recipient}
                                onChange={(e) => setRecipient(e.target.value)}
                                placeholder="Address (0x...) or UPI ID"
                                className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                                disabled={status !== 'idle'}
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Amount</label>
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                            <input 
                                type="number" 
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="0.00"
                                className="w-full pl-8 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all font-bold text-lg"
                                max={currentBalance}
                                disabled={status !== 'idle'}
                                required
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                Max: ₹{currentBalance.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Network Fee Simulation */}
                    <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2 text-blue-700">
                            <Activity size={16} />
                            <span className="font-semibold">Network Fee</span>
                        </div>
                        <span className="font-bold text-blue-800">~ ₹0.00</span>
                    </div>

                    <button 
                        type="submit"
                        disabled={status !== 'idle' || !amount || !recipient || parseFloat(amount) > currentBalance}
                        className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center gap-2"
                    >
                        {status === 'idle' && <>Send Funds <ArrowRight size={18} /></>}
                        {status === 'scanning' && <>Scanning Network...</>}
                        {status === 'confirming' && <>Confirming on Chain...</>}
                    </button>
                </form>
            )}
        </div>
      </div>
    </div>
  );
};