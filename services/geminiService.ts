import { GoogleGenAI, Type, Schema } from "@google/genai";
import { UserContext, Transaction } from "../types";
import { FINCO_SYSTEM_INSTRUCTION } from "../constants";

// Initialize Gemini
// Note: In a real production app, ensure API_KEY is strictly handled on the backend or via secure proxy if possible.
// For this demo, we assume process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateFinCoAnalysis = async (userContext: UserContext): Promise<string> => {
  const prompt = `
    Perform a deep financial analysis on this user.
    
    1. Calculate their "Burn Rate" (daily spend).
    2. Analyze their "UPI Velocity" (frequency of small <₹500 transactions).
    3. Analyze spending habits by category: calculate totals, identify the top 2-3 spending categories, and find actionable areas for savings.
    4. Project their month-end balance considering upcoming bills.
    5. Suggest specific trade-offs to hit their '${userContext.goals[0]?.name}' or '${userContext.goals[1]?.name}' goals faster.
    
    INPUT DATA:

    USER_GOALS:
    ${JSON.stringify(userContext.goals, null, 2)}

    RECENT_TRANSACTIONS:
    ${JSON.stringify(userContext.transactions, null, 2)}

    CURRENT_BALANCES:
    Current Balance: ₹${userContext.currentBalance}

    MONTHLY_INCOME:
    ₹${userContext.monthlyIncome}

    UPCOMING_BILLS:
    ${JSON.stringify(userContext.bills, null, 2)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        systemInstruction: FINCO_SYSTEM_INSTRUCTION,
        // High thinking budget for deep financial analysis
        thinkingConfig: { thinkingBudget: 32768 }, 
      },
    });

    return response.text || "I couldn't generate an analysis at this time. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Sorry, I encountered an error while analyzing your finances. Please check your API key and try again.";
  }
};

export const chatWithFinCo = async (history: {role: 'user'|'model', content: string}[], userContext: UserContext, message: string): Promise<string> => {
  try {
    // We inject context into the system instruction
    const contextString = `
      CURRENT CONTEXT:
      Balance: ₹${userContext.currentBalance}
      Next Bill: ${userContext.bills.find(b => !b.isPaid)?.name || 'None'}
      User Name: John
      
      If the user asks about general financial info (rates, news, stocks), use your search tool.
    `;
    
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: FINCO_SYSTEM_INSTRUCTION + "\n" + contextString,
        thinkingConfig: { thinkingBudget: 16384 },
        tools: [{ googleSearch: {} }]
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.content }]
      }))
    });

    const result = await chat.sendMessage({ message });
    
    let responseText = result.text || "I didn't catch that.";

    // Append Grounding Sources if available
    const groundingChunks = result.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (groundingChunks && groundingChunks.length > 0) {
      const sources = groundingChunks
        .map((chunk: any) => chunk.web ? `[${chunk.web.title}](${chunk.web.uri})` : null)
        .filter(Boolean);
      
      if (sources.length > 0) {
        responseText += `\n\n**Sources:**\n${sources.map((s: string) => `* ${s}`).join('\n')}`;
      }
    }

    return responseText;

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I'm having trouble connecting right now. Please check your connection.";
  }
}

export const parseTransactionFromText = async (text: string): Promise<Partial<Transaction> | null> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Parse the following transaction description into structured JSON data. Current Year is 2023. Input text: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING, description: "Name of the merchant or person paid" },
            amount: { type: Type.NUMBER, description: "Amount in INR" },
            category: { 
              type: Type.STRING, 
              enum: ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Salary', 'Transfer', 'Other'],
              description: "The most appropriate category"
            },
            type: { type: Type.STRING, enum: ['debit', 'credit'] },
            method: { type: Type.STRING, enum: ['UPI', 'Card', 'Bank Transfer'], description: "Default to UPI if not specified" }
          },
          required: ["merchant", "amount", "category", "type", "method"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    return null;
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return null;
  }
};