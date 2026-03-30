import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Sparkles, MessageSquare, Trash2, Loader2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [
          {
            role: "user",
            parts: [{ text: userMessage }]
          }
        ],
        config: {
          systemInstruction: "You are a wise and compassionate spiritual assistant specializing in Jesus Christ, the Bible, and Catholic/Christian teachings. Your goal is to provide accurate, respectful, and encouraging answers based on scripture and tradition. If a question is unrelated to faith, Jesus, or the Bible, gently guide the user back to spiritual topics. Use a warm, welcoming tone.",
        }
      });

      const assistantMessage = response.text || "I'm sorry, I couldn't find an answer to that. May God guide you.";
      setMessages(prev => [...prev, { role: 'assistant', content: assistantMessage }]);
    } catch (error) {
      console.error('AI Error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: "I'm having trouble connecting to the divine wisdom right now. Please try again later." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-200px)] flex flex-col space-y-6">
      <section className="text-center space-y-2">
        <h2 className="text-3xl font-serif font-bold flex items-center justify-center gap-2">
          <Sparkles className="text-primary" /> Spiritual Guide AI
        </h2>
        <p className="text-foreground/60 italic">Ask anything about Jesus, the Bible, or your faith journey.</p>
      </section>

      <div className="flex-grow bg-white dark:bg-slate-800 rounded-3xl border border-border shadow-xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/30 dark:bg-slate-900/30">
          <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest">
            <Bot size={18} /> Sanctuary AI
          </div>
          <button 
            onClick={clearChat}
            className="p-2 hover:bg-red-500/10 text-foreground/40 hover:text-red-500 rounded-full transition-all"
            title="Clear Chat"
          >
            <Trash2 size={18} />
          </button>
        </div>

        {/* Messages Area */}
        <div 
          ref={scrollRef}
          className="flex-grow overflow-y-auto p-6 space-y-6 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
              <div className="p-6 bg-primary/10 rounded-full text-primary">
                <MessageSquare size={48} />
              </div>
              <div className="space-y-2">
                <p className="text-xl font-serif font-bold">How can I help you today?</p>
                <p className="text-sm max-w-xs mx-auto">Try asking: "Who was the Apostle Paul?" or "What does the Bible say about peace?"</p>
              </div>
            </div>
          )}

          <AnimatePresence>
            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === 'user' ? 'bg-primary text-white' : 'bg-secondary dark:bg-slate-700 text-primary'
                  }`}>
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-secondary/50 dark:bg-slate-700/50 text-foreground rounded-tl-none border border-border'
                  }`}>
                    <div className="markdown-body">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex gap-3 items-center text-foreground/40 text-sm italic">
                <div className="w-8 h-8 rounded-full bg-secondary dark:bg-slate-700 flex items-center justify-center">
                  <Bot size={16} />
                </div>
                <div className="flex items-center gap-2">
                  Seeking wisdom... <Loader2 size={14} className="animate-spin" />
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-border bg-secondary/10 dark:bg-slate-900/10">
          <div className="relative flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about the Bible, Jesus, or Faith..."
              className="w-full pl-4 pr-12 py-3 bg-white dark:bg-slate-800 rounded-2xl border border-border focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-2 p-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-30 transition-all shadow-lg shadow-primary/20"
            >
              <Send size={18} />
            </button>
          </div>
          <p className="text-[10px] text-center mt-2 text-foreground/30 uppercase tracking-widest font-bold">
            Sanctuary AI Assistant • Powered by Faith
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
