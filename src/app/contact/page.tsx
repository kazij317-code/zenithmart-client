"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { Mail, Phone, MapPin, Send, MessageSquare } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";

export default function Contact() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => {
      alert("Your message has been sent successfully. We'll get back to you soon!");
      if (!user) {
        setName("");
        setEmail("");
      }
      setMessage("");
      setSending(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight">Contact Us</h1>
          <p className="mt-4 text-gray-500 max-w-md mx-auto">
            Got questions? We'd love to hear from you. Leave a message below or chat with ZenithBot.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Info Details */}
          <div className="md:col-span-1 space-y-6">
            <div className="p-6 glass-panel rounded-2xl border border-card-border flex gap-4 items-start">
              <MapPin className="text-brand dark:text-gold flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm">Headquarters</h4>
                <p className="text-xs text-gray-500 mt-1">100 Innovation Way, Silicon Valley, CA</p>
              </div>
            </div>

            <div className="p-6 glass-panel rounded-2xl border border-card-border flex gap-4 items-start">
              <Phone className="text-brand dark:text-gold flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm">Phone Support</h4>
                <p className="text-xs text-gray-500 mt-1">+1 (800) 555-0199</p>
              </div>
            </div>

            <div className="p-6 glass-panel rounded-2xl border border-card-border flex gap-4 items-start">
              <Mail className="text-brand dark:text-gold flex-shrink-0" size={24} />
              <div>
                <h4 className="font-bold text-sm">Email Support</h4>
                <p className="text-xs text-gray-500 mt-1">support@zenithmart.com</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-2 p-8 glass-panel rounded-2xl border border-card-border">
            <h3 className="font-bold text-base mb-6 flex items-center gap-2">
              <MessageSquare size={18} className="text-brand dark:text-gold" /> Leave a Message
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Your Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here..."
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-sm focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full h-11 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {sending ? "Sending..." : <><Send size={16} /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <AIChatBot />
    </div>
  );
}
