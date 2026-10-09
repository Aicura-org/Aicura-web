'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Phone, Menu, X, Clock, Mail } from 'lucide-react';
import EnquireModal from '../ui/EnquireModal';
import WhatsAppBtn from './WhatsAppBtn';

interface CompanyInfo {
  workingHours: string | null;
  whatsappNumber: string | null;
  email: string | null;
}

export default function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo | null>(null);

  useEffect(() => {
    fetch('/api/company-details?primary=true')
      .then((r) => r.ok ? r.json() : null)
      .then((json) => {
        if (json?.success && json?.data) {
          const d = json.data;
          setCompanyInfo({
            workingHours: d.workingHours || null,
            whatsappNumber: d.whatsappNumber || null,
            email: d.email || null,
          });
        }
      })
      .catch(() => {});
  }, []);

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Tests & Services', href: '/tests-services' },
    { label: 'Health Packages', href: '/packages' },
    { label: 'Home Collection', href: '/home-collection' },
    { label: 'About Us', href: '/about' },
    { label: 'Campaigns', href: '/campaigns' },
    { label: 'Gallery', href: '/gallery' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && pathname === '/') return true;
    if (href !== '/' && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      {/* Fixed header wrapper */}
      <div className="fixed top-0 left-0 right-0 z-40">

        {/* Top Info Bar */}
        {companyInfo && (
          <div className="w-full bg-brand-800 border-b border-brand-700/60 text-white text-[11px]">

            {/* MOBILE: continuous marquee ticker */}
            <div className="sm:hidden overflow-hidden py-1.5">
              <div className="flex whitespace-nowrap" style={{ animation: 'marquee 12s linear infinite' }}>
                {/* Duplicate content for seamless loop */}
                {[0, 1].map((i) => (
                  <span key={i} className="flex items-center gap-4 px-6 shrink-0">
                    {companyInfo.workingHours && (
                      <span className="flex items-center gap-1.5 text-emerald-200/80">
                        <Clock className="w-3 h-3 text-yellow-400/80 shrink-0" />
                        <span>{companyInfo.workingHours}</span>
                      </span>
                    )}
                    <span className="text-brand-600">•</span>
                    {companyInfo.whatsappNumber && (
                      <span className="flex items-center gap-1.5 text-emerald-300">
                        <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                        <span className="font-medium">{companyInfo.whatsappNumber}</span>
                      </span>
                    )}
                    {companyInfo.email && (
                      <>
                        <span className="text-brand-600">•</span>
                        <span className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3 h-3 shrink-0" />
                          <span>{companyInfo.email}</span>
                        </span>
                      </>
                    )}
                  </span>
                ))}
              </div>
              <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
            </div>

            {/* DESKTOP sm+: static layout */}
            <div className="hidden sm:flex max-w-7xl mx-auto px-4 lg:px-6 items-center justify-between py-1.5 gap-2">
              {companyInfo.workingHours && (
                <div className="flex items-center gap-1.5 text-emerald-200/80 shrink-0 min-w-0">
                  <Clock className="w-3.5 h-3.5 text-yellow-400/80 shrink-0" />
                  <span className="truncate">{companyInfo.workingHours}</span>
                </div>
              )}
              <div className="flex items-center gap-3 ml-auto shrink-0">
                {companyInfo.whatsappNumber && (
                  <a
                    href={`https://wa.me/${companyInfo.whatsappNumber.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors"
                  >
                    <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                    <span className="font-medium">{companyInfo.whatsappNumber}</span>
                  </a>
                )}
                {companyInfo.email && (
                  <a
                    href={`mailto:${companyInfo.email}`}
                    className="hidden lg:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{companyInfo.email}</span>
                  </a>
                )}
              </div>
            </div>

          </div>
        )}

        {/* Main Navbar */}
        <header className="w-full bg-brand-700 text-white shadow-md">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
            <div className="flex items-center justify-between h-20">

              {/* Logo */}
              <Link href="/" className="flex items-center group">
                <img
                  src="/logo.webp"
                  alt="AiCura Diagnostics"
                  className="h-9 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform"
                />
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-2">
                {navItems.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-2 xl:px-3 py-2 rounded-md text-[13px] xl:text-sm  transition-colors ${
                        active
                          ? 'text-yellow-400'
                          : 'text-white hover:text-yellow-400 '
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Desktop Right Actions */}
              <div className="hidden sm:flex items-center gap-2 xl:gap-4">
                <a
                  href="tel:+919946284615"
                  className="hidden xl:flex items-center justify-center w-9 h-9 rounded-full bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 transition-all"
                  title="Call us: +91 99462 84615"
                >
                  <Phone className="w-4 h-4" />
                </a>
                <button
                  onClick={() => setIsEnquireOpen(true)}
                  className="px-4 xl:px-5 py-2.5 rounded-full gold-gradient text-brand-900 font-semibold text-[13px] xl:text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-1.5"
                >
                  Enquire Now
                </button>
              </div>

              {/* Mobile Buttons */}
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

          {/* Mobile Drawer */}
          {mobileMenuOpen && (
            <div className="lg:hidden bg-brand-800 border-t border-brand-600/40 px-4 pt-3 pb-6 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-2.5 rounded-lg text-base font-medium ${
                    isActive(item.href)
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
              </div>
            </div>
          )}
        </header>

      </div>

      {/* Spacer so page content isn't hidden behind the fixed header */}
      <div className={`${companyInfo ? 'h-[108px] sm:h-[108px]' : 'h-20'}`} />

      {/* Enquiry Modal */}
      <EnquireModal isOpen={isEnquireOpen} onClose={() => setIsEnquireOpen(false)} />
    </>
  );
}
