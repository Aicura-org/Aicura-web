'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Search, Menu, X, Clock, ShieldCheck } from 'lucide-react';
import EnquireModal from '../ui/EnquireModal';

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Tests & Services', href: '/tests-services' },
    { label: 'Health Packages', href: '/packages' },
    { label: 'Home Collection', href: '/home-collection' },
    { label: 'About Us', href: '/about' },
    { label: 'Campaigns', href: '/campaigns' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header className="w-full sticky top-0 z-40 bg-brand-700 text-white shadow-md">
        {/* Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <img
                src="/logo.png"
                alt="AiCura Diagnostics"
                className="h-20 sm:h-24 w-auto object-contain group-hover:scale-105 transition-transform"
              />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-2">
              {navItems.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`px-2 xl:px-3 py-2 rounded-md text-[13px] xl:text-sm font-medium transition-colors ${active
                      ? 'text-yellow-400 border-b-2 border-yellow-400 bg-brand-800/40'
                      : 'text-slate-200 hover:text-white hover:bg-brand-600/30'
                      }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons & Button */}
            <div className="hidden sm:flex items-center gap-2 xl:gap-4">

              {/* Phone Badge */}
              <a
                href="tel:+919946284615"
                className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-800/80 border border-emerald-500/30 hover:border-yellow-500/50 transition-all text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-semibold text-yellow-400 leading-tight">+91 99462 84615</span>
                  <span className="text-[10px] text-emerald-200/80 leading-tight">Mon - Sat: 7am - 8pm</span>
                </div>
              </a>

              {/* Enquire Button */}
              <button
                onClick={() => setIsEnquireOpen(true)}
                className="px-4 xl:px-5 py-2.5 rounded-full gold-gradient text-brand-900 font-semibold text-[13px] xl:text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-1.5"
              >
                Enquire Now
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => setIsEnquireOpen(true)}
                className="px-3 py-1.5 rounded-full gold-gradient text-brand-900 font-bold text-xs shadow"
              >
                Enquire
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-slate-200 hover:text-white hover:bg-brand-800"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand-800 border-t border-brand-600/40 px-4 pt-3 pb-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-4 py-2.5 rounded-lg text-base font-medium ${isActive(item.href)
                  ? 'bg-brand-700 text-yellow-400 font-semibold'
                  : 'text-slate-200 hover:bg-brand-700/60'
                  }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t border-brand-600/40 flex flex-col gap-3">
              <a
                href="tel:+919946284615"
                className="flex items-center gap-3 px-4 py-2 rounded-lg bg-brand-900/60 text-yellow-400 text-sm font-medium"
              >
                <Phone className="w-4 h-4 text-yellow-400" />
                +91 99462 84615 (7 AM - 8 PM)
              </a>
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="px-4 py-2 text-xs text-emerald-300 hover:text-white text-center font-medium"
              >
                Staff / Admin Portal Login →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Reusable Global Enquiry Modal */}
      <EnquireModal isOpen={isEnquireOpen} onClose={() => setIsEnquireOpen(false)} />
    </>
  );
}
