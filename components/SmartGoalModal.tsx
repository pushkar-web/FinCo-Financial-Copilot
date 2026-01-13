import React, { useState } from 'react';
import { X, Target, Calendar, IndianRupee, Save, TrendingUp, Lock, ShieldCheck, Zap, CheckCircle2, ExternalLink } from 'lucide-react';
import { Goal } from '../types';

interface Props {
  goal: Goal | null;
  isOpen: boolean;
  onClose: () => void;
  onStake: (goalId: string, amount: number) => void;
  currentBalance: number;
}

export const SmartGoalModal: React.FC<Props> = ({ goal, isOpen, onClose, onStake, currentBalance }) => {
  const [stakeAmount, setStakeAmount] = useState('');
  const [status, setStatus] = useState<'idle' | 'processing' | 'success'>('idle');
  const [txHash, setTxHash] = useState('');

  if (!isOpen || !goal) return null;

  const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
  const estimatedYield = goal.apy ? (parseFloat(stakeAmount || '0') * (goal.apy / 100)) : 0;

  const handleStake = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(stakeAmount);
    if (!amount || amount <= 0 || amount > currentBalance) return;

    setStatus('processing');
    // Simulate blockchain confirmation time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock hash
    const mockHash = "0x" + Array(40).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
    setTxHash(mockHash);
    
    onStake(goal.id, amount);
    setStatus('success');
  };

  const handleClose = () => {
      setStakeAmount('');
      setStatus('idle');
      setTxHash('');
      onClose();
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 p-6 text-white relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10">
               <Target size={100} />
           </div>
           
           <div className="relative z-10 flex justify-between items-start">
               <div>
                    <div className="flex items-center gap-2 mb-1">
                         <h2 className="text-xl font-bold">{goal.name}</h2>
                         {goal.smartContractAddress && (
                             <span className="bg-green-500/20 text-green-300 border border-green-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono flex items-center gap-1">
                                 <Lock size={10} /> Smart Contract
                             </span>
                         )}
                    </div>
                    <p className="text-indigo-200 text-sm">Target: ₹{goal.targetAmount.toLocaleString()}</p>
               </div>
               <button onClick={handleClose} className="text-white/70 hover:text-white transition-colors bg-white/10 p-1.5 rounded-lg backdrop-blur-md">
                 <X size={20} />
               </button>
           </div>
        </div>

        <div className="p-6">
            {status === 'success' ? (
                <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 size={32} className="text-green-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">Staking Successful</h3>
                    <p className="text-slate-500 text-sm mb-6">Your funds are now locked in the smart contract.</p>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 w-full mb-6 text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Transaction Hash</p>
                        <div className="font-mono text-xs text-slate-600 break-all bg-white border border-slate-100 p-2 rounded-lg">
                            {txHash}
                        </div>
                        <div className="flex justify-end mt-2">
                            <span className="text-xs text-blue-600 font-bold flex items-center gap-1 cursor-pointer hover:underline">
                                View on Explorer <ExternalLink size={10} />
                            </span>
                        </div>
                    </div>

                    <button 
                        onClick={handleClose}
                        className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all"
                    >
                        Done
                    </button>
                </div>
            ) : (
                <>
                    {/* Progress Section */}
                    <div className="mb-8">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-500 font-medium">Progress</span>
                            <span className="font-bold text-indigo-600">{percent}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-1000" style={{width: `${percent}%`}}></div>
                        </div>
                        <div className="flex justify-between mt-2 text-xs text-slate-400">
                            <span>₹{goal.currentAmount.toLocaleString()} locked</span>
                            <span>₹{(goal.targetAmount - goal.currentAmount).toLocaleString()} to go</span>
                        </div>
                    </div>

                    {/* Staking Form */}
                    <form onSubmit={handleStake} className="space-y-4">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Stake to Contract</label>
                            <div className="relative">
                                <IndianRupee size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="number" 
                                    value={stakeAmount}
                                    onChange={(e) => setStakeAmount(e.target.value)}
                                    placeholder="Amount to deposit"
                                    className="w-full pl-10 p-3 rounded-lg bg-white border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900"
                                    max={currentBalance}
                                    disabled={status === 'processing'}
                                />
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                                    Avl: ₹{currentBalance.toLocaleString()}
                                </div>
                            </div>
                        </div>

                        {/* Yield Info */}
                        {goal.apy && (
                            <div className="flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-xl border border-green-100">
                                <TrendingUp size={20} />
                                <div>
                                    <p className="text-xs font-bold uppercase opacity-70">Projected Yield ({goal.apy}% APY)</p>
                                    <p className="font-bold text-sm">+ ₹{estimatedYield.toFixed(2)} / year</p>
                                </div>
                            </div>
                        )}
                        
                        {/* Info Text */}
                        <p className="text-[10px] text-slate-400 text-center leading-tight">
                            By staking, you are interacting with a verified Smart Contract. 
                            <br/>Gas fees are covered by FinCo.
                        </p>

                        <button 
                            type="submit"
                            disabled={!stakeAmount || parseFloat(stakeAmount) <= 0 || parseFloat(stakeAmount) > currentBalance || status === 'processing'}
                            className="w-full py-3.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-200 active:scale-95 flex items-center justify-center gap-2"
                        >
                            {status === 'processing' ? (
                                <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                Confirming on Chain...
                                </>
                            ) : (
                                <>
                                <ShieldCheck size={18} /> Stake & Lock Funds
                                </>
                            )}
                        </button>
                    </form>
                </>
            )}
        </div>
      </div>
    </div>
  );
};