"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Heart, Search, Filter, SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "next/navigation";

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

const getProductLocation = (pId: string) => {
  const locations = [
    "Dhaka, Bangladesh",
    "Silicon Valley, CA",
    "New York, USA",
    "London, UK",
    "Tokyo, Japan",
    "Paris, France",
    "Sydney, Australia",
    "Berlin, Germany"
  ];
  if (!pId) return locations[0];
  let hash = 0;
  for (let i = 0; i < pId.length; i++) {
    hash = pId.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % locations.length;
  return locations[index];
};

function ExploreContent() {
  const searchParams = useSearchParams();
  const { toggleFavorite, isFavorite } = useApp();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters & State
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    const queryCategory = searchParams.get("category");
    if (queryCategory) {
      setCategory(queryCategory);
    } else {
      setCategory("");
    }
  }, [searchParams]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("rating");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

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
        setTotalProducts(data.pagination.total || 0);
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

            {/* Total Results Label */}
            {!loading && products.length > 0 && (
              <div className="text-xs text-indigo-500 font-semibold px-1 py-1">
                Showing {products.length} of {totalProducts} properties found.
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((p) => {
                  const pId = p._id || p.id || "";
                  return (
                    <div key={pId} className="bg-[#ffffff] dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-sm hover:shadow-md transition-shadow">
                      <div className="relative h-48 w-full">
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover rounded-t-3xl" />
                        <button
                          onClick={() => toggleFavorite(pId)}
                          className={`absolute top-4 right-4 p-2 rounded-xl shadow-sm backdrop-blur-sm transition-all duration-300 hover:scale-105 ${
                            isFavorite(pId)
                              ? "bg-[#180A18]/90 border border-transparent"
                              : "bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800"
                          }`}
                        >
                          <Heart
                            size={14}
                            className={`transition-all duration-300 ${
                              isFavorite(pId)
                                ? "fill-[#FF2D55] text-[#FF2D55]"
                                : "text-slate-400 dark:text-gray-500"
                            }`}
                          />
                        </button>
                      </div>
                      <div className="p-5 flex flex-col flex-1">
                        <span className="text-[9px] uppercase font-bold text-[#4F46E5] dark:text-gold tracking-widest mb-1.5">{p.category}</span>
                        <h3 className="font-extrabold text-sm text-gray-900 dark:text-[#ffffff] truncate mb-1">{p.title}</h3>
                        
                        {/* Meta Info: Location, Rating, Date */}
                        <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-slate-500 font-semibold mb-3">
                          <span className="truncate max-w-[100px]">📍 {getProductLocation(pId)}</span>
                          <span className="flex items-center gap-0.5 text-amber-500">⭐ {p.rating.toFixed(2)}</span>
                        </div>

                        <p className="text-xs text-gray-500 dark:text-slate-400 line-clamp-2 mb-4 leading-relaxed">{p.shortDescription}</p>
                        
                        <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-850">
                          <div>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Price</span>
                            <div className="text-base font-black text-gray-900 dark:text-[#ffffff] mt-0.5">${p.price}</div>
                          </div>
                          <Link
                            href={`/products/${pId}`}
                            className="px-4 py-2 bg-[#ffffff] dark:bg-slate-900 border border-indigo-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-[#4F46E5] dark:text-gold rounded-xl text-xs font-bold transition-all"
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

export default function Explore() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <ExploreContent />
    </React.Suspense>
  );
}
