"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Globe, Lock, Mail, ArrowRight, ShieldAlert, Sparkles, Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import { toast } from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setErrorMsg("");

    try {
      const res = await login(email, password);
      if (!res.success) {
        const errMsg = res.error || "Login failed. Check your credentials.";
        setErrorMsg(errMsg);
        toast.error(errMsg);
      } else {
        toast.success("Welcome back! Successfully logged in.");
      }
    } catch (err: any) {
      const errMsg = err.message || "Network error. Please try again.";
      setErrorMsg(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = (role: "admin" | "user") => {
    if (role === "admin") {
      setEmail("admin@admin.com");
      setPassword("Admin@123");
      toast.success("Filled demo admin credentials.");
    } else {
      setEmail("jams@yahoo.com");
      setPassword("Nabhan@123");
      toast.success("Filled demo user credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      toast.loading("Redirecting to Google...");
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard/user"
      });
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Google login error. Please use demo credentials instead.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen transition-colors duration-300">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/5 dark:bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-3xl" />

        <div className="max-w-md w-full space-y-6 glass-panel p-8 sm:p-10 rounded-2xl shadow-2xl relative z-10">
          <div className="text-center">
            <Link href="/" className="text-3xl font-black tracking-wider bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
              ZenithMart
            </Link>
            <h2 className="mt-4 text-xl font-bold tracking-tight">Sign in to your account</h2>
            <p className="mt-1 text-xs text-gray-500">
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
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  EMAIL ADDRESS
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="w-full glass-input px-4 py-3 rounded-xl pl-10 pr-4 text-sm transition-all focus:outline-none"
                  />
                  <Mail size={16} className="absolute left-3.5 top-4 text-slate-400 dark:text-gray-500" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Password
                  </label>
                  <Link href="#" className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-500 dark:hover:text-cyan-300 font-semibold hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full glass-input px-4 py-3 rounded-xl pl-10 pr-10 text-sm transition-all focus:outline-none"
                  />
                  <Lock size={16} className="absolute left-3.5 top-4 text-slate-400 dark:text-gray-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-4 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-slate-400 cursor-pointer bg-transparent border-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-cyan-500/20 cursor-pointer text-sm"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Social Google Login */}
          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-card-border"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-bold tracking-wider">Or</span>
            <div className="flex-grow border-t border-card-border"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full h-12 glass-input hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all flex items-center justify-center gap-2.5 cursor-pointer rounded-xl"
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
          <div className="p-5 glass-panel rounded-2xl space-y-3">
            <div className="text-xs font-bold text-indigo-700 dark:text-cyan-400 flex items-center gap-1.5">
              <Sparkles size={14} className="text-indigo-600 dark:text-cyan-400 animate-pulse" />
              Quick Demo Access
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <button
                onClick={() => handleDemoFill("user")}
                className="py-2.5 rounded-xl border border-card-border hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold uppercase transition-colors cursor-pointer bg-transparent"
              >
                Demo User
              </button>
              <button
                onClick={() => handleDemoFill("admin")}
                className="py-2.5 rounded-xl border border-card-border hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold uppercase transition-colors cursor-pointer bg-transparent"
              >
                Demo Admin
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            Don't have an account?{" "}
            <Link href="/register" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
