
# FinCo - Financial Co-Pilot 🚀

FinCo is an intelligent, elite financial co-pilot designed for the modern UPI-first generation. It combines traditional expense tracking with advanced AI insights (powered by Google Gemini), gamification, and simulated Web3/DeFi features to make personal finance engaging and smarter.

> **🚀 Try out the Live MVP:** [https://finco-financial-co-pilot-1081348162412.us-west1.run.app](https://finco-financial-co-pilot-1081348162412.us-west1.run.app)

![FinCo Dashboard Screenshot](https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1000)

## ✨ Key Features

*   **🤖 AI Co-Pilot (Gemini 3.0 Pro):**
    *   Deep financial analysis of burn rate, liquidity, and spending habits.
    *   Conversational interface to ask specific questions about your finances.
    *   **Smart Entry:** Log transactions using natural language (voice or text).
*   **🏦 DeFi Vault System:**
    *   Simulated high-yield staking vault to separate spending money from savings.
    *   Visual separation of "Wallet" vs. "Vault" liquidity.
*   **🔗 Web3 & P2P Integration:**
    *   Simulated Wallet connection and blockchain transaction hashing.
    *   P2P Transfer module with gas fee estimation and network simulation.
    *   "Smart Contract" goals that lock funds for disciplined saving.
*   **📊 Interactive Dashboard:**
    *   Real-time cashflow trends using Recharts.
    *   Smart Budget tracking with visual health indicators.
    *   Subscription detection heuristic.
*   **🎮 Gamification:**
    *   Earn **FinTokens (FT)** for good financial behavior.
    *   Level up from "Novice" to "Crypto King".

## 🛠️ Tech Stack

*   **Framework:** [React](https://react.dev/) (v18) + [Vite](https://vitejs.dev/)
*   **Language:** [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **AI SDK:** [Google GenAI SDK](https://www.npmjs.com/package/@google/genai) (`gemini-3-pro-preview`)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Charts:** [Recharts](https://recharts.org/)

## 🚀 Local Development Setup

Follow these steps to run the project locally on your machine.

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd finco-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory and add your Google Gemini API Key.

```env
API_KEY=your_actual_gemini_api_key_here
```

> **Note:** You can get an API key from [Google AI Studio](https://aistudio.google.com/).

### 4. Run the App
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📦 Build for Production

To build the project for deployment:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

## ⚠️ Disclaimer

This application is a **Proof of Concept (MVP)**.
*   The "Blockchain", "Smart Contract", and "Wallet" connections are **simulated** for user experience demonstration purposes and do not interact with a real mainnet.
*   Financial data is stored in local React state (memory) and resets on refresh unless connected to a backend.

---

Built with ❤️ using **Gemini 3.0** & **React**.
