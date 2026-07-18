"use client";

import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, Send, Sparkles, User, Bot } from "lucide-react";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

export default function AIChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", text: "Hi! I am ZenithBot, your smart shopping assistant. Ask me anything about our products, store policies, or type one of the suggestions below!" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  const suggestions = [
    "Show me some cool electronics",
    "Do you have leather bags?",
    "Tell me about shipping options",
    "Recommend a product for yoga"
  ];

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMessage: ChatMessage = { role: "user", text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      // Map current messages history for server context
      const historyContext = messages.map(m => ({
        role: m.role,
        text: m.text
      }));

      const res = await fetch(`${BASE_URL}/api/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: textToSend,
          history: historyContext
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessages(prev => [...prev, { role: "assistant", text: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", text: "Sorry, I am facing connectivity issues." }]);
      }
    } catch (error) {
      console.error("AI Chat error:", error);
      setMessages(prev => [...prev, { role: "assistant", text: "Network error. Please make sure the server is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[350px] sm:w-[400px] h-[500px] rounded-2xl shadow-2xl glass-panel border border-brand/20 flex flex-col mb-4 overflow-hidden animate-in fade-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand to-indigo-700 p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <Sparkles className="text-gold" size={20} />
              <div>
                <h3 className="font-bold text-sm">ZenithMart AI Assistant</h3>
                <span className="text-[10px] opacity-80">Powered by Gemini</span>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-1.5 rounded-full transition-colors">
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-brand/10 dark:bg-gold/10 flex items-center justify-center text-brand dark:text-gold flex-shrink-0">
                    <Bot size={16} />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                    m.role === "user"
                      ? "bg-brand text-white rounded-tr-none"
                      : "bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-100 rounded-tl-none border border-gray-200 dark:border-slate-700"
                  }`}
                >
                  {m.text}
                </div>
                {m.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-slate-700 flex items-center justify-center text-indigo-600 dark:text-indigo-300 flex-shrink-0">
                    <User size={16} />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-8 h-8 rounded-full bg-brand/10 dark:bg-gold/10 flex items-center justify-center text-brand dark:text-gold flex-shrink-0">
                  <Bot size={16} />
                </div>
                <div className="bg-gray-100 dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                  <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                  <span className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && !isTyping && (
            <div className="px-4 py-2 flex flex-wrap gap-2 border-t border-gray-100 dark:border-slate-800/50 bg-gray-50/50 dark:bg-slate-900/20">
              {suggestions.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(s)}
                  className="text-xs bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-gray-600 dark:text-gray-300 px-2.5 py-1.5 rounded-full hover:border-brand dark:hover:border-gold hover:text-brand dark:hover:text-gold transition-colors text-left"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-gray-200 dark:border-slate-800 flex gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask ZenithBot something..."
              className="flex-1 glass-input px-3.5 py-2 rounded-xl text-sm focus:outline-none"
            />
            <button
              type="submit"
              className="bg-brand hover:bg-brand-hover text-white p-2.5 rounded-xl transition-all shadow-md flex items-center justify-center"
            >
              <Send size={16} />
            </button>
          </form>
        </div>
      )}

      {/* Launcher Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-gradient-to-r from-brand to-indigo-600 hover:from-brand-hover hover:to-indigo-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 flex items-center justify-center gap-2 border border-white/20"
      >
        <Sparkles size={20} className="text-gold animate-pulse" />
        <span className="font-bold text-sm pr-1">ZenithBot</span>
      </button>
    </div>
  );
}
