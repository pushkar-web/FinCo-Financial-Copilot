import React, { useState, useEffect, useRef } from 'react';
import { UserContext } from '../types';
import { generateFinCoAnalysis, chatWithFinCo } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { 
  Sparkles, RefreshCw, AlertCircle, ArrowRight, Bot, Cpu, 
  TrendingUp, PiggyBank, Target, Lightbulb, AlertTriangle, 
  MessageSquare, Send, User, Trash2, Zap, ChevronRight
} from 'lucide-react';
import remarkGfm from 'remark-gfm';

interface Props {
  userContext: UserContext;
}

const LOADING_MESSAGES = [
  "Connecting to FinCo Brain...",
  "Categorizing expenses...",
  "Analyzing UPI velocity...",
  "Calculating monthly burn rate...",
  "Forecasting end-of-month cashflow...",
  "Identifying potential money leaks...",
  "Formulating wealth strategy...",
  "Finalizing report..."
];

const SUGGESTED_QUESTIONS = [
  "How can I save ₹5,000 this month?",
  "Analyze my food delivery spending.",
  "Will I hit my Bali Trip goal?",
  "Am I spending too much on weekends?",
];

export const FinCoAnalysis: React.FC<Props> = ({ userContext }) => {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Chat State
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'model', content: string}[]>([]);
  const [input, setInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 1500);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    if (chatHistory.length > 0 || chatLoading) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, chatLoading]);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setChatHistory([]); // Clear chat on new analysis
    try {
      const result = await generateFinCoAnalysis(userContext);
      setAnalysis(result);
    } catch (e) {
      setError("Failed to generate analysis.");
    } finally {
      setLoading(false);
    }
  };

  const handleSendChat = async (messageOverride?: string) => {
    const userMsg = messageOverride || input.trim();
    if (!userMsg || !analysis) return;
    
    setInput('');
    
    // Optimistic update
    const newHistory = [...chatHistory, { role: 'user' as const, content: userMsg }];
    setChatHistory(newHistory);
    setChatLoading(true);

    // Build context: Initial Report + Chat History
    const contextHistory = [
        { role: 'model' as const, content: analysis },
        ...newHistory
    ];

    try {
        const response = await chatWithFinCo(contextHistory, userContext, userMsg);
        setChatHistory(prev => [...prev, { role: 'model' as const, content: response }]);
    } catch (e) {
        console.error(e);
        // Optionally handle chat error state here
    } finally {
        setChatLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Hero / Header Section */}
      <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl shadow-blue-900/20 relative overflow-hidden min-h-[300px] flex flex-col justify-center transition-all duration-500">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-10 -translate-y-10">
          <Sparkles size={250} />
        </div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500 rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

        <div className="relative z-10">
            {!loading && !analysis && (
              <>
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-blue-200 text-xs font-bold uppercase tracking-wider mb-6 border border-white/10">
                    <Bot size={14} />
                    Powered by Gemini 3.0 Pro
                </div>
                
                <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
                  <span className="bg-gradient-to-r from-yellow-200 to-yellow-500 bg-clip-text text-transparent">Advanced Financial</span><br/>
                  Health Check
                </h2>
                
                <p className="text-blue-100 mb-10 text-lg md:text-xl max-w-2xl leading-relaxed opacity-90 font-light">
                  Unlock elite insights. We analyze your <strong>UPI velocity</strong>, <strong>Spending Habits</strong>, and <strong>Cashflow Forecasts</strong> to build a personalized wealth strategy.
                </p>
                
                <button
                  onClick={handleGenerate}
                  className="group px-8 py-4 rounded-xl font-bold text-base transition-all shadow-xl flex items-center gap-3 bg-white text-blue-900 hover:bg-blue-50 active:scale-95 hover:shadow-2xl hover:shadow-white/10"
                >
                    Run Deep Analysis
                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center py-10 space-y-6">
                <div className="relative">
                  <div className="w-16 h-16 border-4 border-blue-400/30 border-t-yellow-400 rounded-full animate-spin"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Cpu size={24} className="text-white animate-pulse" />
                  </div>
                </div>
                <p className="text-xl font-medium text-blue-100 animate-pulse text-center">
                  {LOADING_MESSAGES[loadingMessageIndex]}
                </p>
              </div>
            )}

            {!loading && analysis && (
               <div className="animate-in slide-in-from-bottom-4 fade-in duration-500">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Sparkles className="text-yellow-400" size={24}/>
                            Analysis Complete
                        </h3>
                        <p className="text-blue-200 mt-1">Review your report and ask FinCo for details below.</p>
                    </div>
                    <button 
                      onClick={handleGenerate} 
                      className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors flex items-center gap-2 w-fit"
                    >
                      <RefreshCw size={14}/> Regenerate Report
                    </button>
                  </div>
               </div>
            )}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2 shadow-sm">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {analysis && (
        <div className="grid grid-cols-1 gap-8 animate-in slide-in-from-bottom-8 duration-700">
          
          {/* Main Analysis Report */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-8 md:p-12 relative overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
            <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                    h1: ({node, ...props}) => <h1 className="text-3xl font-extrabold text-slate-900 mb-6 mt-2 pb-4 border-b border-slate-100" {...props} />,
                    h2: ({node, ...props}) => (
                        <h2 className="text-xl md:text-2xl font-bold text-slate-800 mt-10 mb-5 flex items-center gap-3" {...props}>
                           <span className="w-1.5 h-6 bg-blue-500 rounded-full inline-block"></span>
                           {props.children}
                        </h2>
                    ),
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-slate-700 mt-8 mb-3" {...props} />,
                    p: ({node, ...props}) => <p className="text-slate-600 leading-relaxed mb-4 text-base" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-bold text-slate-900 bg-yellow-100/50 px-0.5 rounded" {...props} />,
                    ul: ({node, ...props}) => <ul className="space-y-2 mb-6 list-disc list-outside ml-5 text-slate-600" {...props} />,
                    ol: ({node, ...props}) => <ol className="space-y-3 mb-6 list-decimal list-outside ml-5 marker:text-blue-600 font-semibold text-slate-800" {...props} />,
                    li: ({node, ...props}) => <li className="pl-1 text-slate-600 font-normal" {...props} />,
                    blockquote: ({node, ...props}) => (
                      <div className="flex gap-4 p-5 my-6 bg-blue-50 rounded-xl border-l-4 border-blue-500">
                         <div className="text-blue-500 pt-1"><Lightbulb size={20} /></div>
                         <div className="text-slate-700 italic" {...props} />
                      </div>
                    ),
                    table: ({node, ...props}) => (
                      <div className="overflow-x-auto rounded-xl border border-slate-200 my-6">
                        <table className="w-full text-sm text-left" {...props} />
                      </div>
                    ),
                    thead: ({node, ...props}) => <thead className="bg-slate-50 border-b border-slate-200" {...props} />,
                    th: ({node, ...props}) => <th className="px-6 py-3 font-semibold text-slate-700 uppercase tracking-wider text-xs" {...props} />,
                    tbody: ({node, ...props}) => <tbody className="bg-white divide-y divide-slate-100" {...props} />,
                    tr: ({node, ...props}) => <tr className="hover:bg-slate-50/50" {...props} />,
                    td: ({node, ...props}) => <td className="px-6 py-3 text-slate-600 whitespace-nowrap" {...props} />,
                }}
            >
                {analysis}
            </ReactMarkdown>
          </div>

          {/* Advanced Chat Interface */}
          <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col h-[600px] relative">
              
              {/* Chat Header */}
              <div className="bg-white/80 backdrop-blur-md p-4 border-b border-slate-100 flex justify-between items-center absolute top-0 w-full z-10">
                   <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                             <Bot size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-slate-800 flex items-center gap-1.5">
                                FinCo Assistant
                                <span className="flex h-2 w-2 relative">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                            </h3>
                            <p className="text-xs text-slate-500 font-medium">Ask follow-up questions</p>
                        </div>
                   </div>
                   <button 
                        onClick={() => setChatHistory([])}
                        disabled={chatHistory.length === 0}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                        title="Clear Chat History"
                   >
                        <Trash2 size={18} />
                   </button>
              </div>
              
              {/* Chat Messages Area */}
              <div className="flex-1 p-6 pt-24 pb-4 overflow-y-auto bg-slate-50 space-y-6 scroll-smooth">
                  {chatHistory.length === 0 ? (
                      <div className="h-full flex flex-col items-center justify-center text-center opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100 fill-mode-forwards">
                          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Sparkles className="text-blue-600" size={32} />
                          </div>
                          <h4 className="text-lg font-bold text-slate-800 mb-2">How can I help you digest this report?</h4>
                          <p className="text-slate-500 max-w-xs mb-8">Tap a suggested question below or type your own.</p>
                          
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                                {SUGGESTED_QUESTIONS.map((q, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => handleSendChat(q)}
                                        className="flex items-center justify-between p-3.5 bg-white border border-slate-200 rounded-xl text-left text-sm text-slate-600 hover:border-blue-300 hover:text-blue-600 hover:shadow-md transition-all group"
                                    >
                                        {q}
                                        <ChevronRight size={16} className="text-slate-300 group-hover:text-blue-500" />
                                    </button>
                                ))}
                          </div>
                      </div>
                  ) : (
                      <>
                        {chatHistory.map((msg, idx) => (
                            <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                                {msg.role === 'model' && (
                                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 mt-1 border border-indigo-200">
                                        <Bot size={16} />
                                    </div>
                                )}
                                <div className={`
                                    max-w-[85%] sm:max-w-[75%] rounded-2xl px-5 py-3.5 text-sm leading-relaxed shadow-sm
                                    ${msg.role === 'user' 
                                        ? 'bg-gradient-to-tr from-blue-600 to-blue-700 text-white rounded-tr-sm' 
                                        : 'bg-white border border-slate-200 text-slate-700 rounded-tl-sm'
                                    }
                                `}>
                                    {msg.role === 'user' ? (
                                        msg.content
                                    ) : (
                                        <ReactMarkdown 
                                            remarkPlugins={[remarkGfm]}
                                            components={{
                                                p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                                                strong: ({node, ...props}) => <span className="font-bold text-slate-900" {...props} />,
                                                ul: ({node, ...props}) => <ul className="list-disc list-inside space-y-1 mb-2 bg-slate-50 p-2 rounded-lg" {...props} />,
                                                ol: ({node, ...props}) => <ol className="list-decimal list-inside space-y-1 mb-2" {...props} />,
                                                li: ({node, ...props}) => <li className="text-slate-700" {...props} />,
                                                table: ({node, ...props}) => <div className="overflow-x-auto my-2 border rounded"><table className="w-full text-xs" {...props} /></div>,
                                                th: ({node, ...props}) => <th className="px-2 py-1 bg-slate-50 font-semibold" {...props} />,
                                                td: ({node, ...props}) => <td className="px-2 py-1 border-t border-slate-100" {...props} />,
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    )}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500 mt-1 border border-slate-300">
                                        <User size={16} />
                                    </div>
                                )}
                            </div>
                        ))}
                      </>
                  )}

                  {chatLoading && (
                       <div className="flex gap-4 justify-start animate-in fade-in duration-300">
                          <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0 text-indigo-600 mt-1 border border-indigo-200">
                                <Bot size={16} />
                          </div>
                          <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm flex items-center gap-1.5 h-10">
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                                <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                          </div>
                       </div>
                  )}
                  <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white border-t border-slate-100">
                  {/* Quick Chips (if chat has messages but is idle) */}
                  {!chatLoading && chatHistory.length > 0 && (
                      <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
                          {SUGGESTED_QUESTIONS.slice(0, 3).map((q, i) => (
                              <button 
                                key={i}
                                onClick={() => handleSendChat(q)}
                                className="whitespace-nowrap px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-medium rounded-full border border-slate-200 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors flex items-center gap-1 flex-shrink-0"
                              >
                                <Zap size={12} className="text-yellow-500"/> {q}
                              </button>
                          ))}
                      </div>
                  )}

                  <div className="relative flex items-center gap-2">
                      <input 
                          type="text" 
                          value={input}
                          onChange={(e) => setInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendChat()}
                          placeholder="Ask FinCo anything..."
                          className="flex-1 pl-4 pr-12 py-3.5 rounded-xl bg-slate-800 text-white border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder-slate-400"
                          disabled={chatLoading}
                      />
                      <button 
                          onClick={() => handleSendChat()}
                          disabled={!input.trim() || chatLoading}
                          className="absolute right-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-all shadow-md shadow-blue-200 active:scale-90"
                      >
                          <Send size={18} />
                      </button>
                  </div>
              </div>
          </div>
        </div>
      )}
    </div>
  );
};