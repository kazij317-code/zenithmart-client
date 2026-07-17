"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { useApp } from "@/context/AppContext";
import { Sparkles, ArrowRight, ShieldCheck, Truck, Headphones, RotateCcw, Star, Percent, Heart } from "lucide-react";

interface Product {
  _id?: string;
  id?: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  price: number;
  rating: number;
  category: string;
  image: string;
}

export default function Home() {
  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/products?limit=4`);
        const data = await res.json();
        if (data.success) {
          setFeaturedProducts(data.products || []);
        }
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, [BASE_URL]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative w-full h-[65vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1600&q=80"
            alt="Hero Background"
            className="w-full h-full object-cover brightness-50 dark:brightness-[0.35] transition-all duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 backdrop-blur-md border border-brand/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
            <Sparkles size={14} className="text-gold" />
            AI-Powered Smart Shopping
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-6">
            Elevate Your Everyday with{" "}
            <span className="bg-gradient-to-r from-indigo-400 to-amber-300 text-transparent bg-clip-text">
              ZenithMart
            </span>
          </h1>
          <p className="text-base sm:text-xl text-gray-200 max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Discover a handpicked selection of premium electronics, fashion, and lifestyle items tailored perfectly for you by our smart AI.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/explore"
              className="px-8 py-3 rounded-xl bg-brand text-white font-bold hover:bg-brand-hover shadow-lg shadow-brand/25 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
            >
              Explore Shop <ArrowRight size={18} />
            </Link>
            <Link
              href="/about"
              className="px-8 py-3 rounded-xl bg-white/10 text-white font-bold hover:bg-white/20 backdrop-blur-sm border border-white/20 transition-all transform hover:-translate-y-0.5"
            >
              How It Works
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <main className="flex-1 space-y-24 py-16">
        
        {/* Section 1: Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">Curated Categories</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Find precisely what you need across our focus product lines.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Electronics", desc: "Next-gen gear", img: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=400&q=80" },
              { name: "Fashion", desc: "Minimalist styles", img: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=400&q=80" },
              { name: "Home & Living", desc: "Ergonomic spaces", img: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80" },
              { name: "Fitness & Outdoor", desc: "Healthy lifestyle", img: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=400&q=80" }
            ].map((cat, idx) => (
              <Link
                key={idx}
                href={`/explore?category=${encodeURIComponent(cat.name)}`}
                className="group relative h-48 rounded-2xl overflow-hidden glass-card shadow-md flex flex-col justify-end p-6 border border-white/10"
              >
                <div className="absolute inset-0 z-0">
                  <img
                    src={cat.img}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 brightness-[0.7] group-hover:brightness-[0.6]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
                </div>
                <div className="relative z-10 text-white">
                  <h3 className="font-bold text-lg">{cat.name}</h3>
                  <p className="text-xs text-gray-300 mt-1">{cat.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Section 2: Featured Products */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">Trending Innovations</h2>
              <p className="mt-2 text-gray-500 dark:text-gray-400">Our highest rated items, handpicked.</p>
            </div>
            <Link href="/explore" className="text-brand dark:text-gold font-semibold flex items-center gap-1 hover:underline">
              View All <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-96 rounded-2xl animate-shimmer" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((p) => {
                const pId = p._id || p.id || "";
                return (
                  <div key={pId} className="glass-card rounded-2xl overflow-hidden border border-card-border flex flex-col h-full">
                    <div className="relative h-56 w-full">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleFavorite(pId)}
                        className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-md shadow-md border border-white/20 transition-all ${
                          isFavorite(pId)
                            ? "bg-red-500 text-white"
                            : "bg-white/70 text-gray-800 hover:bg-white"
                        }`}
                      >
                        <Heart size={16} fill={isFavorite(pId) ? "white" : "none"} />
                      </button>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[10px] uppercase font-bold text-brand dark:text-gold tracking-wider mb-1.5">{p.category}</span>
                      <h3 className="font-bold text-base truncate mb-2">{p.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">{p.shortDescription}</p>
                      
                      <div className="mt-auto flex items-center justify-between">
                        <div>
                          <span className="text-sm font-semibold text-gray-400">Price</span>
                          <div className="text-lg font-bold">${p.price}</div>
                        </div>
                        <Link
                          href={`/products/${pId}`}
                          className="px-4 py-2 text-xs font-bold rounded-lg border border-brand/20 text-brand dark:text-gold dark:border-gold/20 hover:bg-brand/10 dark:hover:bg-gold/10 transition-all"
                        >
                          View Details
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Section 3: AI Highlights */}
        <section className="bg-indigo-900/5 dark:bg-slate-900/40 border-y border-brand/10 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-4">
                  <Sparkles size={14} className="text-gold" />
                  ZenithBot Assist
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight mb-6">
                  Intelligent Agentic Shopping At Your Service
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
                  No more endless scrolling. ZenithMart integrates Gemini models to automatically match your preferences. Talk directly to ZenithBot at the bottom corner to ask questions, review specifications, or get custom recommendations instantly.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand dark:text-gold flex-shrink-0">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Contextual Chat</h4>
                      <p className="text-xs text-gray-500 mt-1">Talk to AI about specs, compatibility, and sizing.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center text-brand dark:text-gold flex-shrink-0">
                      <Percent size={20} />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm">Smart Recommendations</h4>
                      <p className="text-xs text-gray-500 mt-1">Personalized matching based on cart & favorite items.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center">
                <img
                  src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80"
                  alt="AI Assistant Widget Mockup"
                  className="rounded-2xl shadow-xl max-w-full h-80 object-cover border border-white/10"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Section 4: Statistics */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "10K+", label: "Happy Customers" },
              { value: "500+", label: "Premium Products" },
              { value: "99.9%", label: "Satisfaction Rate" },
              { value: "24/7", label: "AI & Human Support" }
            ].map((stat, idx) => (
              <div key={idx} className="p-6 glass-card rounded-2xl border border-white/5">
                <div className="text-3xl sm:text-4xl font-extrabold text-brand dark:text-gold mb-2">{stat.value}</div>
                <div className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 font-semibold">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Services Features */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { icon: <Truck size={24} />, title: "Free Global Shipping", desc: "On all orders above $100" },
              { icon: <RotateCcw size={24} />, title: "30-Day Easy Returns", desc: "Hassle-free return policy" },
              { icon: <ShieldCheck size={24} />, title: "100% Secure Checkout", desc: "Encrypted payments & safety" },
              { icon: <Headphones size={24} />, title: "Dedicated Support", desc: "Get help from ZenithBot & support" }
            ].map((srv, idx) => (
              <div key={idx} className="flex gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-slate-900/30 border border-card-border">
                <div className="text-brand dark:text-gold flex-shrink-0">{srv.icon}</div>
                <div>
                  <h4 className="font-bold text-sm">{srv.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{srv.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 6: Testimonials */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight">What Our Shoppers Say</h2>
            <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
              Real opinions from real members of the Zenith community.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Sophia Reynolds", role: "Design Director", text: "ZenithMart is my absolute favorite store. The minimalist leather backpack is a masterpiece, and ZenithBot recommended headphones that fit my travel schedule perfectly!", rating: 5 },
              { name: "Marcus Chen", role: "Software Engineer", text: "The ergonomic office chair is incredibly comfortable, and setup was simple. The shopping experience was streamlined by the AI assistant chat which detailed the specs accurately.", rating: 5 },
              { name: "Emily Watson", role: "Yoga Instructor", text: "I bought the cork yoga mat. The laser alignment marks are super helpful. The secure cash on delivery payment went smoothly. Highly recommend ZenithMart!", rating: 4 }
            ].map((t, idx) => (
              <div key={idx} className="p-8 glass-card rounded-2xl border border-card-border flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 mb-4 text-gold">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm italic text-gray-600 dark:text-gray-300 leading-relaxed mb-6">"{t.text}"</p>
                </div>
                <div>
                  <div className="font-bold text-sm">{t.name}</div>
                  <div className="text-xs text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 7: Newsletter */}
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-brand/20 to-indigo-900/10 border border-brand/20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl" />
            <h2 className="text-3xl font-extrabold tracking-tight mb-4">Join the Zenith VIP Club</h2>
            <p className="text-gray-500 dark:text-gray-300 max-w-lg mx-auto mb-8 text-sm">
              Subscribe to get exclusive product drops, member-only discounts, and personalized shopping notifications from ZenithBot.
            </p>
            <form onSubmit={(e) => { e.preventDefault(); alert("Thanks for subscribing!"); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email address"
                required
                className="flex-1 glass-input px-4 py-2.5 rounded-xl text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="bg-brand hover:bg-brand-hover text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-md"
              >
                Subscribe
              </button>
            </form>
          </div>
        </section>

      </main>

      <Footer />
      <AIChatBot />
    </div>
  );
}
