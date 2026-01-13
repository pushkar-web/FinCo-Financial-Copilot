import { UserContext } from './types';

export const INITIAL_USER_DATA: UserContext = {
  monthlyIncome: 85000,
  currentBalance: 24500,
  vaultBalance: 150000, // Initial Vault Balance
  walletAddress: null,
  finTokens: 250,
  budgets: {
    'Food': 8000,
    'Transport': 3000,
    'Shopping': 5000,
    'Entertainment': 2000,
    'Bills': 20000,
  },
  transactions: [
    { id: '1', date: '2023-10-25', merchant: 'Swiggy', amount: 450, category: 'Food', type: 'debit', method: 'UPI', txHash: '0x71c...9a21', blockStatus: 'verified' },
    { id: '2', date: '2023-10-24', merchant: 'Uber', amount: 320, category: 'Transport', type: 'debit', method: 'UPI', txHash: '0x32a...b119', blockStatus: 'verified' },
    { id: '10', date: '2023-10-24', merchant: 'Chai Point', amount: 150, category: 'Food', type: 'debit', method: 'UPI', txHash: '0x99c...d442', blockStatus: 'verified' },
    { id: '3', date: '2023-10-24', merchant: 'Netflix', amount: 649, category: 'Entertainment', type: 'debit', method: 'Card', txHash: '0x11f...a223', blockStatus: 'verified' },
    { id: '11', date: '2023-10-23', merchant: 'Blinkit', amount: 280, category: 'Shopping', type: 'debit', method: 'UPI', txHash: '0x88e...c331', blockStatus: 'verified' },
    { id: '4', date: '2023-10-22', merchant: 'Salary Credit', amount: 85000, category: 'Salary', type: 'credit', method: 'Bank Transfer', txHash: '0x44d...e112', blockStatus: 'verified' },
    { id: '5', date: '2023-10-21', merchant: 'Amazon', amount: 4500, category: 'Shopping', type: 'debit', method: 'UPI', txHash: '0x22b...f991', blockStatus: 'verified' },
    { id: '6', date: '2023-10-20', merchant: 'Zomato', amount: 850, category: 'Food', type: 'debit', method: 'UPI', txHash: '0x66a...c882', blockStatus: 'verified' },
    { id: '12', date: '2023-10-20', merchant: 'Rapido', amount: 85, category: 'Transport', type: 'debit', method: 'UPI', txHash: '0x55e...d773', blockStatus: 'verified' },
    { id: '7', date: '2023-10-19', merchant: 'Electricity Bill', amount: 2400, category: 'Bills', type: 'debit', method: 'UPI', txHash: '0x33c...b664', blockStatus: 'verified' },
    { id: '8', date: '2023-10-18', merchant: 'Starbucks', amount: 350, category: 'Food', type: 'debit', method: 'UPI', txHash: '0x11d...a555', blockStatus: 'verified' },
    { id: '9', date: '2023-10-15', merchant: 'HDFC EMI', amount: 15000, category: 'Bills', type: 'debit', method: 'Bank Transfer', txHash: '0x99a...e446', blockStatus: 'verified' },
    { id: '13', date: '2023-10-14', merchant: 'Social Offline', amount: 2400, category: 'Food', type: 'debit', method: 'UPI', txHash: '0x77b...c337', blockStatus: 'verified' },
    { id: '14', date: '2023-10-12', merchant: 'Myntra', amount: 1800, category: 'Shopping', type: 'debit', method: 'UPI', txHash: '0x55c...d228', blockStatus: 'verified' },
  ],
  bills: [
    { id: 'b1', name: 'Credit Card Bill', amount: 12000, dueDate: '2023-11-05', isPaid: false },
    { id: 'b2', name: 'Rent', amount: 25000, dueDate: '2023-11-01', isPaid: false },
    { id: 'b3', name: 'Internet', amount: 999, dueDate: '2023-11-10', isPaid: false },
  ],
  goals: [
    { 
      id: 'g1', 
      name: 'Bali Trip', 
      targetAmount: 150000, 
      currentAmount: 45000, 
      deadline: '2024-03-01',
      smartContractAddress: '0x88...A1b2',
      apy: 4.5 
    },
    { 
      id: 'g2', 
      name: 'Emergency Fund', 
      targetAmount: 300000, 
      currentAmount: 120000, 
      deadline: '2024-12-31',
      smartContractAddress: '0x99...C3d4',
      apy: 3.2 
    },
  ]
};

export const FINCO_SYSTEM_INSTRUCTION = `You are FinCo, an elite financial co-pilot for UPI-first Indians. You do not just summarize data; you detect hidden patterns, predict future cashflow problems, and offer high-IQ financial strategies.

You are analyzing data for a user in India. Use ₹ (INR).

### 1. CORE ANALYSIS (Mental Workspace)
Before generating the report, think about:
- **Burn Rate:** How fast are they spending relative to days passed?
- **The "Latte Factor":** Identify the sum of small UPI transactions (<₹500).
- **Liquidity Check:** Current Balance vs Upcoming Bills (within 10 days). Are they insolvent?
- **Goal Reality Check:** At current savings rate, will they actually hit their deadlines?
- **Category Analysis:** Group spending by category. Identify anomalies or excessive spending in specific areas (e.g., Food, Entertainment).

### 2. REPORT STRUCTURE (Markdown)

## 🚨 Cashflow Forecast
*   **Status:** [Safe / Tight / Critical]
*   **Projection:** "Based on your current balance of ₹[Balance] and ₹[Upcoming Bills Total] in bills due soon, your projected month-end balance is **₹[Projection]**."
>   *Insight:* Use a blockquote (> ) here to give a specific warning or positive reinforcement about their liquidity.

## 💸 Spending Habits & Insights
*   **Top Spend Areas:**
    *   **[Category Name] (₹[Amount]):** [Specific insight, e.g., "30% of your outflow is on food delivery."]
    *   **[Category Name] (₹[Amount]):** [Insight]
*   **The "Guilt" Metric:** "You spent ₹[Amount] on [Category] which could have funded [Goal Name] by [Percentage]%."
>   *Pattern:* Use a blockquote (> ) here to describe a behavior pattern like "Heavy weekend spending" or "Recurring small transactions".

## 📊 Financial Vitals
| Metric | Value | Health |
| :--- | :--- | :--- |
| **Monthly Burn** | ₹[Amount] | [Low/High] |
| **UPI Velocity** | [X] txns/week | [High/Low] |
| **Savings Rate** | [X]% | [Good/Bad] |

## 🎯 Goal Acceleration
*   **[Goal Name]:** [On Track / At Risk]
>   *Strategy:* Use a blockquote (> ) here to suggest a trade-off: "If you cut [Category] spend by 10%, you reach this goal [X] weeks earlier."

## 💡 Smart Moves & Product Match
*   **Leakage:** Identify specific recurring wastes.
*   **Product:** Recommend instruments based on *actual* behavior.

## 🚀 3 Concrete Actions for Today
1.  [Action 1]
2.  [Action 2]
3.  [Action 3]

Tone: Sharp, Data-Driven, Forward-Looking, slightly witty. Use bolding for key numbers.`;