"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Heart, Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";

interface Product {
  _id?: string;
  id?: string;
  title: string;
  shortDescription: string;
  price: number;
  rating: number;
  category: string;
  image: string;
}

export default function Explore() {
  const { toggleFavorite, isFavorite } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  const categories = ["Electronics", "Fashion", "Home & Living", "Fitness & Outdoor"];

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (minPrice) params.append("minPrice", minPrice);
      if (maxPrice) params.append("maxPrice", maxPrice);
      if (sortBy) params.append("sortBy", sortBy);
      params.append("page", page.toString());
      params.append("limit", "8");

      const res = await fetch(`${BASE_URL}/api/products?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products || []);
        setTotalPages(data.pagination.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching explore products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, sortBy, page]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchProducts();
  };

  const handleClearFilters = () => {
    setSearch("");
    setCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("rating");
    setPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-extrabold tracking-tight mb-8">Explore Catalog</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Side Filter Bar */}
          <div className="lg:col-span-1 p-6 glass-panel rounded-2xl h-fit border border-card-border">
            <div className="flex items-center justify-between mb-6">
              <span className="font-bold flex items-center gap-2 text-sm uppercase tracking-wide">
                <Filter size={16} /> Filters
              </span>
              <button
                onClick={handleClearFilters}
                className="text-xs text-brand dark:text-gold hover:underline font-semibold"
              >
                Clear All
              </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3">Categories</h3>
              <div className="space-y-2">
                <button
                  onClick={() => { setCategory(""); setPage(1); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                    category === ""
                      ? "bg-brand/10 text-brand dark:text-gold font-bold"
                      : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"
                  }`}
                >
                  All Products
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                      category === cat
                        ? "bg-brand/10 text-brand dark:text-gold font-bold"
                        : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-500"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3">Price Range ($)</h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="w-full glass-input px-3 py-2 rounded-xl text-xs"
                />
              </div>
              <button
                onClick={() => { setPage(1); fetchProducts(); }}
                className="w-full mt-3 py-2 rounded-xl bg-brand text-white text-xs font-bold hover:bg-brand-hover transition-colors"
              >
                Apply Range
              </button>
            </div>
          </div>

          {/* Catalog Listing Area */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-gray-50 dark:bg-slate-900/30 p-4 rounded-2xl border border-card-border">
              <form onSubmit={handleSearchSubmit} className="relative w-full sm:max-w-xs">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full glass-input pl-10 pr-4 py-2 rounded-xl text-xs"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
              </form>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <SlidersHorizontal size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-200 border-none focus:outline-none"
                >
                  <option value="rating" className="bg-white dark:bg-slate-900">Highest Rated</option>
                  <option value="price_asc" className="bg-white dark:bg-slate-900">Price: Low to High</option>
                  <option value="price_desc" className="bg-white dark:bg-slate-900">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="h-96 rounded-2xl animate-shimmer" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 dark:bg-slate-900/10 rounded-2xl border border-dashed border-card-border">
                <p className="text-gray-500">No products found matching filters.</p>
                <button
                  onClick={handleClearFilters}
                  className="mt-4 px-4 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-hover transition-colors"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((p) => {
                  const pId = p._id || p.id || "";
                  return (
                    <div key={pId} className="glass-card rounded-2xl overflow-hidden border border-card-border flex flex-col h-full">
                      <div className="relative h-52 w-full">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                        <button
                          onClick={() => toggleFavorite(pId)}
                          className="absolute top-4 right-4 p-2 rounded-xl bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 shadow-md backdrop-blur-sm transition-all hover:scale-105"
                        >
                          <Heart size={16} className={isFavorite(pId) ? "fill-rose-500 text-rose-500" : "text-slate-400 dark:text-gray-500"} />
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-[10px] uppercase font-bold text-brand dark:text-gold tracking-wider mb-1">{p.category}</span>
                        <h3 className="font-bold text-sm truncate mb-2">{p.title}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">{p.shortDescription}</p>
                        
                        <div className="mt-auto flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-semibold text-gray-400 uppercase">Price</span>
                            <div className="text-base font-bold">${p.price}</div>
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

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 pt-6">
                <button
                  onClick={() => setPage((p) => Math.max(p - 1, 1))}
                  disabled={page === 1}
                  className="p-2 rounded-xl border border-card-border hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                  disabled={page === totalPages}
                  className="p-2 rounded-xl border border-card-border hover:bg-gray-100 dark:hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
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
