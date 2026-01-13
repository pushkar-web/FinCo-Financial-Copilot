export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  category: 'Food' | 'Transport' | 'Shopping' | 'Bills' | 'Entertainment' | 'Health' | 'Salary' | 'Transfer' | 'Other';
  type: 'debit' | 'credit';
  method: 'UPI' | 'Card' | 'Bank Transfer' | 'Crypto';
  txHash?: string; // Blockchain Transaction Hash
  blockStatus?: 'pending' | 'verified';
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isPaid: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  smartContractAddress?: string; // Web3 integration
  apy?: number; // DeFi integration
}

export interface UserContext {
  monthlyIncome: number;
  currentBalance: number;
  vaultBalance: number; // New: High Yield Vault Balance
  transactions: Transaction[];
  bills: Bill[];
  goals: Goal[];
  walletAddress?: string | null;
  finTokens: number; // Gamification/Rewards
  budgets: Record<string, number>; // Category Limits
}

export interface FinCoResponse {
  text: string;
  sections?: {
    title: string;
    content: string;
  }[];
}

export type ViewState = 'dashboard' | 'analysis' | 'transactions';