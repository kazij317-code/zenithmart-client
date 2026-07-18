"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AIChatBot from "@/components/AIChatBot";
import { useAuth } from "@/context/AuthContext";
import { Plus, Users, DollarSign, Package, ShoppingCart, Ban, ShieldCheck, Trash2, Mail, Sparkles, LogOut } from "lucide-react";
import Link from "next/link";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

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
}

interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<Stats>({ productCount: 0, userCount: 0, orderCount: 0, totalSales: 0 });
  const [salesChart, setSalesChart] = useState<{ name: string; Sales: number }[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

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
  }, [user]);

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
          <div className="w-full lg:w-64 glass-panel rounded-2xl p-6 h-fit border border-card-border space-y-2">
            <h2 className="text-xs uppercase font-extrabold tracking-wider text-brand dark:text-gold mb-6 border-b border-card-border pb-3">
              Admin Portal
            </h2>

            <button
              onClick={() => setActiveTab("overview")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "overview"
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <DollarSign size={16} /> Business Overview
            </button>

            <button
              onClick={() => setActiveTab("products")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "products"
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Package size={16} /> Manage Products ({products.length})
            </button>

            <button
              onClick={() => setActiveTab("users")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "users"
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Users size={16} /> Manage Users ({users.length})
            </button>

            <button
              onClick={() => setActiveTab("inquiries")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "inquiries"
                  ? "bg-brand text-white shadow-md shadow-brand/20"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Mail size={16} /> Inquiries
            </button>

            <button
              onClick={() => setActiveTab("subscribers")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === "subscribers"
                  ? "bg-[#e0f7ff] dark:bg-cyan-950/40 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-900"
                  : "hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-600 dark:text-gray-300"
              }`}
            >
              <Sparkles size={16} className={activeTab === "subscribers" ? "text-cyan-500" : ""} /> Subscribers
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

          {/* Content panel */}
          <div className="flex-1 glass-panel rounded-2xl p-6 sm:p-8 border border-card-border min-h-[450px]">
            
            {/* OVERVIEW PANEL */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                <h2 className="text-xl font-bold pb-4 border-b border-card-border">Overview & Analytics</h2>

                {/* Scorecards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-slate-900/30 rounded-xl border border-card-border text-center">
                    <DollarSign size={20} className="text-brand dark:text-gold mx-auto mb-2" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Sales</span>
                    <span className="text-xl font-extrabold block mt-1">${stats.totalSales}</span>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-900/30 rounded-xl border border-card-border text-center">
                    <ShoppingCart size={20} className="text-brand dark:text-gold mx-auto mb-2" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Orders</span>
                    <span className="text-xl font-extrabold block mt-1">{stats.orderCount}</span>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-900/30 rounded-xl border border-card-border text-center">
                    <Package size={20} className="text-brand dark:text-gold mx-auto mb-2" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Products</span>
                    <span className="text-xl font-extrabold block mt-1">{stats.productCount}</span>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-slate-900/30 rounded-xl border border-card-border text-center">
                    <Users size={20} className="text-brand dark:text-gold mx-auto mb-2" />
                    <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Total Users</span>
                    <span className="text-xl font-extrabold block mt-1">{stats.userCount}</span>
                  </div>
                </div>

                {/* Sales Chart */}
                <div className="p-6 bg-gray-50 dark:bg-slate-900/10 rounded-2xl border border-card-border">
                  <h3 className="text-sm font-bold mb-4">Monthly Revenue Trends</h3>
                  <div className="h-64 w-full">
                    {salesChart.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={salesChart}>
                          <defs>
                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="name" stroke="#888888" fontSize={11} tickLine={false} axisLine={false} />
                          <YAxis stroke="#888888" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                          <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} />
                          <Area type="monotone" dataKey="Sales" stroke="#6366F1" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-gray-500">
                        Insufficient sales data to display revenue curves.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* PRODUCTS PANEL */}
            {activeTab === "products" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b border-card-border">Manage Catalog</h2>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-card-border text-gray-400 font-bold">
                        <th className="pb-3">Product Info</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Price</th>
                        <th className="pb-3">Stock</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {products.map((p) => {
                        const prodId = p._id || p.id || "";
                        return (
                          <tr key={prodId} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/10">
                            <td className="py-3.5 flex items-center gap-3">
                              <img src={p.image} alt={p.title} className="w-9 h-9 rounded object-cover flex-shrink-0" />
                              <div className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[150px]">{p.title}</div>
                            </td>
                            <td className="py-3.5 text-gray-500">{p.category}</td>
                            <td className="py-3.5 font-bold">${p.price}</td>
                            <td className="py-3.5 text-gray-500">{p.stock || 10} units</td>
                            <td className="py-3.5 text-right">
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

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-card-border text-gray-400 font-bold">
                        <th className="pb-3">User Name</th>
                        <th className="pb-3">Email Address</th>
                        <th className="pb-3">Role</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {users.map((u) => (
                        <tr key={u._id || u.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/10">
                          <td className="py-3.5 font-semibold text-gray-800 dark:text-gray-200">{u.name}</td>
                          <td className="py-3.5 text-gray-500">{u.email}</td>
                          <td className="py-3.5 text-gray-500">
                            <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                              u.role === "admin" ? "bg-amber-500/10 text-amber-500" : "bg-brand/10 text-brand"
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="py-3.5">
                            <span className={`font-semibold ${u.isBlocked ? "text-red-500" : "text-green-500"}`}>
                              {u.isBlocked ? "Blocked" : "Active"}
                            </span>
                          </td>
                          <td className="py-3.5 text-right">
                            {u.role !== "admin" && (
                              <button
                                onClick={() => handleBlockUser(u._id || u.id, u.isBlocked)}
                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-colors flex items-center gap-1.5 ml-auto ${
                                  u.isBlocked
                                    ? "bg-green-500/10 text-green-500 hover:bg-green-500/20"
                                    : "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                                }`}
                              >
                                {u.isBlocked ? (
                                  <>
                                    <ShieldCheck size={12} /> Unblock
                                  </>
                                ) : (
                                  <>
                                    <Ban size={12} /> Block User
                                  </>
                                )}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
            {/* INQUIRIES PANEL */}
            {activeTab === "inquiries" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b border-card-border">Customer Inquiries</h2>
                <div className="space-y-4">
                  {[
                    { name: "John Doe", email: "john@example.com", message: "Is the premium smartphone in stock soon?", date: "2026-07-18" },
                    { name: "Sarah Connor", email: "sarah@cyberdyne.com", message: "I would like to request bulk pricing for corporate laptops.", date: "2026-07-17" },
                    { name: "Bruce Wayne", email: "bruce@waynecorp.com", message: "Do you offer priority overnight shipping for special tech gear?", date: "2026-07-16" }
                  ].map((inq, i) => (
                    <div key={i} className="p-4 bg-gray-50 dark:bg-slate-900/30 rounded-xl border border-card-border">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-bold text-sm text-gray-800 dark:text-gray-200">{inq.name}</h4>
                          <span className="text-[10px] text-gray-500">{inq.email}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">{inq.date}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed mt-2">{inq.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBSCRIBERS PANEL */}
            {activeTab === "subscribers" && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold pb-4 border-b border-card-border">Newsletter Subscribers</h2>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-card-border text-gray-400 font-bold">
                        <th className="pb-3">Subscriber Email</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Subscription Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-card-border">
                      {[
                        { email: "newsletter1@example.com", status: "Active", date: "2026-07-18" },
                        { email: "subscriber2@yahoo.com", status: "Active", date: "2026-07-15" },
                        { email: "customer_deals@gmail.com", status: "Active", date: "2026-07-10" }
                      ].map((sub, i) => (
                        <tr key={i} className="hover:bg-gray-50/50 dark:hover:bg-slate-900/10">
                          <td className="py-3.5 font-semibold text-gray-800 dark:text-gray-200">{sub.email}</td>
                          <td className="py-3.5">
                            <span className="bg-cyan-500/10 text-cyan-500 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                              {sub.status}
                            </span>
                          </td>
                          <td className="py-3.5 text-right text-gray-500">{sub.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
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
