"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User, Image, ArrowRight, ShieldAlert, ShieldCheck } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await register(name, email, password, imageUrl || undefined, role);
      if (res.success) {
        setSuccessMsg("Registration successful! Redirecting to login...");
      } else {
        setErrorMsg(res.error || "Registration failed.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-dark py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-brand/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gold/5 rounded-full blur-3xl" />

      <div className="max-w-md w-full space-y-8 glass-panel p-8 sm:p-10 rounded-2xl shadow-2xl border border-card-border relative z-10">
        <div className="text-center">
          <Link href="/" className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-brand to-gold bg-clip-text text-transparent">
            ZenithMart
          </Link>
          <h2 className="mt-4 text-xl font-bold tracking-tight">Create your account</h2>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Join ZenithMart to start shopping with smart AI assistance.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex gap-2 items-center">
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-500 text-xs flex gap-2 items-center">
            <ShieldCheck size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
              <User size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>

            {/* Email */}
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
              <Mail size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>

            {/* Password */}
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
              <Lock size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>

            {/* Role selection for testing */}
            <div className="grid grid-cols-2 items-center gap-2 border border-card-border p-2.5 rounded-xl">
              <span className="text-xs text-gray-400 font-semibold px-2">Account Type:</span>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-transparent text-xs font-bold text-gray-700 dark:text-gray-200 border-none focus:outline-none"
              >
                <option value="user" className="bg-white dark:bg-slate-900">Standard User</option>
                <option value="admin" className="bg-white dark:bg-slate-900">Administrator</option>
              </select>
            </div>

            {/* Profile Image URL */}
            <div className="relative">
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="Profile Image URL (Optional)"
                className="w-full glass-input pl-10 pr-4 py-2.5 rounded-xl text-sm"
              />
              <Image size={16} className="absolute left-3.5 top-3.5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold transition-all shadow-md shadow-brand/20 flex items-center justify-center gap-2"
          >
            {loading ? "Signing up..." : <>Register Account <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-brand dark:text-gold font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
