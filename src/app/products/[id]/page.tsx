"use client";

import React, { use, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { useApp } from "@/context/AppContext";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Sparkles, ShieldCheck, Check } from "lucide-react";

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
  images?: string[];
  stock: number;
  specifications: Record<string, string>;
}

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        // Fetch main product details
        const res = await fetch(`${BASE_URL}/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
          setActiveImage(data.product.image);

          // Fetch AI Recommendations based on this product's category
          const recRes = await fetch(
            `${BASE_URL}/api/ai/recommendations?category=${encodeURIComponent(
              data.product.category
            )}&productId=${data.product._id || data.product.id}`
          );
          const recData = await recRes.json();
          if (recData.success) {
            setRecommendations(recData.recommendations || []);
          }
        }
      } catch (err) {
        console.error("Error loading product details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, BASE_URL]);

  const handleAddToCart = () => {
    if (product) {
      const pId = product._id || product.id || "";
      addToCart(pId, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex justify-center items-center">
          <div className="w-12 h-12 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-grow max-w-md mx-auto flex flex-col justify-center items-center text-center p-8">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="text-gray-500 mb-6">The item you are looking for does not exist or has been removed.</p>
          <Link href="/explore" className="px-6 py-2.5 bg-brand text-white font-bold rounded-xl hover:bg-brand-hover transition-colors">
            Back to Catalog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const pId = product._id || product.id || "";
  const allImages = product.images && product.images.length > 0 ? [product.image, ...product.images] : [product.image];

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Product Core Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Image Gallery */}
          <div className="space-y-4">
            <div className="h-[400px] w-full rounded-2xl overflow-hidden glass-panel border border-card-border">
              <img src={activeImage} alt={product.title} className="w-full h-full object-cover transition-all" />
            </div>
            {allImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto py-2">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      activeImage === img ? "border-brand dark:border-gold scale-95" : "border-transparent opacity-75 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Pricing and CTA */}
          <div className="flex flex-col">
            <span className="text-xs uppercase font-bold text-brand dark:text-gold tracking-wider mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">{product.title}</h1>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    fill={i < Math.floor(product.rating || 5) ? "currentColor" : "none"}
                    className="text-gold"
                  />
                ))}
              </div>
              <span className="text-xs font-bold text-gray-500">({product.rating || 5.0})</span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
              {product.shortDescription}
            </p>

            <div className="text-3xl font-extrabold text-brand dark:text-gold mb-8">
              ${product.price}
            </div>

            <div className="border-t border-b border-card-border py-6 mb-8 space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Stock Availability:</span>
                <span className={`font-semibold ${product.stock > 0 ? "text-green-500" : "text-red-500"}`}>
                  {product.stock > 0 ? `${product.stock} items left` : "Out of Stock"}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Standard Delivery:</span>
                <span className="font-semibold text-gray-700 dark:text-gray-200">Free (above $100)</span>
              </div>
            </div>

            {/* Quantity Selector & CTAs */}
            {product.stock > 0 && (
              <div className="flex flex-wrap gap-4 items-center mb-6">
                <div className="flex items-center border border-card-border rounded-xl px-2">
                  <button
                    onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                    className="p-2 hover:text-brand font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))}
                    className="p-2 hover:text-brand font-bold"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={added}
                  className="flex-1 min-w-[200px] h-12 flex items-center justify-center gap-2 rounded-xl bg-brand text-white font-bold hover:bg-brand-hover shadow-lg shadow-brand/20 transition-all disabled:bg-green-600"
                >
                  {added ? (
                    <>
                      <Check size={18} /> Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} /> Add to Cart
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleFavorite(pId)}
                  className="p-3 rounded-xl border border-card-border hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <Heart size={20} className={isFavorite(pId) ? "fill-rose-500 text-rose-500" : "text-gray-400"} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Description & Specifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-card-border pt-12 mb-16">
          <div className="lg:col-span-2 space-y-6">
            <h2 className="text-xl font-bold">Product Description</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {product.fullDescription}
            </p>
          </div>

          <div className="p-6 glass-panel rounded-2xl h-fit border border-card-border">
            <h2 className="text-base font-bold mb-4">Technical Details</h2>
            <div className="space-y-3">
              {product.specifications && Object.keys(product.specifications).length > 0 ? (
                Object.entries(product.specifications).map(([key, val]) => (
                  <div key={key} className="flex justify-between border-b border-card-border pb-2 text-xs">
                    <span className="text-gray-400 font-semibold">{key}</span>
                    <span className="font-bold text-gray-700 dark:text-gray-200">{val}</span>
                  </div>
                ))
              ) : (
                <div className="text-xs text-gray-500">Standard specifications apply.</div>
              )}
            </div>
          </div>
        </div>

        {/* AI Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="border-t border-card-border pt-12 mb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand/10 text-brand dark:text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-6">
              <Sparkles size={14} className="text-gold" />
              AI Recommendations
            </div>
            <h2 className="text-2xl font-extrabold mb-8">Customers Also Looked At</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((p) => {
                const recId = p._id || p.id || "";
                return (
                  <div key={recId} className="glass-card rounded-2xl overflow-hidden border border-card-border flex flex-col h-full">
                    <div className="relative h-44 w-full">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                      <h3 className="font-bold text-xs truncate mb-2">{p.title}</h3>
                      <p className="text-[10px] text-gray-400 dark:text-gray-500 mb-4 line-clamp-2 leading-relaxed">
                        {p.shortDescription}
                      </p>
                      <div className="mt-auto flex justify-between items-center">
                        <div className="font-bold text-sm">${p.price}</div>
                        <Link
                          href={`/products/${recId}`}
                          className="px-3 py-1.5 text-[10px] font-bold rounded-lg border border-brand/20 text-brand dark:text-gold hover:bg-brand/10 transition-all"
                        >
                          View Info
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <AIChatBot />
    </div>
  );
}
