import React, { useState } from 'react';
import { X, Target, Calendar, IndianRupee, Save } from 'lucide-react';
import { Goal } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: Goal) => void;
}

export const AddGoalModal: React.FC<Props> = ({ isOpen, onClose, onAddGoal }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [currentAmount, setCurrentAmount] = useState('');
  const [deadline, setDeadline] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || !deadline) return;

    const newGoal: Goal = {
      id: Date.now().toString(),
      name,
      targetAmount: parseFloat(targetAmount),
      currentAmount: parseFloat(currentAmount) || 0,
      deadline
    };

    onAddGoal(newGoal);
    onClose();
    // Reset form
    setName('');
    setTargetAmount('');
    setCurrentAmount('');
    setDeadline('');
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 text-white flex justify-between items-center">
           <div className="flex items-center gap-2">
             <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                <Target size={18} className="text-purple-100" />
            </div>
            <h2 className="text-xl font-bold">New Goal</h2>
           </div>
           <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
             <X size={20} />
           </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Goal Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. New Laptop, Emergency Fund"
              className="w-full p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all placeholder-slate-400"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Amount</label>
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="number" 
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all placeholder-slate-400"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Saved So Far</label>
              <div className="relative">
                <IndianRupee size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="number" 
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  placeholder="0"
                  className="w-full pl-8 p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all placeholder-slate-400"
                />
              </div>
            </div>
          </div>

          <div>
             <label className="block text-sm font-medium text-slate-700 mb-1">Target Date</label>
             <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input 
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full pl-10 p-3 rounded-xl bg-slate-800 text-white border border-slate-700 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none transition-all placeholder-slate-400 [color-scheme:dark]"
                  required
                />
             </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit"
              className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-2"
            >
              <Save size={18} /> Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};