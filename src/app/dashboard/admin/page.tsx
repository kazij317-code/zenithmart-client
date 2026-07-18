"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { useAuth } from "@/context/AuthContext";
import { Plus, Users, DollarSign, Package, ShoppingCart, Ban, ShieldCheck, Trash2, Mail, Sparkles, LogOut, Edit, Eye, X, CreditCard, Shield, Grid, PlusCircle, Compass, User } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

interface Stats {
  productCount: number;
  userCount: number;
  orderCount: number;
  totalSales: number;
}

interface Product {
  _id?: string;
  id?: string;
  title: string;
  price: number;
  category: string;
  stock: number;
  image: string;
  shortDescription?: string;
  fullDescription?: string;
}

interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
  createdAt?: string;
  image?: string;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<Stats>({ productCount: 0, userCount: 0, orderCount: 0, totalSales: 0 });
  const [salesChart, setSalesChart] = useState<{ name: string; Sales: number }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [inquiries, setInquiries] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Product Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editShortDesc, setEditShortDesc] = useState("");
  const [editFullDesc, setEditFullDesc] = useState("");

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

  const fetchAdminData = async () => {
    setLoading(true);
    const token = localStorage.getItem("better-auth.session_token") || "";
    try {
      // 1. Fetch Stats & Chart
      const statsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const statsContentType = statsRes.headers.get("content-type");
      if (statsContentType && statsContentType.includes("application/json")) {
        const statsData = await statsRes.json();
        if (statsData.success) {
          setStats(statsData.stats);
          setSalesChart(statsData.salesChart || []);
        }
      } else {
        console.error("Admin stats response was not JSON:", await statsRes.text());
      }

      // 2. Fetch Products
      const prodRes = await fetch(`${BASE_URL}/api/products?limit=100`);
      const prodContentType = prodRes.headers.get("content-type");
      if (prodContentType && prodContentType.includes("application/json")) {
        const prodData = await prodRes.json();
        if (prodData.success) {
          setProducts(prodData.products || []);
        }
      } else {
        console.error("Admin products response was not JSON:", await prodRes.text());
      }

      // 3. Fetch Users
      const usersRes = await fetch(`${BASE_URL}/api/admin/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const usersContentType = usersRes.headers.get("content-type");
      if (usersContentType && usersContentType.includes("application/json")) {
        const usersData = await usersRes.json();
        if (usersData.success) {
          setUsers(usersData.users || []);
        }
      } else {
        console.error("Admin users response was not JSON:", await usersRes.text());
      }

      // 4. Fetch Inquiries
      const inqRes = await fetch(`${BASE_URL}/api/admin/inquiries`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const inqContentType = inqRes.headers.get("content-type");
      if (inqContentType && inqContentType.includes("application/json")) {
        const inqData = await inqRes.json();
        if (inqData.success) {
          setInquiries(inqData.inquiries || []);
        }
      }

      // 5. Fetch Subscribers
      const subRes = await fetch(`${BASE_URL}/api/admin/subscribers`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const subContentType = subRes.headers.get("content-type");
      if (subContentType && subContentType.includes("application/json")) {
        const subData = await subRes.json();
        if (subData.success) {
          setSubscribers(subData.subscribers || []);
        }
      }

      // 6. Fetch Orders (Transactions)
      const ordersRes = await fetch(`${BASE_URL}/api/admin/orders`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const ordersContentType = ordersRes.headers.get("content-type");
      if (ordersContentType && ordersContentType.includes("application/json")) {
        const ordersData = await ordersRes.json();
        if (ordersData.success) {
          setOrders(ordersData.orders || []);
        }
      }
    } catch (err) {
      console.error("Admin fetching error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === "admin") {
      fetchAdminData();
    }
  }, [user, activeTab]);

  const handleBlockUser = async (uId: string, currentBlockedStatus: boolean) => {
    const token = localStorage.getItem("better-auth.session_token") || "";
    try {
      const res = await fetch(`${BASE_URL}/api/admin/users/${uId}/block`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ isBlocked: !currentBlockedStatus })
      });
      const usersContentType = res.headers.get("content-type");
      if (usersContentType && usersContentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          fetchAdminData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (pId: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const token = localStorage.getItem("better-auth.session_token") || "";
    try {
      const res = await fetch(`${BASE_URL}/api/products/${pId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      const prodContentType = res.headers.get("content-type");
      if (prodContentType && prodContentType.includes("application/json")) {
        const data = await res.json();
        if (data.success) {
          setProducts((prev) => prev.filter((p) => p._id !== pId && p.id !== pId));
          fetchAdminData();
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setEditTitle(p.title);
    setEditPrice(String(p.price));
    setEditCategory(p.category);
    setEditStock(String(p.stock));
    setEditImage(p.image);
    setEditShortDesc(p.shortDescription || "");
    setEditFullDesc(p.fullDescription || "");
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    const token = localStorage.getItem("better-auth.session_token") || "";
    try {
      const res = await fetch(`${BASE_URL}/api/products/${editingProduct._id || editingProduct.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          title: editTitle,
          price: Number(editPrice),
          category: editCategory,
          stock: Number(editStock),
          image: editImage,
          shortDescription: editShortDesc,
          fullDescription: editFullDesc
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsEditModalOpen(false);
        setEditingProduct(null);
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error editing product:", err);
    }
  };

  const handleToggleOrderStatus = async (orderId: string, currentStatus: string) => {
    const token = localStorage.getItem("better-auth.session_token") || "";
    const newStatus = currentStatus === "Pending" ? "Confirmed" : "Pending";
    try {
      const res = await fetch(`${BASE_URL}/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (err) {
      console.error("Error updating order status:", err);
    }
  };

  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-sm font-semibold">Checking access privileges...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Admin Sidebar */}
          <div className="w-full lg:w-64 space-y-6">
            {/* Profile Card */}
            <div className="bg-[#ffffff] dark:bg-slate-900 rounded-3xl p-6 border border-slate-800 dark:border-slate-700 text-center flex flex-col items-center shadow-sm">
              <div className="relative w-20 h-20 mb-3">
                <img
                  src={user?.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=256&auto=format&fit=crop"}
                  alt="Admin Avatar"
                  className="w-full h-full rounded-full object-cover border-2 border-brand/20"
                />
                <span className="bg-amber-500 text-white text-[8px] font-extrabold px-2 py-0.5 rounded-full absolute -bottom-1.5 left-1/2 transform -translate-x-1/2 shadow-sm uppercase tracking-wider">
                  Admin
                </span>
              </div>
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-200 mt-2">{user?.name || "admin"}</h3>
              <p className="text-[10px] text-gray-400 font-medium truncate max-w-[180px]">{user?.email || "admin@admin.com"}</p>
            </div>

            {/* Navigation Menu */}
            <div className="bg-[#ffffff] dark:bg-slate-900 rounded-3xl p-5 border border-slate-800 dark:border-slate-700 space-y-1 shadow-sm">
              <div className="flex items-center gap-2 px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider text-gray-400 mb-2 border-b border-card-border pb-3">
                <Shield size={12} className="text-brand dark:text-gold" /> Admin Panel
              </div>

              <button
                onClick={() => setActiveTab("overview")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "overview"
                    ? "bg-sky-50 dark:bg-sky-950/20 text-sky-500 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                <Grid size={16} /> Overview
              </button>

              <button
                onClick={() => setActiveTab("users")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "users"
                    ? "bg-sky-50 dark:bg-sky-950/20 text-sky-500 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                <Users size={16} /> Manage Users
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "products"
                    ? "bg-sky-50 dark:bg-sky-950/20 text-sky-500 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                <Compass size={16} /> Manage Catalog
              </button>

              <button
                onClick={() => setActiveTab("transactions")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "transactions"
                    ? "bg-sky-50 dark:bg-sky-950/20 text-sky-500 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                <CreditCard size={16} /> Transactions
              </button>

              <button
                onClick={() => setActiveTab("inquiries")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "inquiries"
                    ? "bg-sky-50 dark:bg-sky-950/20 text-sky-500 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                <Mail size={16} /> Inquiries
              </button>

              <button
                onClick={() => setActiveTab("subscribers")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "subscribers"
                    ? "bg-sky-50 dark:bg-sky-950/20 text-sky-500 dark:text-sky-400 border border-sky-100 dark:border-sky-900/30"
                    : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
                }`}
              >
                <Sparkles size={16} /> Subscribers
              </button>

              <div className="pt-4 border-t border-card-border mt-4">
              <Link
                href="/items/add"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 border border-dashed border-card-border mb-2"
              >
                <Plus size={16} className="text-brand dark:text-gold" /> Add New Product
              </Link>

              <button
                onClick={logout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-red-500 hover:bg-red-500/10 transition-colors cursor-pointer"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>

          {/* Content panel */}
          <div className="flex-1 bg-[#ffffff] dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-800 dark:border-slate-700 min-h-[450px] shadow-sm">
            
            {/* OVERVIEW PANEL */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-extrabold text-gray-800 dark:text-gray-100">Overview</h2>
                  <p className="text-xs text-gray-500 mt-1">Welcome back, <span className="font-bold text-amber-500">admin</span>. Here is your command center.</p>
                </div>

                {/* Scorecards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Total Users */}
                  <div className="p-6 bg-[#ffffff] dark:bg-slate-900 rounded-3xl border border-slate-800 dark:border-slate-700 flex justify-between items-center shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Total Users</span>
                      <span className="text-3xl font-black block">{stats.userCount}</span>
                      <button onClick={() => setActiveTab("users")} className="text-[10px] text-sky-500 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                        Manage users &rarr;
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-950/20 flex items-center justify-center text-sky-500">
                      <Users size={22} />
                    </div>
                  </div>

                  {/* Total Products (Stays) */}
                  <div className="p-6 bg-[#ffffff] dark:bg-slate-900 rounded-3xl border border-slate-800 dark:border-slate-700 flex justify-between items-center shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Total Stays</span>
                      <span className="text-3xl font-black block">{stats.productCount}</span>
                      <button onClick={() => setActiveTab("products")} className="text-[10px] text-sky-500 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                        Manage stays &rarr;
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/20 flex items-center justify-center text-purple-500">
                      <Compass size={22} />
                    </div>
                  </div>

                  {/* Transactions */}
                  <div className="p-6 bg-[#ffffff] dark:bg-slate-900 rounded-3xl border border-slate-800 dark:border-slate-700 flex justify-between items-center shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Transactions</span>
                      <span className="text-3xl font-black block">{orders.length}</span>
                      <button onClick={() => setActiveTab("transactions")} className="text-[10px] text-sky-500 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                        View details &rarr;
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-amber-500">
                      <CreditCard size={22} />
                    </div>
                  </div>

                  {/* Inquiries */}
                  <div className="p-6 bg-[#ffffff] dark:bg-slate-900 rounded-3xl border border-slate-800 dark:border-slate-700 flex justify-between items-center shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Inquiries</span>
                      <span className="text-3xl font-black block">{inquiries.length}</span>
                      <button onClick={() => setActiveTab("inquiries")} className="text-[10px] text-sky-500 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                        View details &rarr;
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 flex items-center justify-center text-emerald-500">
                      <Mail size={22} />
                    </div>
                  </div>

                  {/* Subscribers */}
                  <div className="p-6 bg-[#ffffff] dark:bg-slate-900 rounded-3xl border border-slate-800 dark:border-slate-700 flex justify-between items-center shadow-sm">
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider block">Subscribers</span>
                      <span className="text-3xl font-black block">{subscribers.length}</span>
                      <button onClick={() => setActiveTab("subscribers")} className="text-[10px] text-sky-500 font-bold hover:underline flex items-center gap-1 cursor-pointer">
                        View details &rarr;
                      </button>
                    </div>
                    <div className="w-12 h-12 rounded-2xl bg-yellow-50 dark:bg-yellow-950/20 flex items-center justify-center text-yellow-500">
                      <Sparkles size={22} />
                    </div>
                  </div>
                </div>

                {/* Sales Curve Chart */}
                {salesChart.length > 0 && (
                  <div className="bg-[#ffffff] dark:bg-slate-900 rounded-3xl p-6 border border-slate-800 dark:border-slate-700 shadow-sm space-y-4">
                    <div>
                      <h3 className="font-extrabold text-sm text-gray-800 dark:text-gray-200">Monthly Revenue Trends</h3>
                      <p className="text-[10px] text-gray-400 font-medium">Monthly shop earnings overview</p>
                    </div>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesChart} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-800" />
                          <XAxis dataKey="name" stroke="#a0aec0" fontSize={10} tickLine={false} />
                          <YAxis stroke="#a0aec0" fontSize={10} tickLine={false} />
                          <Tooltip contentStyle={{ background: "#ffffff", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "11px" }} />
                          <Area type="monotone" dataKey="Sales" stroke="#4F46E5" strokeWidth={2.5} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* PRODUCTS PANEL */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b border-card-border">Manage Catalog</h2>
                
                <div className="overflow-x-auto rounded-t-2xl border border-card-border">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#6b7280] dark:bg-slate-800 text-[#ffffff] font-extrabold uppercase tracking-wider">
                        <th className="p-4">Product Info</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Price</th>
                        <th className="p-4">Stock</th>
                        <th className="p-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {products.map((p) => {
                        const prodId = p._id || p.id || "";
                        return (
                          <tr key={prodId} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/10">
                            <td className="p-4 flex items-center gap-3">
                              <img src={p.image} alt={p.title} className="w-9 h-9 rounded object-cover flex-shrink-0" />
                              <div className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{p.title}</div>
                            </td>
                            <td className="p-4 text-gray-500">{p.category}</td>
                            <td className="p-4 font-bold">${p.price}</td>
                            <td className="p-4 text-gray-500">{p.stock || 10} units</td>
                            <td className="p-4 text-right flex items-center justify-end gap-1.5">
                              <a
                                href={`/products/${prodId}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-1.5 rounded-lg text-brand dark:text-gold hover:bg-brand/10 dark:hover:bg-gold/10 transition-colors inline-block"
                                title="View Details"
                              >
                                <Eye size={16} />
                              </a>
                              <button
                                onClick={() => handleOpenEditModal(p)}
                                className="p-1.5 rounded-lg text-amber-500 hover:bg-amber-500/10 transition-colors"
                                title="Edit"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(prodId)}
                                className="p-1.5 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors"
                                title="Delete"
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* USERS PANEL */}
            {activeTab === "users" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b border-card-border">Manage Store Users</h2>

                <div className="overflow-x-auto rounded-t-2xl border border-card-border">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#6b7280] dark:bg-slate-800 text-[#ffffff] font-extrabold uppercase tracking-wider">
                        <th className="p-4">User</th>
                        <th className="p-4">Role</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Joined</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {users.map((u) => {
                        const uId = u._id || u.id || "";
                        const joinDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "7/15/2026";
                        // Use dynamic profile image URL from Better-Auth signup if present
                        let avatarUrl = u.image || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=128&auto=format&fit=crop";
                        
                        return (
                          <tr key={uId} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/10">
                            <td className="p-4 flex items-center gap-3">
                              <img src={avatarUrl} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-card-border" />
                              <div>
                                <div className="font-bold text-gray-800 dark:text-gray-200">{u.name}</div>
                                <div className="text-[10px] text-gray-400">{u.email}</div>
                              </div>
                            </td>
                            <td className="p-4">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                u.role === "admin"
                                  ? "bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400"
                                  : "bg-sky-100 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400"
                              }`}>
                                {u.role === "admin" ? "Admin" : "User"}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                                u.isBlocked
                                  ? "bg-rose-100 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400"
                                  : "bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400"
                              }`}>
                                {u.isBlocked ? "Blocked" : "Active"}
                              </span>
                            </td>
                            <td className="p-4 text-gray-500 font-medium">{joinDate}</td>
                            <td className="p-4 text-right">
                              {u.role !== "admin" && (
                                <button
                                  onClick={() => handleBlockUser(uId, u.isBlocked)}
                                  className={`px-4 py-1.5 rounded-xl text-xs font-bold uppercase transition-colors flex items-center gap-1.5 ml-auto cursor-pointer ${
                                    u.isBlocked
                                      ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                                      : "bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400"
                                  }`}
                                >
                                  {u.isBlocked ? "Unblock" : "Block"}
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* INQUIRIES PANEL */}
            {activeTab === "inquiries" && (
              <div className="space-y-6">
                <div className="pb-2 border-b border-card-border">
                  <h2 className="text-xl font-bold flex items-center gap-2">Private Inquiries ✉️</h2>
                  <p className="text-[10px] text-gray-400 font-medium">Review guest inquiries and custom requests</p>
                </div>

                {inquiries.length === 0 ? (
                  <p className="text-gray-500 text-center py-16 text-xs">No customer inquiries found.</p>
                ) : (
                  <div className="overflow-x-auto rounded-t-2xl border border-card-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#6b7280] dark:bg-slate-800 text-[#ffffff] font-extrabold uppercase tracking-wider">
                          <th className="p-4">Sender Info</th>
                          <th className="p-4">Stay Reference</th>
                          <th className="p-4">Subject</th>
                          <th className="p-4">Inquiry Details</th>
                          <th className="p-4">Date Received</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border">
                        {inquiries.map((inq) => {
                          const inqId = inq._id || inq.id || "";
                          const inqDate = inq.createdAt 
                            ? new Date(inq.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) 
                            : "Jul 18, 05:56 PM";
                          return (
                            <tr key={inqId} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/10">
                              <td className="p-4">
                                <div className="font-bold text-gray-800 dark:text-gray-200">{inq.name}</div>
                                <div className="text-[10px] text-gray-400">{inq.email}</div>
                              </td>
                              <td className="p-4 font-bold text-gray-700 dark:text-gray-300">
                                General Inquiry
                              </td>
                              <td className="p-4 text-sky-500 font-bold hover:underline cursor-pointer">
                                {inq.subject || "No Subject"}
                              </td>
                              <td className="p-4 text-gray-600 dark:text-gray-300 max-w-xs whitespace-pre-line leading-relaxed">
                                {inq.message}
                              </td>
                              <td className="p-4 text-gray-500 font-medium whitespace-nowrap">
                                {inqDate}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* SUBSCRIBERS PANEL */}
            {activeTab === "subscribers" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b border-card-border">Newsletter Subscribers ({subscribers.length})</h2>
                {subscribers.length === 0 ? (
                  <p className="text-gray-500 text-center py-16 text-xs">No newsletter subscribers found.</p>
                ) : (
                  <div className="overflow-x-auto rounded-t-2xl border border-card-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#6b7280] dark:bg-slate-800 text-[#ffffff] font-extrabold uppercase tracking-wider">
                          <th className="p-4">Subscriber Email</th>
                          <th className="p-4">Status</th>
                          <th className="p-4 text-right">Subscription Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border">
                        {subscribers.map((sub) => {
                          const subId = sub._id || sub.id || sub.email || "";
                          const subDate = sub.createdAt ? new Date(sub.createdAt).toLocaleDateString() : "Recently";
                          return (
                            <tr key={subId} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/10">
                              <td className="p-4 font-semibold text-gray-800 dark:text-gray-200">{sub.email}</td>
                              <td className="p-4">
                                <span className="bg-cyan-500/10 text-cyan-500 px-2.5 py-1 rounded text-[10px] font-bold uppercase">
                                  {sub.status || "Active"}
                                </span>
                              </td>
                              <td className="p-4 text-right text-gray-500 font-medium">{subDate}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {/* TRANSACTIONS PANEL */}
            {activeTab === "transactions" && (
              <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-card-border">
                  <CreditCard className="text-brand dark:text-gold" size={24} />
                  <div>
                    <h2 className="text-xl font-bold">Transactions Dashboard</h2>
                    <p className="text-[10px] text-gray-400 font-medium">Review customer orders and shop payments</p>
                  </div>
                </div>

                {orders.length === 0 ? (
                  <p className="text-gray-500 text-center py-16 text-xs">No transactions found.</p>
                ) : (
                  <div className="overflow-x-auto rounded-t-2xl border border-card-border">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-[#6b7280] dark:bg-slate-800 text-[#ffffff] font-extrabold uppercase tracking-wider">
                          <th className="p-4">Transaction ID</th>
                          <th className="p-4">Customer Info</th>
                          <th className="p-4">Items Ordered</th>
                          <th className="p-4">Order Date</th>
                          <th className="p-4">Total Price</th>
                          <th className="p-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-card-border">
                        {orders.map((order) => {
                          const orderId = order._id || order.id || "";
                          const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recently";
                          return (
                            <tr key={orderId} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/10">
                              <td className="p-4 font-mono text-[10px] text-gray-500 max-w-[120px] truncate">{orderId}</td>
                              <td className="p-4">
                                <div className="font-semibold text-gray-800 dark:text-gray-200">
                                  {order.email.split("@")[0]}
                                </div>
                                <div className="text-[10px] text-gray-400">{order.email}</div>
                              </td>
                              <td className="p-4 max-w-[200px] truncate font-medium">
                                {order.items && order.items.map((item: any) => `${item.title} (x${item.quantity})`).join(", ")}
                              </td>
                              <td className="p-4 text-gray-500 font-medium">{orderDate}</td>
                              <td className="p-4 font-bold text-brand dark:text-gold">${order.totalAmount}</td>
                              <td className="p-4">
                                <button
                                  onClick={() => handleToggleOrderStatus(orderId, order.status || "Pending")}
                                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase transition-all hover:scale-105 cursor-pointer ${
                                    order.status === "Pending" 
                                      ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" 
                                      : "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                  }`}
                                >
                                  {order.status || "Pending"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
      <AIChatBot />

      {/* Edit Product Modal */}
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-card-border max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-card-border">
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                <Edit size={18} className="text-amber-500" /> Edit Product Catalog
              </h3>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingProduct(null);
                }}
                className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Product Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Price ($)</label>
                  <input
                    type="number"
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Stock Count</label>
                  <input
                    type="number"
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Category</label>
                <input
                  type="text"
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Image URL</label>
                <input
                  type="text"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editShortDesc}
                  onChange={(e) => setEditShortDesc(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-400 mb-1">Full Description</label>
                <textarea
                  value={editFullDesc}
                  onChange={(e) => setEditFullDesc(e.target.value)}
                  className="w-full glass-input px-3.5 py-2 rounded-xl text-xs min-h-[100px]"
                  required
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-card-border">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 dark:text-gray-300 rounded-xl text-xs font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-brand hover:bg-brand-hover text-white rounded-xl text-xs font-bold transition-colors shadow-lg shadow-brand/10"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
