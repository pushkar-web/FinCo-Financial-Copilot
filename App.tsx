import React, { useState } from 'react';
import { INITIAL_USER_DATA } from './constants';
import { UserContext, ViewState, Transaction, Goal } from './types';
import { Dashboard } from './components/Dashboard';
import { FinCoAnalysis } from './components/FinCoAnalysis';
import { SmartTransactionModal } from './components/SmartTransactionModal';
import { AddGoalModal } from './components/AddGoalModal';
import { SmartGoalModal } from './components/SmartGoalModal';
import { SendMoneyModal } from './components/SendMoneyModal';
import { VaultModal } from './components/VaultModal';
import { 
  LayoutDashboard, Sparkles, CreditCard, Menu, X, PlusCircle, LogOut, Settings, 
  Download, Trash2, Utensils, Car, ShoppingBag, Zap, Film, HeartPulse, Banknote, 
  ArrowRightLeft, MoreHorizontal, Search, Edit3, Link as LinkIcon, ShieldCheck, Coins,
  Crown, Send
} from 'lucide-react';

export const getCategoryIcon = (category: string) => {
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

const App: React.FC = () => {
  const [userContext, setUserContext] = useState<UserContext>(INITIAL_USER_DATA);
  const [view, setView] = useState<ViewState>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isSmartGoalModalOpen, setIsSmartGoalModalOpen] = useState(false);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [isVaultModalOpen, setIsVaultModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Level Logic
  const level = Math.floor(userContext.finTokens / 100) + 1;
  const progress = userContext.finTokens % 100;
  
  const getLevelTitle = (lvl: number) => {
      if (lvl >= 10) return "Crypto King";
      if (lvl >= 5) return "DeFi Degen";
      if (lvl >= 3) return "Smart Saver";
      return "Novice";
  }

  // Web3 Simulation
  const handleConnectWallet = async () => {
    if (userContext.walletAddress) {
        if(confirm("Disconnect wallet?")) {
            setUserContext(prev => ({ ...prev, walletAddress: null }));
        }
        return;
    }
    
    // Simulate connection delay
    const mockAddress = "0x71C7656EC7ab88b098defB751B7401B5f6d89A21";
    setUserContext(prev => ({ ...prev, walletAddress: mockAddress }));
  };

  const generateTxHash = () => {
      return "0x" + Array(64).fill(0).map(() => Math.floor(Math.random() * 16).toString(16)).join('');
  };

  // Handlers
  const handleAddTransaction = (tx: Partial<Transaction>) => {
    const newTx: Transaction = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      merchant: tx.merchant || 'Unknown',
      amount: tx.amount || 0,
      category: tx.category as any || 'Other',
      type: tx.type as any || 'debit',
      method: tx.method as any || 'UPI',
      // Simulate on-chain recording if wallet is connected
      txHash: userContext.walletAddress ? generateTxHash() : undefined,
      blockStatus: userContext.walletAddress ? 'verified' : undefined
    };

    // Award tokens for logging transactions
    const earnedTokens = 10;

    setUserContext(prev => ({
        ...prev,
        currentBalance: newTx.type === 'debit' 
            ? prev.currentBalance - newTx.amount 
            : prev.currentBalance + newTx.amount,
        transactions: [newTx, ...prev.transactions],
        finTokens: prev.finTokens + earnedTokens
    }));
  };

  const handleDeleteTransaction = (id: string) => {
    setUserContext(prev => {
        const tx = prev.transactions.find(t => t.id === id);
        if (!tx) return prev;
        
        return {
            ...prev,
            currentBalance: tx.type === 'debit' 
                ? prev.currentBalance + tx.amount 
                : prev.currentBalance - tx.amount,
            transactions: prev.transactions.filter(t => t.id !== id)
        };
    });
  };

  const handleMarkBillPaid = (id: string) => {
      setUserContext(prev => {
          const bill = prev.bills.find(b => b.id === id);
          if (!bill || bill.isPaid) return prev;

          // Deduct from balance
          const newBalance = prev.currentBalance - bill.amount;
          
          // Add a transaction record for this bill payment
          const newTx: Transaction = {
              id: Date.now().toString(),
              date: new Date().toISOString().split('T')[0],
              merchant: bill.name,
              amount: bill.amount,
              category: 'Bills',
              type: 'debit',
              method: 'UPI',
              txHash: userContext.walletAddress ? generateTxHash() : undefined,
              blockStatus: userContext.walletAddress ? 'verified' : undefined
          };

          // Award tokens for paying bills
          const earnedTokens = 50;

          return {
              ...prev,
              currentBalance: newBalance,
              bills: prev.bills.map(b => b.id === id ? { ...b, isPaid: true } : b),
              transactions: [newTx, ...prev.transactions],
              finTokens: prev.finTokens + earnedTokens
          };
      });
  };

  const handleAddGoal = (goal: Goal) => {
      setUserContext(prev => ({
          ...prev,
          goals: [...prev.goals, goal]
      }));
  };

  const handleStakeToGoal = (goalId: string, amount: number) => {
      setUserContext(prev => {
          // Deduct from balance
          const newBalance = prev.currentBalance - amount;
          
          // Add tx record
          const newTx: Transaction = {
              id: Date.now().toString(),
              date: new Date().toISOString().split('T')[0],
              merchant: 'Smart Contract Deposit',
              amount: amount,
              category: 'Transfer',
              type: 'debit',
              method: 'Crypto',
              txHash: generateTxHash(),
              blockStatus: 'verified'
          };

          // Award tokens for saving
          const earnedTokens = Math.floor(amount / 100); // 1 token per 100rs saved

          return {
              ...prev,
              currentBalance: newBalance,
              finTokens: prev.finTokens + earnedTokens,
              transactions: [newTx, ...prev.transactions],
              goals: prev.goals.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g)
          }
      });
  };

  const handleUpdateIncome = () => {
      const newIncome = prompt("Enter new monthly income:", userContext.monthlyIncome.toString());
      if (newIncome && !isNaN(parseFloat(newIncome))) {
          setUserContext(prev => ({
              ...prev,
              monthlyIncome: parseFloat(newIncome)
          }));
      }
  };

  const handleUpdateBudget = (category: string) => {
      const current = userContext.budgets[category] || 0;
      const newLimit = prompt(`Enter new monthly budget for ${category}:`, current.toString());
      if (newLimit && !isNaN(parseFloat(newLimit))) {
          setUserContext(prev => ({
              ...prev,
              budgets: {
                  ...prev.budgets,
                  [category]: parseFloat(newLimit)
              }
          }));
      }
  };

  const handleP2PTransfer = (recipient: string, amount: number) => {
      setUserContext(prev => {
          const newBalance = prev.currentBalance - amount;
          const newTx: Transaction = {
              id: Date.now().toString(),
              date: new Date().toISOString().split('T')[0],
              merchant: `Transfer to ${recipient}`,
              amount: amount,
              category: 'Transfer',
              type: 'debit',
              method: 'Crypto',
              txHash: generateTxHash(),
              blockStatus: 'verified'
          };

           // Award tokens
          const earnedTokens = 25;

          return {
              ...prev,
              currentBalance: newBalance,
              transactions: [newTx, ...prev.transactions],
              finTokens: prev.finTokens + earnedTokens
          };
      });
  };

  const handleVaultTransfer = (amount: number, type: 'deposit' | 'withdraw') => {
      setUserContext(prev => {
          let newWalletBalance = prev.currentBalance;
          let newVaultBalance = prev.vaultBalance;
          
          if (type === 'deposit') {
              newWalletBalance -= amount;
              newVaultBalance += amount;
          } else {
              newWalletBalance += amount;
              newVaultBalance -= amount;
          }

          // Mock Transaction Record
          const newTx: Transaction = {
              id: Date.now().toString(),
              date: new Date().toISOString().split('T')[0],
              merchant: type === 'deposit' ? 'FinVault Deposit' : 'FinVault Withdrawal',
              amount: amount,
              category: 'Transfer',
              type: type === 'deposit' ? 'debit' : 'credit',
              method: 'Crypto',
              txHash: generateTxHash(),
              blockStatus: 'verified'
          };

          return {
              ...prev,
              currentBalance: newWalletBalance,
              vaultBalance: newVaultBalance,
              transactions: [newTx, ...prev.transactions]
          };
      });
  };

  const handleExportCSV = () => {
    const headers = ['Date', 'Merchant', 'Category', 'Amount', 'Type', 'Method', 'TxHash'];
    const rows = userContext.transactions.map(t => [
        t.date, t.merchant, t.category, t.amount, t.type, t.method, t.txHash || ''
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
        + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "finco_transactions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const NavItem = ({ targetView, icon: Icon, label }: { targetView: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => {
        setView(targetView);
        setMobileMenuOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
        view === targetView 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1 font-semibold' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600 font-medium'
      }`}
    >
      <Icon size={20} className={`transition-colors ${view === targetView ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
      <span>{label}</span>
    </button>
  );

  const filteredTransactions = userContext.transactions.filter(t => 
    t.merchant.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <SmartTransactionModal 
        isOpen={isTxModalOpen} 
        onClose={() => setIsTxModalOpen(false)} 
        onAddTransaction={handleAddTransaction} 
      />
      <AddGoalModal 
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onAddGoal={handleAddGoal}
      />
      <SmartGoalModal
        goal={selectedGoal}
        isOpen={isSmartGoalModalOpen}
        onClose={() => setIsSmartGoalModalOpen(false)}
        onStake={handleStakeToGoal}
        currentBalance={userContext.currentBalance}
      />
      <SendMoneyModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSend={handleP2PTransfer}
        currentBalance={userContext.currentBalance}
      />
      <VaultModal
        isOpen={isVaultModalOpen}
        onClose={() => setIsVaultModalOpen(false)}
        onTransfer={handleVaultTransfer}
        walletBalance={userContext.currentBalance}
        vaultBalance={userContext.vaultBalance}
      />

      {/* Sidebar - Desktop (Floating Glass Style) */}
      <aside className="hidden md:flex flex-col w-72 p-4 fixed h-full z-20">
        <div className="bg-white/80 backdrop-blur-xl h-full rounded-3xl border border-slate-200/60 shadow-xl shadow-slate-200/40 p-6 flex flex-col">
            <div className="flex items-center gap-3 px-2 py-2 mb-8">
            <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shadow-blue-200">
                <Sparkles className="text-white" size={24} />
            </div>
            <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-none">FinCo</h1>
                <p className="text-[10px] text-blue-600 font-bold tracking-widest mt-1 uppercase">Intelligent Finance</p>
            </div>
            </div>

            {/* Level Badge */}
            <div className="mb-6 mx-2 bg-gradient-to-r from-slate-900 to-indigo-900 rounded-xl p-4 text-white relative overflow-hidden">
                <div className="flex items-center gap-2 mb-2 relative z-10">
                    <Crown size={16} className="text-yellow-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Level {level}</span>
                </div>
                <h3 className="font-bold text-lg mb-2 relative z-10">{getLevelTitle(level)}</h3>
                
                {/* Progress Bar */}
                <div className="w-full h-1.5 bg-white/20 rounded-full relative z-10">
                    <div className="h-full bg-yellow-400 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
                </div>
                <p className="text-[10px] text-indigo-200 mt-1.5 text-right relative z-10">{progress}/100 XP</p>
                
                {/* Decorative BG */}
                <div className="absolute -right-4 -bottom-4 opacity-10">
                    <Coins size={80} />
                </div>
            </div>
            
            <nav className="space-y-2 flex-1">
            <NavItem targetView="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem targetView="analysis" icon={Sparkles} label="FinCo AI Co-Pilot" />
            <NavItem targetView="transactions" icon={CreditCard} label="Transactions" />
            </nav>

            <div className="mt-auto space-y-4">
            
            {/* Wallet Connect Button */}
            <button 
                onClick={handleConnectWallet}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all shadow-sm active:scale-95 border ${
                    userContext.walletAddress 
                        ? 'bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100' 
                        : 'bg-slate-900 text-white border-transparent hover:bg-slate-800 shadow-slate-300'
                }`}
            >
                <LinkIcon size={16} />
                {userContext.walletAddress 
                    ? `${userContext.walletAddress.slice(0, 6)}...${userContext.walletAddress.slice(-4)}`
                    : 'Connect Wallet'
                }
            </button>

            <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 rounded-2xl border border-slate-200/60">
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-3">Quick Actions</p>
                <div className="space-y-2">
                    <button 
                        onClick={() => setIsTxModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-blue-600 hover:border-transparent hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-blue-200 active:scale-95"
                    >
                        <PlusCircle size={18}/>
                        Log Entry
                    </button>
                     <button 
                        onClick={() => setIsSendModalOpen(true)}
                        className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-3 rounded-xl text-sm font-bold hover:bg-indigo-600 hover:border-transparent hover:text-white transition-all shadow-sm hover:shadow-lg hover:shadow-indigo-200 active:scale-95"
                    >
                        <Send size={16}/>
                        Transfer
                    </button>
                </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3 px-2 opacity-60 hover:opacity-100 transition-opacity cursor-pointer group">
                <LogOut size={18} className="text-slate-400 group-hover:text-red-500 transition-colors"/>
                <span className="text-sm font-medium text-slate-500 group-hover:text-red-600 transition-colors">Sign Out</span>
            </div>
            </div>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-30 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
           <div className="bg-gradient-to-tr from-blue-600 to-indigo-600 p-1.5 rounded-lg">
            <Sparkles className="text-white" size={20} />
          </div>
          <span className="font-bold text-lg text-slate-900">FinCo</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-full">
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-white z-20 pt-20 px-4 space-y-2 animate-in slide-in-from-top-10 duration-200">
           <NavItem targetView="dashboard" icon={LayoutDashboard} label="Dashboard" />
           <NavItem targetView="analysis" icon={Sparkles} label="FinCo AI Co-Pilot" />
           <NavItem targetView="transactions" icon={CreditCard} label="Transactions" />
           <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                <button 
                    onClick={() => {
                        setIsTxModalOpen(true);
                        setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-xl font-bold shadow-xl shadow-slate-200 active:scale-95 transition-transform"
                >
                    <PlusCircle size={20} />
                    Log Transaction (AI)
                </button>
                <button 
                    onClick={() => {
                        setIsSendModalOpen(true);
                        setMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-4 rounded-xl font-bold shadow-xl shadow-blue-200 active:scale-95 transition-transform"
                >
                    <Send size={20} />
                    Send Money
                </button>
           </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 md:ml-80 pt-20 md:pt-0 p-4 md:p-6 transition-all">
        <header className="hidden md:flex justify-between items-center mb-8 pt-2">
            <div>
                 <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                    {view === 'dashboard' && 'Financial Overview'}
                    {view === 'analysis' && 'AI Co-Pilot'}
                    {view === 'transactions' && 'Transaction History'}
                </h2>
                <p className="text-sm text-slate-500 font-medium mt-1">
                    {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
            </div>
           
            <div className="flex items-center gap-4">
                 <button 
                    onClick={handleExportCSV}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 transition-colors shadow-sm"
                 >
                    <Download size={16} /> Export
                 </button>
                <div className="w-px h-8 bg-slate-200 mx-2"></div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <p className="text-sm font-bold text-slate-900">John Doe</p>
                        <p className="text-[10px] text-indigo-600 font-bold bg-indigo-50 inline-block px-2 py-0.5 rounded-full mt-0.5 tracking-wide border border-indigo-100">PREMIUM</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg shadow-blue-200 ring-2 ring-white">
                        JD
                    </div>
                </div>
            </div>
        </header>

        <div className="max-w-7xl mx-auto">
          {view === 'dashboard' && (
              <Dashboard 
                userContext={userContext} 
                onMarkBillPaid={handleMarkBillPaid}
                onAddGoalClick={() => setIsGoalModalOpen(true)}
                onUpdateIncome={handleUpdateIncome}
                onGoalClick={(goal) => {
                    setSelectedGoal(goal);
                    setIsSmartGoalModalOpen(true);
                }}
                onUpdateBudget={handleUpdateBudget}
                onOpenVault={() => setIsVaultModalOpen(true)}
              />
          )}
          {view === 'analysis' && <FinCoAnalysis userContext={userContext} />}
          {view === 'transactions' && (
             <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                
                {/* Search Bar */}
                <div className="flex gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search by merchant or category..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-800 text-white border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-slate-400"
                        />
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Transaction</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Category</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Date</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Method</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Action</th>
                                    <th className="p-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredTransactions.length > 0 ? filteredTransactions.map(t => (
                                    <tr key={t.id} className="hover:bg-blue-50/30 transition-colors group">
                                        <td className="p-5">
                                            <div className="font-semibold text-slate-900">{t.merchant}</div>
                                        </td>
                                        <td className="p-5">
                                            <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                                                <div className="p-1.5 bg-slate-100 rounded-md text-slate-500">
                                                    {getCategoryIcon(t.category)}
                                                </div>
                                                {t.category}
                                            </div>
                                        </td>
                                        <td className="p-5 text-sm text-slate-500">{t.date}</td>
                                        <td className="p-5">
                                            <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${t.method === 'UPI' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                                                {t.method}
                                            </span>
                                        </td>
                                        <td className={`p-5 text-sm font-bold text-right ${t.type === 'debit' ? 'text-slate-900' : 'text-green-600'}`}>
                                            {t.type === 'debit' ? '-' : '+'} ₹{t.amount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="p-5 text-center">
                                            <button 
                                                onClick={() => handleDeleteTransaction(t.id)}
                                                className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete Transaction"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </td>
                                        <td className="p-5 text-center">
                                            {t.blockStatus === 'verified' && (
                                                <div className="flex flex-col items-center">
                                                    <div className="text-purple-600 bg-purple-50 p-1.5 rounded-full" title={`Verified: ${t.txHash}`}>
                                                        <ShieldCheck size={16} />
                                                    </div>
                                                    <span className="text-[10px] font-mono text-slate-400 mt-1 max-w-[60px] truncate">{t.txHash}</span>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan={7} className="p-10 text-center text-slate-400">
                                            No transactions found matching "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;