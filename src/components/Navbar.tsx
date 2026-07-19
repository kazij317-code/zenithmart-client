"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useApp } from "@/context/AppContext";
import { ShoppingCart, Heart, Menu, X, Sun, Moon, LogOut, User as UserIcon, Users, ChevronDown } from "lucide-react";
import { toast } from "react-hot-toast";

export default function Navbar() {
  const { user, logout, login } = useAuth();
  const { cart, favorites } = useApp();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    // Check local storage or document class for dark mode
    const isDarkClass = document.documentElement.classList.contains("dark");
    setIsDark(isDarkClass);
  }, []);

  const toggleDarkMode = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const totalCartQty = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Define links based on auth status
  const getNavLinks = () => {
    const base = [
      { name: "Home", href: "/" },
      { name: "Explore", href: "/explore" },
      { name: "About", href: "/about" },
    ];

    if (!user) {
      return [...base, { name: "Contact", href: "/contact" }];
    }

    if (user.role === "admin") {
      return [
        ...base,
        { name: "Dashboard", href: "/dashboard/admin" },
        { name: "Add Item", href: "/items/add" },
        { name: "Contact", href: "/contact" }
      ];
    }

    return [
      ...base,
      { name: "Dashboard", href: "/dashboard/user" },
      { name: "Contact", href: "/contact" }
    ];
  };

  const navLinks = getNavLinks();

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel shadow-sm border-b border-white/10 dark:border-black/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-bold tracking-wider text-brand dark:text-gold flex items-center gap-2">
              <span className="bg-gradient-to-r from-brand to-gold text-transparent bg-clip-text">ZenithMart</span>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex space-x-8 items-center">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-brand dark:hover:text-gold ${
                    isActive ? "text-brand dark:text-gold font-semibold" : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              aria-label="Toggle Theme"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Favorites Icon */}
            {user && (
              <Link
                href="/dashboard/user?tab=favorites"
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <Heart size={20} />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
            )}

            {/* Cart Icon */}
            {user && (
              <Link
                href="/dashboard/user?tab=cart"
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <ShoppingCart size={20} />
                {totalCartQty > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalCartQty}
                  </span>
                )}
              </Link>
            )}

            {/* User Profile / Logout */}
            {user ? (
              <div className="relative flex items-center space-x-3 pl-2 border-l border-gray-200 dark:border-gray-800">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
                >
                  <div className="w-8 h-8 rounded-full bg-brand/20 dark:bg-gold/20 flex items-center justify-center text-brand dark:text-gold border border-brand/15">
                    {user.image ? (
                      <img src={user.image} alt={user.name} className="w-8 h-8 rounded-full object-cover" />
                    ) : (
                      <UserIcon size={16} />
                    )}
                  </div>
                  <span className="text-xs font-semibold max-w-[100px] truncate text-gray-700 dark:text-gray-200">{user.name}</span>
                  <ChevronDown size={14} className="text-gray-500 transition-transform duration-200" style={{ transform: isDropdownOpen ? 'rotate(180deg)' : 'none' }} />
                </button>

                {isDropdownOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)} />
                    <div className="absolute right-0 top-10 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                        <div className="text-xs font-bold text-gray-800 dark:text-gray-200">Welcome back!</div>
                        <div className="text-[10px] text-gray-500 truncate mt-0.5">{user.email}</div>
                      </div>

                      <button
                        onClick={async () => {
                          setIsDropdownOpen(false);
                          const res = await login("jams@yahoo.com", "Nabhan@123");
                          if (res.success) {
                            toast.success("Logged in as Demo User");
                            window.location.reload();
                          } else {
                            toast.error(res.error || "Failed to switch to Demo User");
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left bg-transparent border-none cursor-pointer"
                      >
                        <UserIcon size={16} className="text-gray-400" />
                        DEMO USER
                      </button>

                      <button
                        onClick={async () => {
                          setIsDropdownOpen(false);
                          const res = await login("admin@admin.com", "Admin@123");
                          if (res.success) {
                            toast.success("Logged in as Demo Admin");
                            window.location.reload();
                          } else {
                            toast.error(res.error || "Failed to switch to Demo Admin");
                          }
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors text-left bg-transparent border-none cursor-pointer"
                      >
                        <Users size={16} className="text-gray-400" />
                        DEMO ADMIN
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-800 mt-2 pt-2">
                        <button
                          onClick={() => {
                            setIsDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors text-left bg-transparent border-none cursor-pointer"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3 pl-2 border-l border-gray-200 dark:border-gray-800">
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand dark:hover:text-gold"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 h-9 flex items-center justify-center rounded-lg bg-brand text-white hover:bg-brand-hover text-sm font-semibold transition-all shadow-md"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Cart Icon Mobile */}
            {user && (
              <Link
                href="/dashboard/user?tab=cart"
                className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300 transition-colors"
              >
                <ShoppingCart size={20} />
                {totalCartQty > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {totalCartQty}
                  </span>
                )}
              </Link>
            )}

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-white/10 dark:border-black/20 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive ? "bg-brand/10 text-brand dark:text-gold font-semibold" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
          {user ? (
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <div className="flex items-center gap-3 px-3">
                <div className="w-9 h-9 rounded-full bg-brand/20 dark:bg-gold/20 flex items-center justify-center text-brand dark:text-gold">
                  {user.image ? (
                    <img src={user.image} alt={user.name} className="w-9 h-9 rounded-full object-cover" />
                  ) : (
                    <UserIcon size={18} />
                  )}
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-200">{user.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{user.email}</div>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10 transition-colors"
              >
                <LogOut size={20} />
                Logout
              </button>
            </div>
          ) : (
            <div className="pt-4 pb-2 border-t border-gray-200 dark:border-gray-800 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-brand"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={() => setIsOpen(false)}
                className="w-full text-center py-2 rounded-lg bg-brand text-white hover:bg-brand-hover text-sm font-semibold transition-all shadow-md"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
