"use client";

import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { Sparkles, Truck, RefreshCw } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Section 1: Brand Philosophy */}
        <section className="text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={14} className="text-gold" />
            Our Vision
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">About ZenithMart</h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
            ZenithMart is a premium e-commerce platform designed to bring curated lifestyle products directly to you, backed by intelligent AI recommendation tools. We believe shopping should be personal, high-quality, and effortless.
          </p>
        </section>

        {/* Section 2: Store Policies (Shipping, Returns) */}
        <section id="shipping" className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-card-border">
          <div className="p-6 glass-panel rounded-2xl border border-card-border">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="text-brand dark:text-gold" size={24} />
              <h3 className="font-bold text-base">Shipping & Delivery Policy</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              We offer free standard shipping globally on all orders above $100. Standard shipping takes 3-5 business days. Express shipping options are available at checkout. Tracking links are provided as soon as packages ship.
            </p>
          </div>

          <div className="p-6 glass-panel rounded-2xl border border-card-border">
            <div className="flex items-center gap-3 mb-4">
              <RefreshCw className="text-brand dark:text-gold" size={24} />
              <h3 className="font-bold text-base">Returns & Refund Policy</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Not completely satisfied? We offer a 30-day money-back guarantee. Simply contact our support team or use ZenithBot to initiate a return. Items must be returned in their original packaging and unused.
            </p>
          </div>
        </section>

      </main>

      <Footer />
      <AIChatBot />
    </div>
  );
}
