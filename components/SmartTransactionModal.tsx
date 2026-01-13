import React, { useState, useEffect } from 'react';
import { Sparkles, X, Check, ArrowRight, Loader2, Mic, MicOff } from 'lucide-react';
import { parseTransactionFromText } from '../services/geminiService';
import { Transaction } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddTransaction: (tx: Partial<Transaction>) => void;
}

export const SmartTransactionModal: React.FC<Props> = ({ isOpen, onClose, onAddTransaction }) => {
  const [input, setInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedData, setParsedData] = useState<Partial<Transaction> | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recog = new SpeechRecognition();
        recog.continuous = false;
        recog.interimResults = false;
        recog.lang = 'en-IN'; // Optimized for Indian accent

        recog.onstart = () => setIsListening(true);
        recog.onend = () => setIsListening(false);
        recog.onerror = (event: any) => {
          console.error("Speech Error", event.error);
          setIsListening(false);
          setError("Microphone access denied or error occurred.");
        };
        recog.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInput(prev => prev ? `${prev} ${transcript}` : transcript);
        };
        setRecognition(recog);
      }
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) {
      setError("Voice input is not supported in this browser.");
      return;
    }
    if (isListening) {
      recognition.stop();
    } else {
      setError(null);
      recognition.start();
    }
  };

  if (!isOpen) return null;

  const handleAnalyze = async () => {
    if (!input.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    setParsedData(null);

    try {
      const result = await parseTransactionFromText(input);
      if (result) {
        setParsedData(result);
      } else {
        setError("Could not understand that transaction. Try 'Paid 500 to Swiggy'");
      }
    } catch (e) {
      setError("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    if (parsedData) {
      onAddTransaction(parsedData);
      handleClose();
    }
  };

  const handleClose = () => {
    setInput('');
    setParsedData(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white relative">
          <button 
            onClick={handleClose}
            className="absolute right-4 top-4 text-white/70 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="bg-white/20 p-1.5 rounded-lg backdrop-blur-md">
                <Sparkles size={18} className="text-yellow-300" />
            </div>
            <span className="font-bold tracking-wide text-sm uppercase opacity-90">Smart Entry</span>
          </div>
          <h2 className="text-2xl font-bold">Log a Transaction</h2>
          <p className="text-blue-100 text-sm mt-1">Speak or type naturally. FinCo handles the rest.</p>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {!parsedData ? (
            <div className="space-y-4">
               <div className="relative">
                  <label className="block text-sm font-medium text-slate-700 mb-2">What happened?</label>
                  <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., 'Paid 450 for coffee' or tap mic..."
                    className="w-full p-4 pr-12 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-slate-400 min-h-[100px] resize-none text-base"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleAnalyze();
                        }
                    }}
                  />
                  <button 
                    onClick={toggleListening}
                    className={`absolute bottom-3 right-3 p-2 rounded-full transition-all shadow-sm ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-400 hover:text-white hover:bg-slate-600'}`}
                    title="Toggle Voice Input"
                  >
                    {isListening ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>
               </div>
               
               {error && (
                   <p className="text-red-500 text-sm flex items-center gap-1.5 bg-red-50 p-2.5 rounded-lg animate-in slide-in-from-top-1">
                       <X size={14} /> {error}
                   </p>
               )}

               <button
                  onClick={handleAnalyze}
                  disabled={!input.trim() || isAnalyzing}
                  className="w-full py-3.5 bg-slate-900 text-white rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze <ArrowRight size={18} />
                    </>
                  )}
                </button>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-8 duration-300">
               <div className="bg-slate-50 border border-slate-100 rounded-xl p-5 space-y-4">
                  <div className="flex justify-between items-start">
                      <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Merchant</p>
                          <h3 className="text-xl font-bold text-slate-900">{parsedData.merchant}</h3>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-bold border ${parsedData.type === 'debit' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                          {parsedData.type === 'debit' ? '-' : '+'} ₹{parsedData.amount}
                      </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Category</p>
                          <p className="text-slate-700 font-medium flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                              {parsedData.category}
                          </p>
                      </div>
                      <div>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Method</p>
                          <p className="text-slate-700 font-medium">{parsedData.method}</p>
                      </div>
                  </div>
               </div>

               <div className="flex gap-3">
                   <button
                      onClick={() => setParsedData(null)}
                      className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                    >
                      Edit
                    </button>
                   <button
                      onClick={handleConfirm}
                      className="flex-[2] py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Check size={18} /> Confirm Entry
                    </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};