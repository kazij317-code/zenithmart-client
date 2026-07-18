"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { ShoppingCart, Heart, Package, Trash2, MapPin, CreditCard, CheckCircle, User, LogOut, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-hot-toast";

interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id?: string;
  items: OrderItem[];
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

function UserDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const { cart, favorites, addToCart, removeFromCart, clearCart, toggleFavorite, checkout } = useApp();

  const [activeTab, setActiveTab] = useState("cart");
  const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");
  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);

  // Update Profile states
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateName, setUpdateName] = useState("");
  const [updateImage, setUpdateImage] = useState("");
  const [updating, setUpdating] = useState(false);
  const { updateProfile } = useAuth();

  useEffect(() => {
    if (user) {
      setUpdateName(user.name || "");
      setUpdateImage(user.image || "");
    }
  }, [user]);

  const handleUpdateProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!updateName.trim()) {
      toast.error("Full name is required.");
      return;
    }
    setUpdating(true);
    const loadingToast = toast.loading("Updating profile...");
    try {
      const res = await updateProfile(updateName, updateImage || undefined);
      toast.dismiss(loadingToast);
      if (res.success) {
        setIsUpdateModalOpen(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(res.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.dismiss(loadingToast);
      toast.error("An error occurred while updating profile.");
    } finally {
      setUpdating(false);
    }
  };

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  // Handle URL tabs (e.g. ?tab=favorites)
  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab) setActiveTab(tab);
  }, [searchParams]);

  // Load Order History
  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      const token = localStorage.getItem("better-auth.session_token") || "";
      try {
        const res = await fetch(`${BASE_URL}/api/orders`, {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setOrderHistory(data.orders || []);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };
    fetchOrders();
  }, [user, orderSuccess, BASE_URL]);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shippingAddress.trim()) {
      alert("Please provide a shipping address.");
      return;
    }
    setCheckingOut(true);
    try {
      const ok = await checkout(shippingAddress, paymentMethod);
      if (ok) {
        setOrderSuccess(true);
        setShippingAddress("");
        setActiveTab("orders");
        setTimeout(() => setOrderSuccess(false), 5000);
      } else {
        alert("Failed to place order.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCheckingOut(false);
    }
  };

  const totalAmount = cart.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="text-center">
          <p>Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-64 glass-panel rounded-2xl p-6 h-fit border border-card-border space-y-2">
            <div className="text-center pb-6 border-b border-card-border mb-4">
              <div className="w-16 h-16 rounded-full bg-brand/20 dark:bg-gold/20 flex items-center justify-center text-brand dark:text-gold mx-auto mb-3 font-bold text-xl">
                {user.image ? <img src={user.image} alt={user.name} className="w-16 h-16 rounded-full object-cover" /> : user.name[0]}
              </div>
              <h2 className="font-bold text-sm">{user.name}</h2>
              <span className="text-[10px] text-gray-500">{user.email}</span>
            </div>

            <button
              onClick={() => setActiveTab("cart")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "cart"
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <ShoppingCart size={16} /> Cart ({cart.length})
            </button>

            <button
              onClick={() => setActiveTab("favorites")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "favorites"
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Heart size={16} /> Favorites ({favorites.length})
            </button>

            <button
              onClick={() => setActiveTab("orders")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "orders"
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Package size={16} /> Order History
            </button>

            <button
              onClick={() => setActiveTab("profile")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "profile"
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <User size={16} /> My Profile
            </button>

            <div className="pt-4 border-t border-card-border mt-4">
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 glass-panel rounded-2xl p-6 sm:p-8 border border-card-border min-h-[450px]">
            
            {/* CART TAB */}
            {activeTab === "cart" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-card-border">
                  <h2 className="text-xl font-bold">Shopping Cart</h2>
                  {cart.length > 0 && (
                    <button onClick={clearCart} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                      <Trash2 size={14} /> Clear Cart
                    </button>
                  )}
                </div>

                {cart.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <p className="mb-4">Your cart is empty.</p>
                    <button onClick={() => router.push("/explore")} className="px-5 py-2 bg-brand text-white text-xs font-bold rounded-lg hover:bg-brand-hover">
                      Continue Shopping
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items List */}
                    <div className="lg:col-span-2 space-y-4">
                      {cart.map((item) => {
                        const prod = item.product;
                        if (!prod) return null;
                        const prodId = prod._id || prod.id || "";
                        return (
                          <div key={prodId} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-900/30 border border-card-border items-center">
                            <img src={prod.image} alt={prod.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-bold text-xs truncate">{prod.title}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5">${prod.price} each</p>
                              <div className="flex items-center gap-2 mt-2">
                                <button
                                  onClick={() => addToCart(prodId, item.quantity - 1)}
                                  className="px-2 py-0.5 bg-gray-200 dark:bg-slate-800 rounded text-xs font-bold"
                                >
                                  -
                                </button>
                                <span className="text-xs font-semibold">{item.quantity}</span>
                                <button
                                  onClick={() => addToCart(prodId, item.quantity + 1)}
                                  className="px-2 py-0.5 bg-gray-200 dark:bg-slate-800 rounded text-xs font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                            <button onClick={() => removeFromCart(prodId)} className="text-red-500 hover:text-red-600 p-2">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Order Summary & Checkout Form */}
                    <div className="p-6 rounded-xl bg-gray-50 dark:bg-slate-900/20 border border-card-border h-fit">
                      <h3 className="font-bold text-sm mb-4">Summary</h3>
                      <div className="space-y-2 pb-4 border-b border-card-border mb-4 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Subtotal:</span>
                          <span className="font-bold">${totalAmount}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Shipping:</span>
                          <span className="font-bold text-green-500">Free</span>
                        </div>
                      </div>
                      <div className="flex justify-between font-bold text-sm mb-6">
                        <span>Total:</span>
                        <span>${totalAmount}</span>
                      </div>

                      <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Shipping Address</label>
                          <div className="relative">
                            <input
                              type="text"
                              required
                              value={shippingAddress}
                              onChange={(e) => setShippingAddress(e.target.value)}
                              placeholder="123 Shopping St, NY"
                              className="w-full glass-input pl-9 pr-3 py-2 rounded-lg text-xs"
                            />
                            <MapPin size={14} className="absolute left-3 top-3 text-gray-400" />
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 block mb-1">Payment Method</label>
                          <div className="relative">
                            <select
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              className="w-full bg-transparent border border-card-border rounded-lg text-xs p-2 focus:outline-none"
                            >
                              <option value="Cash on Delivery" className="bg-white dark:bg-slate-900">Cash on Delivery</option>
                              <option value="Card (Simulated)" className="bg-white dark:bg-slate-900">Credit Card (Simulated)</option>
                            </select>
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={checkingOut}
                          className="w-full py-2.5 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-md transition-colors"
                        >
                          {checkingOut ? "Placing Order..." : "Proceed to Checkout"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* FAVORITES TAB */}
            {activeTab === "favorites" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b border-card-border">My Favorites</h2>

                {favorites.length === 0 ? (
                  <p className="text-gray-500 text-center py-16 text-xs">No favorite items added yet.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {favorites.map((p) => {
                      const pId = p._id || p.id || "";
                      return (
                        <div key={pId} className="flex gap-4 p-4 rounded-xl bg-gray-50 dark:bg-slate-900/30 border border-card-border items-center">
                          <img src={p.image} alt={p.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-xs truncate">{p.title}</h4>
                            <p className="text-[10px] text-gray-400 mt-0.5">${p.price}</p>
                            <button
                              onClick={() => addToCart(pId, 1)}
                              className="mt-2 px-3 py-1 bg-brand text-white text-[10px] font-bold rounded hover:bg-brand-hover transition-colors flex items-center gap-1"
                            >
                              <ShoppingCart size={10} /> Add to Cart
                            </button>
                          </div>
                          <button onClick={() => toggleFavorite(pId)} className="text-red-500 p-2">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ORDER HISTORY TAB */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b border-card-border flex items-center justify-between">
                  <span>Order History</span>
                  {orderSuccess && (
                    <span className="text-xs bg-green-500/10 text-green-500 border border-green-500/20 px-3 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle size={14} /> Order Placed Successfully!
                    </span>
                  )}
                </h2>

                {orderHistory.length === 0 ? (
                  <p className="text-gray-500 text-center py-16 text-xs">You have not placed any orders yet.</p>
                ) : (
                  <div className="space-y-6">
                    {orderHistory.map((order, idx) => (
                      <div key={order._id || idx} className="p-5 rounded-2xl bg-gray-50 dark:bg-slate-900/30 border border-card-border space-y-3">
                        <div className="flex justify-between items-center border-b border-card-border pb-3 text-xs">
                          <div>
                            <span className="text-gray-400">Order ID: </span>
                            <span className="font-bold">{(order._id || "").slice(-8).toUpperCase()}</span>
                          </div>
                          <div className="text-gray-400">
                            {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : ""}
                          </div>
                        </div>

                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex gap-3 items-center">
                              <img src={item.image} alt={item.title} className="w-10 h-10 rounded object-cover flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <h5 className="font-semibold text-xs truncate">{item.title}</h5>
                                <p className="text-[10px] text-gray-400">{item.quantity} x ${item.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-between items-center pt-3 border-t border-card-border text-xs">
                          <div>
                            <span className="text-gray-400">Status: </span>
                            <span className="font-bold text-indigo-500">{order.status || "Processing"}</span>
                          </div>
                          <div className="font-bold text-sm">
                            Total: ${order.totalAmount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {/* PROFILE TAB */}
            {activeTab === "profile" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b border-card-border">My Profile</h2>
                <div className="flex flex-col md:flex-row gap-8 items-center md:items-start p-6 rounded-2xl bg-gray-50 dark:bg-slate-900/30 border border-card-border">
                  <div className="w-24 h-24 rounded-full bg-brand/20 dark:bg-gold/20 flex items-center justify-center text-brand dark:text-gold font-bold text-3xl flex-shrink-0">
                    {user.image ? <img src={user.image} alt={user.name} className="w-24 h-24 rounded-full object-cover" /> : user.name[0]}
                  </div>
                  <div className="flex-grow space-y-4 text-xs">
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Full Name</span>
                      <span className="text-sm font-bold text-gray-800 dark:text-white mt-1 block">{user.name}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Email Address</span>
                      <span className="text-sm font-bold text-gray-800 dark:text-white mt-1 block">{user.email}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Account Role</span>
                      <span className="inline-block mt-1 bg-brand/10 text-brand px-2 py-0.5 rounded text-[10px] font-bold uppercase">{user.role}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">User ID</span>
                      <span className="font-mono text-gray-500 mt-1 block">{user.id}</span>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={() => setIsUpdateModalOpen(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 text-white rounded-xl text-xs font-bold hover:opacity-90 transition-all cursor-pointer shadow-md"
                      >
                        Update Profile
                      </button>
                    </div>
                  </div>
                </div>

                {/* UPDATE USER MODAL */}
                {isUpdateModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-sm glass-panel rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95">
                      <button
                        onClick={() => setIsUpdateModalOpen(false)}
                        className="absolute right-5 top-5 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-white cursor-pointer bg-transparent border-none"
                      >
                        <X size={18} />
                      </button>

                      <div className="flex flex-col items-center mb-6">
                        <div className="w-14 h-14 rounded-full border border-cyan-500/30 flex items-center justify-center text-cyan-500 dark:text-cyan-400 mb-4 bg-cyan-500/5 dark:bg-cyan-950/20">
                          <User size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-center">Update User</h3>
                      </div>

                      <form onSubmit={handleUpdateProfileSubmit} className="space-y-5">
                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                            FULL NAME
                          </label>
                          <input
                            type="text"
                            required
                            value={updateName}
                            onChange={(e) => setUpdateName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full glass-input px-4 py-3 rounded-xl text-sm focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                            AVATAR IMAGE URL
                          </label>
                          <input
                            type="url"
                            value={updateImage}
                            onChange={(e) => setUpdateImage(e.target.value)}
                            placeholder="Enter avatar URL"
                            className="w-full glass-input px-4 py-3 rounded-xl text-sm focus:outline-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <button
                            type="button"
                            onClick={() => setIsUpdateModalOpen(false)}
                            className="py-3 bg-slate-100 dark:bg-[#1e293b] hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-xl text-xs font-bold transition-all border border-card-border cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={updating}
                            className="py-3 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-lg shadow-indigo-500/20"
                          >
                            {updating ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
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

export default function UserDashboard() {
  return (
    <React.Suspense fallback={
      <div className="flex flex-col min-h-screen justify-center items-center">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <UserDashboardContent />
    </React.Suspense>
  );
}
