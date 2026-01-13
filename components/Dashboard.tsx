import React, { useMemo } from 'react';
import { UserContext, Goal } from '../types';
import { 
  Wallet, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, 
  Calendar, Clock, Target, CreditCard, Activity, Shield, Rocket, 
  Award, Zap, CheckCircle2, Plus, Edit2, RotateCw, Lock, Link as LinkIcon, Coins, AlertOctagon,
  Landmark
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Utensils, Car, ShoppingBag, Film, HeartPulse, Banknote, ArrowRightLeft, MoreHorizontal } from 'lucide-react';

const getIcon = (category: string) => {
  switch (category) {
    case 'Food': return <Utensils size={18} />;
    case 'Transport': return <Car size={18} />;
    case 'Shopping': return <ShoppingBag size={18} />;
    case 'Bills': return <Zap size={18} />;
    case 'Entertainment': return <Film size={18} />;
    case 'Health': return <HeartPulse size={18} />;
    case 'Salary': return <Banknote size={18} />;
    case 'Transfer': return <ArrowRightLeft size={18} />;
    default: return <MoreHorizontal size={18} />;
  }
};

interface Props {
  userContext: UserContext;
  onMarkBillPaid: (id: string) => void;
  onAddGoalClick: () => void;
  onUpdateIncome: () => void;
  onGoalClick: (goal: Goal) => void;
  onUpdateBudget: (category: string) => void;
  onOpenVault: () => void;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export const Dashboard: React.FC<Props> = ({ 
  userContext, onMarkBillPaid, onAddGoalClick, onUpdateIncome, onGoalClick, onUpdateBudget, onOpenVault 
}) => {
  
  // Calculate category spend
  const categorySpend = useMemo(() => userContext.transactions
    .filter(t => t.type === 'debit')
    .reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>), [userContext.transactions]);

  const pieData = Object.keys(categorySpend).map(key => ({
    name: key,
    value: categorySpend[key]
  })).sort((a,b) => b.value - a.value);

