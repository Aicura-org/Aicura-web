'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  FlaskConical, 
  AlertCircle, 
  Home, 
  Search, 
  ShieldCheck, 
  ArrowRight
} from 'lucide-react';
import { PackageItem } from '@/types';

interface PackageDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  pkg: PackageItem | null;
  onEnquire?: (pkg: PackageItem) => void;
}

export default function PackageDetailsModal({
  isOpen,
  onClose,
  pkg,
  onEnquire,
}: PackageDetailsModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Reset search when modal opens or package changes
  useEffect(() => {
    setSearchTerm('');
  }, [pkg, isOpen]);

  if (!isOpen || !pkg) return null;

  const defaultImages: Record<string, string> = {
    'Full Body Checkup': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
    'Senior Care': 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600',
    'Specialized Care': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
    'Vitamins & Hormones': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
  };

  const bgImg = pkg.imageUrl || defaultImages[pkg.category] || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600';
  const savings = Math.max(0, pkg.originalPrice - pkg.discountedPrice);
  const discountPercent = pkg.originalPrice > 0 
    ? Math.round((savings / pkg.originalPrice) * 100) 
    : 0;

  const filteredTests = (pkg.includedTests || []).filter((test) =>
    test.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden relative animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Header with Background/Image banner */}
        <div className="relative bg-brand-900 text-white p-6 sm:p-7 shrink-0 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/15 rounded-full blur-2xl pointer-events-none" />
          
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-20"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="relative z-10 space-y-2.5 pr-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-bold text-yellow-400 uppercase bg-yellow-400/15 border border-yellow-400/30 px-2.5 py-0.5 rounded-full inline-block">
                {pkg.category}
              </span>
              {pkg.badgeText && (
                <span className="text-[10px] font-extrabold text-brand-950 uppercase bg-yellow-400 px-2.5 py-0.5 rounded-full shadow">
                  {pkg.badgeText}
                </span>
              )}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold font-sans text-white leading-tight">
              {pkg.title}
            </h2>

            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed max-w-xl">
              {pkg.description}
            </p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 divide-y divide-slate-100">
          
          {/* Key Info Highlight Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col items-center text-center">
              <FlaskConical className="w-5 h-5 text-emerald-600 mb-1.5" />
              <span className="text-xs font-bold text-slate-900">{pkg.testCount}+ Tests</span>
              <span className="text-[10px] text-slate-500">Parameters Covered</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col items-center text-center">
              <Home className="w-5 h-5 text-brand-700 mb-1.5" />
              <span className="text-xs font-bold text-slate-900">Doorstep</span>
              <span className="text-[10px] text-slate-500">Free Home Collection</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col items-center text-center">
              <Clock className="w-5 h-5 text-blue-600 mb-1.5" />
              <span className="text-xs font-bold text-slate-900">Within 24h</span>
              <span className="text-[10px] text-slate-500">Digital Report</span>
            </div>

            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 flex flex-col items-center text-center">
              <ShieldCheck className="w-5 h-5 text-amber-600 mb-1.5" />
              <span className="text-xs font-bold text-slate-900">NABL Aligned</span>
              <span className="text-[10px] text-slate-500">Doctor Verified</span>
            </div>
          </div>

          {/* Preparation Instructions (if any) */}
          {pkg.preparation && (
            <div className="pt-5">
              <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/90 text-amber-900">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs space-y-0.5">
                  <span className="font-bold text-amber-950 block">Sample Preparation & Fasting Instructions:</span>
                  <p className="text-amber-900/90 leading-relaxed">{pkg.preparation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Key Benefits (if any) */}
          {pkg.benefits && pkg.benefits.length > 0 && (
            <div className="pt-5 space-y-2.5">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Why Choose This Package:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {pkg.benefits.map((benefit, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Included Tests List with Quick Search */}
          <div className="pt-5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Included Tests & Parameters ({pkg.includedTests.length})
              </h3>
              
              {pkg.includedTests.length > 5 && (
                <div className="relative w-full sm:w-56">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search test..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-8 pr-3 py-1 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-brand-700 bg-slate-50"
                  />
                </div>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto pr-1 space-y-1.5 custom-scrollbar">
              {filteredTests.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400">
                  No tests found matching &quot;{searchTerm}&quot;
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredTests.map((test, index) => (
                    <div 
                      key={index} 
                      className="flex items-start gap-2 p-2.5 bg-slate-50 hover:bg-emerald-50/50 border border-slate-200/70 rounded-xl transition-colors text-xs text-slate-800"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium leading-tight">{test}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Sticky Footer with Pricing & Booking CTA */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-baseline gap-2.5">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold block">All Inclusive Price</span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-brand-700 font-sans">
                  ₹{pkg.discountedPrice.toLocaleString('en-IN')}
                </span>
                {pkg.originalPrice > pkg.discountedPrice && (
                  <span className="text-xs text-slate-400 line-through font-medium">
                    ₹{pkg.originalPrice.toLocaleString('en-IN')}
                  </span>
                )}
              </div>
            </div>

            {discountPercent > 0 && (
              <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200">
                Save ₹{savings.toLocaleString('en-IN')} ({discountPercent}% OFF)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-3 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-xl transition-colors"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onEnquire) {
                  onEnquire(pkg);
                }
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-xs rounded-xl shadow transition-all hover:scale-105 active:scale-95"
            >
              <span>Enquire & Book Package</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
