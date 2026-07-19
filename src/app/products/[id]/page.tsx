"use client";

import React, { use, useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { Heart, ShoppingCart, Star, Sparkles, ShieldCheck, Check, Send, CheckCircle } from "lucide-react";
import { toast } from "react-hot-toast";

interface Review {
  name: string;
  rating: number;
  comment: string;
  createdAt?: string;
}

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
  reviews?: Review[];
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

export default function ProductDetails({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const { addToCart, toggleFavorite, isFavorite } = useApp();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [recommendations, setRecommendations] = useState<Product[]>([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user && user.name) {
      setReviewName(user.name);
    }
  }, [user]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to leave a rating and review");
      return;
    }
    if (!reviewName || !reviewComment) {
      toast.error("Please fill in all fields.");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await fetch(`${BASE_URL}/api/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: reviewName,
          rating: reviewRating,
          comment: reviewComment
        })
      });
      const data = await res.json();
      if (data.success) {
        setProduct((prev) => {
          if (!prev) return null;
          const updatedReviews = prev.reviews ? [...prev.reviews, data.review] : [data.review];
          return {
            ...prev,
            reviews: updatedReviews
          };
        });
        setReviewName(user?.name || "");
        setReviewComment("");
        setReviewRating(5);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 6000);
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while posting your review.");
    } finally {
      setSubmittingReview(false);
    }
  };

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
                  className={`p-3 rounded-xl transition-all duration-300 ${
                    isFavorite(pId)
                      ? "bg-[#180A18] border border-transparent"
                      : "bg-[#F0F4F8] border border-[#3A4D62] hover:bg-[#E2E8F0] dark:bg-slate-900 dark:border-slate-700 dark:hover:bg-slate-800"
                  }`}
                >
                  <Heart
                    size={20}
                    className={`transition-all duration-300 ${
                      isFavorite(pId)
                        ? "fill-[#FF2D55] text-[#FF2D55] scale-110"
                        : "text-[#3A4D62] dark:text-gray-400"
                    }`}
                  />
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

        {/* Reviews Section */}
        <div className="border-t border-card-border pt-12 mb-16 space-y-8">
          <div className="flex items-center gap-2">
            <Star className="text-amber-500 fill-amber-500" size={24} />
            <h2 className="text-xl font-bold">Reviews ({product.reviews?.length || 0})</h2>
          </div>

          {/* List of Reviews */}
          <div className="space-y-4">
            {!product.reviews || product.reviews.length === 0 ? (
              <p className="text-gray-500 text-center py-6 text-sm">
                No reviews yet. Be the first to share your experience!
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.reviews.map((rev, index) => (
                  <div key={index} className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900/30 border border-card-border space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{rev.name}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className={i < rev.rating ? "text-amber-500 fill-amber-500" : "text-gray-300 dark:text-gray-700"}
                            />
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : "Recently"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed pt-2">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Post a Review Card */}
          <div className="p-6 glass-panel rounded-3xl border border-card-border space-y-6 max-w-2xl">
            <div>
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">Post an Experience Review</h3>
              <p className="text-[10px] text-gray-400 font-medium">Share your feedback about this product with the community</p>
            </div>

            {showSuccess && (
              <div className="flex items-center gap-2 px-4 py-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-semibold">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0" />
                <span>Your experience review has been recorded! Thank you.</span>
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={reviewName}
                    onChange={(e) => setReviewName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Rating Score</label>
                  <select
                    value={reviewRating}
                    onChange={(e) => setReviewRating(Number(e.target.value))}
                    className="w-full bg-transparent border border-card-border rounded-xl text-xs p-2.5 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    <option value={5} className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">5 Stars (Exceptional)</option>
                    <option value={4} className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">4 Stars (Good)</option>
                    <option value={3} className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">3 Stars (Average)</option>
                    <option value={2} className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">2 Stars (Poor)</option>
                    <option value={1} className="bg-white dark:bg-slate-900 text-gray-800 dark:text-gray-200">1 Star (Terrible)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Review Comment</label>
                <textarea
                  required
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share details of your stay..."
                  className="w-full glass-input px-3.5 py-2.5 rounded-xl text-xs min-h-[80px]"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-amber-500/10 flex items-center gap-2 cursor-pointer"
              >
                <Send size={14} /> {submittingReview ? "Posting..." : "Post Review"}
              </button>
            </form>
          </div>
        </div>

        {/* AI Recommendations Section */}
        {recommendations.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 pt-12 mb-8">
            <span className="text-[10px] uppercase font-bold text-amber-500 tracking-widest block mb-1">
              RECOMMENDATIONS
            </span>
            <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white">Related Products</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map((p) => {
                const recId = p._id || p.id || "";
                return (
                  <div key={recId} className="bg-[#ffffff] dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 flex flex-col h-full shadow-sm">
                    <div className="relative h-44 w-full">
                      <img src={p.image} alt={p.title} className="w-full h-full object-cover rounded-t-3xl" />
                      <span className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-amber-500 dark:text-gold text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {p.category}
                      </span>
                    </div>
                    <div className="p-5 flex flex-col flex-grow">
                      {/* Meta Location & Rating */}
                      <div className="flex justify-between items-center text-[10px] text-gray-400 dark:text-slate-500 font-semibold mb-3">
                        <span>📍 {getProductLocation(recId)}</span>
                        <span className="bg-amber-500/10 text-amber-600 dark:text-gold font-bold px-2 py-0.5 rounded flex items-center gap-0.5">
                          ⭐ {p.rating.toFixed(2)}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-sm text-gray-900 dark:text-[#ffffff] truncate mb-2">{p.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                        {p.shortDescription}
                      </p>
                      
                      <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-850">
                        <div className="font-black text-amber-500 dark:text-gold text-base">
                          ${p.price} <span className="text-[10px] font-medium text-gray-400">/ unit</span>
                        </div>
                        <Link
                          href={`/products/${recId}`}
                          className="px-3.5 py-1.5 text-[10px] font-bold rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-[#ffffff] transition-all flex items-center gap-1 border border-transparent"
                        >
                          Details &rarr;
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