  const totalSpent = useMemo(() => userContext.transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0), [userContext.transactions]);

  const unpaidBills = userContext.bills.filter(b => !b.isPaid);
  const sortedBills = [...unpaidBills].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Subscriptions Heuristic
  const subscriptions = useMemo(() => {
     const counts: Record<string, {count: number, amount: number, lastDate: string}> = {};
     userContext.transactions
        .filter(t => t.type === 'debit' && t.category !== 'Transfer')
        .forEach(t => {
            const key = `${t.merchant}-${Math.round(t.amount / 100) * 100}`;
            if (!counts[key]) counts[key] = { count: 0, amount: t.amount, lastDate: t.date };
            counts[key].count++;
        });
     
     return Object.entries(counts)
        .filter(([_, data]) => data.count > 1)
        .map(([key, data]) => ({
            name: key.split('-')[0],
            amount: data.amount,
            lastDate: data.lastDate
        }));
  }, [userContext.transactions]);

  const getDaysDiff = (dateStr: string) => {
    const due = new Date(dateStr);
    const now = new Date();
    due.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - now.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const trendData = useMemo(() => {
    const today = new Date();
    const data = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const daySpend = userContext.transactions
            .filter(t => t.date === dateStr && t.type === 'debit')
            .reduce((sum, t) => sum + t.amount, 0);
        data.push({
            date: d.toLocaleDateString('en-IN', { weekday: 'short' }),
            spend: daySpend
        });
    }
    return data;
  }, [userContext.transactions]);

  const calculateScore = () => {
    let score = 70;
    const savingsRatio = (userContext.monthlyIncome - totalSpent) / userContext.monthlyIncome;
    if (savingsRatio > 0.2) score += 15;
    else if (savingsRatio > 0.1) score += 5;
    else if (savingsRatio < 0) score -= 15;
    const hasOverdue = sortedBills.some(b => getDaysDiff(b.dueDate) < 0);
    if (hasOverdue) score -= 20;
    else if (sortedBills.length === 0) score += 10;
    const billsTotal = sortedBills.reduce((acc, b) => acc + b.amount, 0);
    if (userContext.currentBalance < billsTotal) score -= 15;
    else score += 5;
    return Math.max(0, Math.min(100, score));
  };

  const healthScore = calculateScore();
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#ef4444';
  };
  
  const getPersona = (score: number) => {
      if (score >= 80) return { title: "Wealth Wizard", icon: <Rocket size={20} className="text-white"/>, color: "bg-emerald-500", desc: "Your habits are impeccable." };
      if (score >= 50) return { title: "Balanced Builder", icon: <Shield size={20} className="text-white"/>, color: "bg-amber-500", desc: "Good foundation, room to grow." };
      return { title: "Cashflow Cadet", icon: <AlertTriangle size={20} className="text-white"/>, color: "bg-red-500", desc: "Immediate attention needed." };
  };

  const persona = getPersona(healthScore);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Row: BENTO GRID - High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        
        {/* 1. FinHealth Score & Persona */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between relative overflow-hidden h-[180px]">
           <div className="flex justify-between items-start z-10">
               <div>
                   <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Health Score</h3>
                   <div className="flex items-baseline gap-1 mt-1">
                       <span className="text-4xl font-black text-slate-800 transition-all duration-1000 ease-out">{healthScore}</span>
                       <span className="text-sm font-bold text-slate-300">/100</span>
                   </div>
               </div>
               <div className={`w-10 h-10 rounded-xl ${persona.color} shadow-lg shadow-slate-200 flex items-center justify-center`}>
                   {persona.icon}
               </div>
           </div>
           
           <div className="mt-4 z-10">
               <div className="flex items-center gap-2 mb-1">
                   <span className={`text-sm font-bold px-2 py-0.5 rounded ${persona.color.replace('bg-', 'bg-').replace('500', '100')} ${persona.color.replace('bg-', 'text-').replace('500', '700')}`}>
                       {persona.title}
                   </span>
               </div>
               <p className="text-xs text-slate-500 font-medium leading-tight">{persona.desc}</p>
           </div>
           
           {/* Decorative Background Chart */}
           <div className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10">
                <PieChart width={128} height={128}>
                    <Pie data={[{value: healthScore}, {value: 100-healthScore}]} innerRadius={30} outerRadius={50} dataKey="value">
                        <Cell fill={getScoreColor(healthScore)} />
                        <Cell fill="#e2e8f0" />
                    </Pie>
                </PieChart>
           </div>
        </div>

        {/* 2. Total Liquidity (Combined) */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-3xl shadow-lg shadow-blue-200 text-white relative overflow-hidden flex flex-col justify-between h-[180px] group">
           <div className="absolute top-0 right-0 p-4 opacity-10">
               <Wallet size={80} />
           </div>
           <div>
               <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-2">Total Liquidity</p>
               <h3 className="text-3xl lg:text-4xl font-bold tracking-tight">₹{(userContext.currentBalance + userContext.vaultBalance).toLocaleString('en-IN')}</h3>
           </div>
           
           <div className="grid grid-cols-2 gap-2 mt-auto">
               <div className="bg-white/10 rounded-lg p-2 backdrop-blur-sm">
                   <p className="text-[10px] text-blue-200 uppercase font-bold">Wallet</p>
                   <p className="font-bold text-sm">₹{userContext.currentBalance.toLocaleString()}</p>
               </div>
               <div className="bg-indigo-500/30 rounded-lg p-2 backdrop-blur-sm cursor-pointer hover:bg-indigo-500/50 transition-colors" onClick={onOpenVault}>
                   <p className="text-[10px] text-indigo-200 uppercase font-bold flex items-center gap-1">Vault <ArrowUpRight size={10} /></p>
                   <p className="font-bold text-sm">₹{userContext.vaultBalance.toLocaleString()}</p>
               </div>
           </div>
        </div>

        {/* 3. Vault & Rewards (Updated) */}
        <div 
          onClick={onOpenVault}
          className="bg-slate-900 p-6 rounded-3xl shadow-lg shadow-slate-900/20 text-white relative overflow-hidden flex flex-col justify-between h-[180px] group border border-slate-700/50 cursor-pointer hover:bg-slate-800 transition-colors"
        >
             <div className="absolute -right-6 -top-6 w-32 h-32 bg-indigo-500 rounded-full blur-[60px] opacity-20"></div>
             
             <div className="flex items-center justify-between mb-2 z-10">
                <div className={`p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30`}>
                    <Landmark size={20} />
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-bold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full border border-green-500/30 mb-1">
                        6.5% APY
                    </span>
                    <div className="flex items-center gap-1.5">
                        <Coins size={12} className="text-yellow-400" />
                        <span className="text-xs font-bold text-yellow-400">{userContext.finTokens} FT</span>
                    </div>
                </div>
            </div>

            <div className="z-10">
                <p className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">FinVault™ Earnings</p>
                <h3 className="text-xl font-bold text-white leading-tight">
                    +₹{Math.round(userContext.vaultBalance * 0.065 / 12)} <span className="text-sm font-medium text-slate-500">/mo</span>
                </h3>
            </div>
            
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden z-10">
                <div className="bg-indigo-500 h-full rounded-full w-full animate-pulse"></div>
            </div>
            <p className="text-[10px] text-slate-500 mt-1 flex items-center gap-1">
                <Lock size={10} /> Auto-Compounding
            </p>
        </div>

        {/* 4. Bills Due - INTERACTIVE */}
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 flex flex-col justify-between h-[180px] group hover:border-red-100 transition-colors relative overflow-hidden">
             <div className="flex items-center justify-between mb-2">
                <div className={`p-2.5 rounded-xl bg-red-50 text-red-600`}>
                    <AlertTriangle size={20} />
                </div>
                <span className="text-xs font-bold bg-red-100 text-red-600 px-2 py-1 rounded-full">{sortedBills.length} Due</span>
            </div>
            
            <div className="flex-1 flex flex-col justify-center relative">
                 {sortedBills.length > 0 ? (
                    <>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">Next Due</p>
                        <h3 className="text-xl font-bold text-slate-900 mt-1 truncate">{sortedBills[0].name}</h3>
                        <div className="flex justify-between items-end mt-1">
                            <p className="text-lg font-bold text-red-600">₹{sortedBills[0].amount.toLocaleString('en-IN')}</p>
                            <button 
                                onClick={() => onMarkBillPaid(sortedBills[0].id)}
                                className="px-3 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-700 transition-colors shadow-md active:scale-95 flex items-center gap-1"
                            >
                                Pay <ArrowUpRight size={12}/>
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1 font-medium">
                            <Clock size={10} /> Due {sortedBills[0].dueDate}
                        </p>
                    </>
                 ) : (
                    <div className="text-center">
                        <CheckCircle2 size={32} className="text-green-500 mx-auto mb-2 opacity-80" />
                        <p className="text-sm font-bold text-slate-600">All Bills Paid!</p>
                        <p className="text-xs text-slate-400">Great job keeping up.</p>
                    </div>
                 )}
            </div>
        </div>
      </div>

      {/* Middle Row: Charts & Smart Budgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Chart Area */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                  <div>
                      <h3 className="font-bold text-lg text-slate-800">Cashflow Trend</h3>
                      <p className="text-sm text-slate-400 font-medium">Daily spending over last 7 days</p>
                  </div>
                  <div className="flex gap-2">
                      <button className="px-3 py-1.5 text-xs font-bold text-white bg-slate-900 rounded-lg shadow-md shadow-slate-200">Week</button>
                      <button className="px-3 py-1.5 text-xs font-bold text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">Month</button>
                  </div>
              </div>
              
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendData}>
                        <defs>
                            <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis 
                            dataKey="date" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                            dy={10}
                        />
                        <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 500}} 
                            tickFormatter={(value) => `₹${value/1000}k`}
                        />
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px', fontSize: '12px' }}
                            formatter={(value: number) => [`₹${value}`, 'Spent']}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="spend" 
                            stroke="#3b82f6" 
                            strokeWidth={3}
                            fillOpacity={1} 
                            fill="url(#colorSpend)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
              </div>
          </div>

          {/* Smart Budgets - NEW COMPONENT */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                        <Activity size={16} />
                      </div>
                      <h3 className="font-bold text-lg text-slate-800">Smart Budgets</h3>
                  </div>
              </div>
              <div className="flex-1 overflow-y-auto max-h-[320px] p-4 space-y-4">
                  {(Object.entries(userContext.budgets) as [string, number][]).map(([cat, limit]) => {
                      const spent = categorySpend[cat] || 0;
                      const percentage = Math.min(100, Math.round((spent / limit) * 100));
                      let barColor = 'bg-green-500';
                      let textColor = 'text-green-600';
                      
                      if (percentage > 85) {
                          barColor = 'bg-red-500';
                          textColor = 'text-red-600';
                      } else if (percentage > 50) {
                          barColor = 'bg-yellow-500';
                          textColor = 'text-yellow-600';
                      }

                      return (
                          <div key={cat} className="group cursor-pointer" onClick={() => onUpdateBudget(cat)}>
                              <div className="flex justify-between items-end mb-1">
                                  <div className="flex items-center gap-2">
                                      <div className="text-slate-400">{getIcon(cat)}</div>
                                      <span className="text-sm font-bold text-slate-700">{cat}</span>
                                  </div>
                                  <div className="text-right">
                                      <span className={`text-xs font-bold ${textColor}`}>{percentage}%</span>
                                      <span className="text-[10px] text-slate-400 ml-1">of ₹{limit/1000}k</span>
                                  </div>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden relative">
                                  <div className={`h-full rounded-full transition-all duration-1000 ${barColor}`} style={{width: `${percentage}%`}}></div>
                              </div>
                              <div className="flex justify-between mt-1 text-[10px] text-slate-400">
                                  <span>₹{spent.toLocaleString()} spent</span>
                                  <span className="group-hover:text-blue-500 transition-colors flex items-center gap-0.5">
                                      Edit <Edit2 size={8} />
                                  </span>
                              </div>
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>

      {/* Bottom Row: Goals & Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Goals - INTERACTIVE */}
          <div className="lg:col-span-1 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg text-slate-800 flex items-center gap-2">
                      <Target size={18} className="text-purple-500"/> Goals
                  </h3>
                  <button 
                    onClick={onAddGoalClick}
                    className="p-1.5 bg-slate-100 hover:bg-purple-50 text-slate-500 hover:text-purple-600 rounded-lg transition-colors"
                  >
                      <Plus size={18} />
                  </button>
               </div>
               <div className="space-y-5">
                   {userContext.goals.map((goal) => {
                       const percent = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                       return (
                           <div key={goal.id} className="group cursor-pointer hover:bg-slate-50 -mx-2 p-2 rounded-xl transition-colors" onClick={() => onGoalClick(goal)}>
                               <div className="flex justify-between text-sm mb-1.5">
                                   <div className="flex items-center gap-1.5">
                                        <span className="font-bold text-slate-700">{goal.name}</span>
                                        {goal.smartContractAddress && <Lock size={10} className="text-green-500" />}
                                   </div>
                                   <span className="font-bold text-purple-600">{percent}%</span>
                               </div>
                               <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                   <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full transition-all duration-1000" style={{width: `${percent}%`}}></div>
                               </div>
                               <div className="flex justify-between mt-1 text-[10px] text-slate-400 font-medium">
                                   <span>₹{goal.currentAmount.toLocaleString()} saved</span>
                                   <span>Target: ₹{goal.targetAmount.toLocaleString()}</span>
                               </div>
                           </div>
                       )
                   })}
                   {userContext.goals.length === 0 && (
                       <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl cursor-pointer hover:border-purple-200 hover:bg-purple-50 hover:text-purple-600 transition-all" onClick={onAddGoalClick}>
                           + Add your first goal
                       </div>
                   )}
               </div>
          </div>

          {/* Categories Pie Chart - Enhanced */}
          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border border-slate-100 p-6 flex flex-col sm:flex-row gap-8 items-center">
              <div className="flex-1 w-full">
                  <h3 className="font-bold text-lg text-slate-800 mb-2">Spending Mix</h3>
                  <p className="text-sm text-slate-400 mb-6">Where your money went this month</p>
                  
                  <div className="grid grid-cols-2 gap-3">
                      {pieData.slice(0, 4).map((entry, index) => (
                          <div key={entry.name} className="flex items-center justify-between p-3 rounded-xl border border-slate-50 bg-slate-50/50">
                              <div className="flex items-center gap-2">
                                  <div className="w-2 h-8 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                                  <div>
                                      <p className="text-xs text-slate-500 font-bold uppercase">{entry.name}</p>
                                      <p className="text-sm font-bold text-slate-800">₹{entry.value.toLocaleString()}</p>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              </div>
              
              <div className="w-full sm:w-[240px] h-[240px] relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={4}
                            dataKey="value"
                            cornerRadius={6}
                        >
                            {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                            ))}
                        </Pie>
                        <Tooltip 
                           formatter={(value: number) => `₹${value.toLocaleString('en-IN')}`}
                           contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '8px' }}
                        />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                      <span className="text-3xl font-bold text-slate-800">{pieData.length}</span>
                      <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Categories</span>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};