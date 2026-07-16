"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Globe, Lock, Mail, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { authClient } from "@/lib/auth-client";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await login(email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Login failed. Check your credentials.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role: "admin" | "user") => {
    if (role === "admin") {
      setEmail("admin@zenithmart.com");
      setPassword("admin123");
    } else {
      setEmail("user@zenithmart.com");
      setPassword("user123");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/user"
      });
    } catch (err) {
      console.error(err);
      alert("Google login is not configured completely. Use the Demo credentials below!");
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
          <h2 className="mt-4 text-xl font-bold tracking-tight">Sign in to your account</h2>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Welcome back! Enter your details to continue shopping.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-xs flex gap-2 items-center">
            <ShieldAlert size={16} />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 bg-brand hover:bg-brand-hover text-white rounded-xl font-bold transition-all shadow-md shadow-brand/20 flex items-center justify-center gap-2"
          >
            {loading ? "Signing in..." : <>Sign In <ArrowRight size={18} /></>}
          </button>
        </form>

        {/* Social Google Login */}
        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-card-border"></div>
          <span className="flex-shrink mx-4 text-gray-500 text-[10px] uppercase font-bold tracking-wider">Or</span>
          <div className="flex-grow border-t border-card-border"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full h-11 bg-white dark:bg-slate-900 border border-card-border hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
        >
          <Globe size={18} className="text-indigo-500" />
          Continue with Google
        </button>

        {/* Demo Credentials Auto Fill */}
        <div className="p-4 bg-indigo-950/20 dark:bg-slate-900/40 rounded-2xl border border-brand/10 space-y-3">
          <div className="text-xs font-bold text-brand dark:text-gold flex items-center gap-1">
            <Sparkles size={14} /> Quick Demo Access
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoFill("user")}
              className="py-1.5 rounded-lg border border-card-border hover:bg-gray-50 dark:hover:bg-slate-800 text-[10px] font-bold uppercase transition-colors"
            >
              Demo User
            </button>
            <button
              onClick={() => handleDemoFill("admin")}
              className="py-1.5 rounded-lg border border-card-border hover:bg-gray-50 dark:hover:bg-slate-800 text-[10px] font-bold uppercase transition-colors"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-gray-500">
          Don't have an account?{" "}
          <Link href="/register" className="text-brand dark:text-gold font-semibold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
