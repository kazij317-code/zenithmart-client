import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const GithubIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.479C19.138 20.164 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const InstagramIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="11" />
    <circle cx="4" cy="4" r="2" />
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
                <InstagramIcon className="w-[18px] h-[18px]" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105"
                aria-label="LinkedIn"
              >
                <LinkedinIcon className="w-[18px] h-[18px]" />
              </a>
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all flex items-center justify-center text-slate-600 dark:text-slate-300 hover:scale-105"
                aria-label="GitHub"
              >
                <GithubIcon className="w-[18px] h-[18px]" />
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
