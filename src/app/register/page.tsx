"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User, Image, ArrowRight, ShieldAlert, ShieldCheck, Eye } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import Navbar from "@/components/Navbar";
import { toast } from "react-hot-toast";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrorMsg("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await register(name, email, password, imageUrl || undefined, role);
      if (res.success) {
        setSuccessMsg("Registration successful! Redirecting to login...");
        toast.success("Account created successfully! Redirecting to login.");
      } else {
        const errMsg = res.error || "Registration failed.";
        setErrorMsg(errMsg);
        toast.error(errMsg);
      }
    } catch (err: any) {
      const errMsg = err.message || "Network error. Please try again.";
      setErrorMsg(errMsg);
      toast.error(errMsg);
    } finally {
      setLoading(false);
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
      toast.error("Google sign up failed. Please fill the registration form.");
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
            <h2 className="mt-4 text-xl font-bold tracking-tight">Create your account</h2>
            <p className="mt-1 text-xs text-gray-500">
              Join ZenithMart to start shopping with smart AI assistance.
            </p>
          </div>

          {errorMsg && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs flex gap-2 items-center">
              <ShieldAlert size={16} className="text-red-500 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-600 dark:text-green-400 text-xs flex gap-2 items-center">
              <ShieldCheck size={16} className="text-green-500 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  FULL NAME
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full glass-input px-4 py-3 rounded-xl pl-10 pr-4 text-sm transition-all focus:outline-none"
                  />
                  <User size={16} className="absolute left-3.5 top-4 text-slate-400 dark:text-gray-500" />
                </div>
              </div>

              {/* Email */}
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

              {/* Profile Image URL */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  PROFILE IMAGE URL
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="Enter image URL or upload"
                      className="w-full glass-input px-4 py-3 rounded-xl pl-10 pr-4 text-sm transition-all focus:outline-none"
                    />
                    <Image size={16} className="absolute left-3.5 top-4 text-slate-400 dark:text-gray-500" />
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("Upload feature mock clicked!")}
                    className="px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all border border-card-border cursor-pointer flex-shrink-0"
                  >
                    Upload
                  </button>
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full glass-input px-4 py-3 rounded-xl pl-10 pr-10 text-sm transition-all focus:outline-none"
                  />
                  <Lock size={16} className="absolute left-3.5 top-4 text-slate-400 dark:text-gray-500" />
                  <button type="button" className="absolute right-3.5 top-4 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-slate-400 cursor-pointer bg-transparent border-none">
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full glass-input px-4 py-3 rounded-xl pl-10 pr-10 text-sm transition-all focus:outline-none"
                  />
                  <Lock size={16} className="absolute left-3.5 top-4 text-slate-400 dark:text-gray-500" />
                  <button type="button" className="absolute right-3.5 top-4 text-slate-400 dark:text-gray-500 hover:text-slate-600 dark:hover:text-slate-400 cursor-pointer bg-transparent border-none">
                    <Eye size={16} />
                  </button>
                </div>
              </div>

              {/* Hidden Role selection (keep value for logic) */}
              <input type="hidden" value={role} />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-600 hover:to-purple-600 text-white font-semibold transition-all duration-300 shadow-md hover:shadow-cyan-500/20 cursor-pointer text-sm"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-card-border"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase font-bold tracking-wider">Or Continue With</span>
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

          <div className="text-center text-xs text-slate-500">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
