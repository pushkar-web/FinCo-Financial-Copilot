import React, { useState } from 'react';
import { X, Lock, Unlock, TrendingUp, ShieldCheck, Wallet, ArrowRightLeft } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (amount: number, type: 'deposit' | 'withdraw') => void;
  walletBalance: number;
  vaultBalance: number;
}

export const VaultModal: React.FC<Props> = ({ isOpen, onClose, onTransfer, walletBalance, vaultBalance }) => {
  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const maxAmount = activeTab === 'deposit' ? walletBalance : vaultBalance;

  const handleTransfer = async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    
    setIsProcessing(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate contract interaction
    
    onTransfer(parseFloat(amount), activeTab);
    setIsProcessing(false);
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-indigo-900/20">
        
        {/* Header */}
        <div className="bg-slate-900 p-6 relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500 rounded-full blur-[50px] opacity-20"></div>
            <div className="relative z-10 flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                         <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                             DeFi Protocol
                         </span>
                    </div>
                    <h2 className="text-2xl font-bold text-white">FinVault™</h2>
                    <p className="text-indigo-200 text-sm mt-1">Staking APY: <span className="text-green-400 font-bold">6.5%</span></p>
                </div>
                <button onClick={onClose} className="text-slate-400 hover:text-white bg-white/5 p-2 rounded-lg backdrop-blur-sm transition-colors">
                    <X size={20} />
                </button>
            </div>
            
            <div className="mt-6 flex gap-4">
                <div className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3">
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Vault Balance</p>
                    <p className="text-xl font-bold text-white">₹{vaultBalance.toLocaleString()}</p>
                </div>
                <div className="flex-1 bg-indigo-600/20 border border-indigo-500/30 rounded-xl p-3">
                     <p className="text-[10px] text-indigo-300 uppercase font-bold tracking-wider mb-1">Est. Monthly</p>
                     <p className="text-xl font-bold text-indigo-100">+ ₹{Math.round(vaultBalance * 0.065 / 12).toLocaleString()}</p>
                </div>
            </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
            <button 
                onClick={() => { setActiveTab('deposit'); setAmount(''); }}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'deposit' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <Lock size={16} /> Deposit
            </button>
            <button 
                onClick={() => { setActiveTab('withdraw'); setAmount(''); }}
                className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-all ${activeTab === 'withdraw' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/50' : 'text-slate-400 hover:text-slate-600'}`}
            >
                <Unlock size={16} /> Withdraw
            </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
            <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                    <span className="font-bold text-slate-700">Amount</span>
                    <span className="text-slate-500 text-xs">Available: ₹{maxAmount.toLocaleString()}</span>
                </div>
                
                <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-lg">₹</span>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full pl-10 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-xl font-bold text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                    />
                    <button 
                        onClick={() => setAmount(maxAmount.toString())}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
                    >
                        MAX
                    </button>
                </div>

                <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-500 leading-relaxed">
                    <ShieldCheck size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                    <p>
                        {activeTab === 'deposit' 
                            ? "Funds will be moved from your Wallet to the Vault smart contract. You start earning interest immediately." 
                            : "Funds will be moved from the Vault back to your Wallet. Interest accrual stops for this amount."}
                    </p>
                </div>

                <button 
                    onClick={handleTransfer}
                    disabled={!amount || parseFloat(amount) <= 0 || parseFloat(amount) > maxAmount || isProcessing}
                    className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        activeTab === 'deposit' 
                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200' 
                            : 'bg-slate-900 hover:bg-slate-800 shadow-slate-200'
                    } disabled:opacity-50 disabled:scale-100`}
                >
                    {isProcessing ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                            {activeTab === 'deposit' ? <Lock size={18} /> : <Unlock size={18} />}
                            {activeTab === 'deposit' ? 'Stake Funds' : 'Unstake Funds'}
                        </>
                    )}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};