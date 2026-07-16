import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-16 pb-8 mt-auto w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div>
            <span className="text-2xl font-bold tracking-wider text-white bg-gradient-to-r from-indigo-400 to-amber-300 bg-clip-text text-transparent">
              ZenithMart
            </span>
            <p className="mt-4 text-sm text-slate-400 leading-relaxed">
              Premium curated e-commerce marketplace powered by advanced agentic AI shopping assistance. Find exactly what fits your lifestyle.
            </p>
            <div className="mt-6 flex space-x-4">
              <a href="https://zenithmart.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors text-xs flex items-center gap-1.5 border border-slate-800 px-3 py-1.5 rounded-lg bg-slate-950/20">
                <Globe size={14} /> Website
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="hover:text-white text-sm transition-colors">Home</Link>
              </li>
              <li>
                <Link href="/explore" className="hover:text-white text-sm transition-colors">Explore Shop</Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-white text-sm transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white text-sm transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Support & Help</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about#faq" className="hover:text-white text-sm transition-colors">FAQs</Link>
              </li>
              <li>
                <Link href="/about#shipping" className="hover:text-white text-sm transition-colors">Shipping Policy</Link>
              </li>
              <li>
                <Link href="/about#privacy" className="hover:text-white text-sm transition-colors">Privacy & Terms</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Get In Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-sm">
                <MapPin size={18} className="text-indigo-400 flex-shrink-0" />
                <span>100 Innovation Way, Silicon Valley, CA</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={18} className="text-indigo-400 flex-shrink-0" />
                <span>+1 (800) 555-0199</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={18} className="text-indigo-400 flex-shrink-0" />
                <span>support@zenithmart.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ZenithMart Inc. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="/about#privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/about#privacy" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
