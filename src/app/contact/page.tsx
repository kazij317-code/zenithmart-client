"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function Contact() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim()) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSending(true);
    const loadingToast = toast.loading("Sending inquiry...");
    try {
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message })
      });
      const data = await res.json();
      toast.dismiss(loadingToast);
      if (data.success) {
        setSubmitted(true);
        setSubject("");
        setMessage("");
        toast.success("Inquiry sent successfully!");
      } else {
        toast.error(data.error || "Failed to send inquiry.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error("An error occurred. Please try again.");
    } finally {
      setSending(false);
    }
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

          {/* Form / Success Card */}
          <div className="md:col-span-2">
            {submitted ? (
              <div className="p-8 glass-panel rounded-2xl border border-card-border flex flex-col items-center justify-center text-center h-full min-h-[350px]">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-6">
                  <CheckCircle size={36} />
                </div>
                <h3 className="text-xl font-extrabold mb-3 text-slate-800 dark:text-white">Inquiry Received</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed mb-8">
                  Thank you for connecting. A dedicated luxury concierge has been assigned to your query and will reach out to you within 2 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-3 bg-[#d4af37] hover:bg-[#b08f26] text-white font-bold rounded-xl text-xs transition-colors shadow-md shadow-amber-500/10 cursor-pointer"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <div className="p-8 glass-panel rounded-2xl border border-card-border">
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
                    <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="What is this inquiry about?"
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
            )}
          </div>
        </div>
      </main>

      <Footer />
      <AIChatBot />
    </div>
  );
}
