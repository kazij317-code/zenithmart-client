"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Globe, Lock, Mail, ArrowRight, ShieldAlert, Sparkles, Eye } from "lucide-react";
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
      setEmail("admin@admin.com");
      setPassword("Admin@123");
    } else {
      setEmail("jams@yahoo.com");
      setPassword("Nabhan@123");
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
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090d16] py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden text-slate-800 dark:text-white">
      <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />

      <div className="max-w-md w-full space-y-6 bg-white dark:bg-[#0f172a]/80 backdrop-blur-md p-8 sm:p-10 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 relative z-10">
        <div className="text-center">
          <Link href="/" className="text-3xl font-black tracking-wider bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            ZenithMart
          </Link>
          <h2 className="mt-4 text-xl font-bold text-slate-800 dark:text-white tracking-tight">Sign in to your account</h2>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Welcome back! Enter your details to continue shopping.
          </p>
        </div>

        {errorMsg && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex gap-2 items-center">
            <ShieldAlert size={16} className="text-red-500 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                EMAIL ADDRESS
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email address"
                  className="w-full bg-slate-50 dark:bg-[#1e293b]/70 border border-slate-300 dark:border-slate-700/60 focus:border-cyan-500 text-slate-800 dark:text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                />
                <Mail size={16} className="absolute left-3.5 top-4 text-slate-400 dark:text-slate-500" />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Password
                </label>
                <Link href="#" className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-semibold hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-slate-50 dark:bg-[#1e293b]/70 border border-slate-300 dark:border-slate-700/60 focus:border-cyan-500 text-slate-800 dark:text-white rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-cyan-500 transition-all placeholder-slate-400 dark:placeholder-slate-500"
                />
                <Lock size={16} className="absolute left-3.5 top-4 text-slate-400 dark:text-slate-500" />
                <button type="button" className="absolute right-3.5 top-4 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400 cursor-pointer bg-transparent border-none">
                  <Eye size={16} />
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 hover:opacity-95 text-white rounded-xl font-bold transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 cursor-pointer text-sm"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Social Google Login */}
        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-[10px] uppercase font-bold tracking-wider">Or</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full h-12 bg-slate-50 dark:bg-[#0b0f19] border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Google
        </button>

        {/* Demo Credentials Auto Fill */}
        <div className="p-5 bg-slate-100 dark:bg-[#1e293b]/40 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="text-xs font-bold text-indigo-700 dark:text-cyan-400 flex items-center gap-1.5">
            <Sparkles size={14} className="text-indigo-600 dark:text-cyan-400 animate-pulse" />
            Quick Demo Access
          </div>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => handleDemoFill("user")}
              className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-[10px] text-slate-800 dark:text-white font-bold uppercase transition-colors cursor-pointer bg-transparent"
            >
              Demo User
            </button>
            <button
              onClick={() => handleDemoFill("admin")}
              className="py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800 text-[10px] text-slate-800 dark:text-white font-bold uppercase transition-colors cursor-pointer bg-transparent"
            >
              Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link href="/register" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
