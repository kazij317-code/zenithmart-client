import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Instagram, Linkedin, Github } from "lucide-react";

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#ffffff] dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div>
            <span className="text-xl font-bold tracking-wider text-amber-500 dark:text-gold">
              ZenithMart
            </span>
            <p className="mt-4 text-xs leading-relaxed max-w-xs text-slate-500 dark:text-slate-400">
              Curated luxury shopping experience and bespoke product selections. Reimagining premium marketplace options across the globe.
            </p>
            <div className="mt-6 flex gap-3">
              <a 
                href="https://x.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105"
                aria-label="X (formerly Twitter)"
              >
                <XIcon className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105"
                aria-label="GitHub"
              >
                <Github size={18} />
              </a>
            </div>
          </div>

          {/* Explore Products */}
          <div>
            <h3 className="text-gray-800 dark:text-white font-bold text-xs uppercase tracking-wider mb-4">Explore Products</h3>
            <ul className="space-y-3 text-xs font-semibold">
              <li>
                <Link href="/explore?category=Electronics" className="hover:text-amber-500 dark:hover:text-gold transition-colors">Electronics</Link>
              </li>
              <li>
                <Link href="/explore?category=Fashion" className="hover:text-amber-500 dark:hover:text-gold transition-colors">Fashion & Apparel</Link>
              </li>
              <li>
                <Link href="/explore?category=Home%20%26%20Living" className="hover:text-amber-500 dark:hover:text-gold transition-colors">Home & Living</Link>
              </li>
              <li>
                <Link href="/explore?category=Fitness%20%26%20Outdoor" className="hover:text-amber-500 dark:hover:text-gold transition-colors">Fitness & Outdoors</Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-gray-800 dark:text-white font-bold text-xs uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3 text-xs font-semibold">
              <li>
                <Link href="/about" className="hover:text-amber-500 dark:hover:text-gold transition-colors">About ZenithMart</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-500 dark:hover:text-gold transition-colors">Contact Support</Link>
              </li>
              <li>
                <Link href="/items/add" className="hover:text-amber-500 dark:hover:text-gold transition-colors">List Your Product</Link>
              </li>
              <li>
                <Link href="/dashboard/admin" className="hover:text-amber-500 dark:hover:text-gold transition-colors">Admin Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-gray-800 dark:text-white font-bold text-xs uppercase tracking-wider mb-4">Contact</h3>
            <ul className="space-y-4 text-xs font-semibold">
              <li className="flex items-start gap-2.5">
                <MapPin size={16} className="text-amber-500 dark:text-gold flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">Mujahid Nagar, Kodomtoly, Rayerbagh, Dhaka</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={16} className="text-amber-500 dark:text-gold flex-shrink-0" />
                <span>+8801712736526</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={16} className="text-amber-500 dark:text-gold flex-shrink-0" />
                <span className="break-all">mithu00781@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 font-semibold">
          <p>© {new Date().getFullYear()} ZenithMart Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/about#privacy" className="hover:text-amber-500 dark:hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/about#privacy" className="hover:text-amber-500 dark:hover:text-gold transition-colors">Terms of Service</Link>
            <Link href="/about#privacy" className="hover:text-amber-500 dark:hover:text-gold transition-colors">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
