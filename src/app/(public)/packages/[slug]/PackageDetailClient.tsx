'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ArrowLeft, 
  CheckCircle2, 
  FlaskConical, 
  Home, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  Search, 
  Share2, 
  Check, 
  PhoneCall, 
  MessageCircle, 
  Sparkles,
  ArrowRight,
  CalendarCheck
} from 'lucide-react';
import { PackageItem } from '@/types';
import EnquireModal from '@/components/ui/EnquireModal';

interface PackageDetailClientProps {
  pkg: PackageItem;
  relatedPackages: PackageItem[];
  whatsappNumber?: string;
}

export default function PackageDetailClient({
  pkg,
  relatedPackages,
  whatsappNumber = '919847986333',
}: PackageDetailClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const defaultImages: Record<string, string> = {
    'Full Body Checkup': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800',
    'Senior Care': 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=800',
    'Specialized Care': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=800',
    'Vitamins & Hormones': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=800',
  };

  const bgImg = pkg.imageUrl || defaultImages[pkg.category] || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800';
  const savings = Math.max(0, pkg.originalPrice - pkg.discountedPrice);
  const discountPercent = pkg.originalPrice > 0 ? Math.round((savings / pkg.originalPrice) * 100) : 0;

  const filteredTests = (pkg.includedTests || []).filter((test) =>
    test.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const shareData = {
      title: `${pkg.title} | AiCura Diagnostics`,
      text: `Check out ${pkg.title} package at ₹${pkg.discountedPrice} with free home sample collection!`,
      url: shareUrl,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // User cancelled or unsupported, fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const sanitizedPhone = whatsappNumber.replace(/\D/g, '');
  const whatsappMsg = encodeURIComponent(
    `Hello AiCura Diagnostics, I am interested in booking the *${pkg.title}* package (₹${pkg.discountedPrice.toLocaleString('en-IN')}). Could you please share available slots for home sample collection?`
  );
  const whatsappUrl = `https://wa.me/${sanitizedPhone}?text=${whatsappMsg}`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pb-20">
      
      {/* Top Breadcrumb Navigation */}
      <div className="bg-white border-b border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 overflow-hidden truncate">
            <Link href="/" className="hover:text-brand-700 shrink-0">Home</Link>
            <span>/</span>
            <Link href="/packages" className="hover:text-brand-700 shrink-0">Health Packages</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800 truncate">{pkg.title}</span>
          </nav>

          <Link
            href="/packages"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900 shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Packages
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Main Hero Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left Image Section */}
            <div className="relative h-64 sm:h-80 lg:h-auto lg:col-span-5 bg-slate-100 overflow-hidden">
              <Image
                src={bgImg}
                alt={pkg.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:hidden" />
              
              <div className="absolute top-4 left-4 flex flex-wrap gap-2 z-10">
                <span className="bg-brand-700 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full shadow">
                  {pkg.testCount}+ Parameters Covered
                </span>
                {pkg.badgeText && (
                  <span className="bg-yellow-400 text-brand-950 text-xs font-extrabold px-3 py-1 rounded-full shadow uppercase">
                    {pkg.badgeText}
                  </span>
                )}
              </div>
            </div>

            {/* Right Details & Booking CTA Section */}
            <div className="p-6 sm:p-8 lg:p-10 lg:col-span-7 flex flex-col justify-between space-y-6">
              
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full uppercase tracking-wider">
                    {pkg.category}
                  </span>

                  <button
                    onClick={handleShare}
                    type="button"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
                    title="Share Package Link"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-bold">Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-500" />
                        <span>Share Package</span>
                      </>
                    )}
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                  {pkg.title}
                </h1>

                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  {pkg.description}
                </p>
              </div>

              {/* Price & CTA Action Panel */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-slate-200/70 pb-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-medium">All Inclusive Offer Price</span>
                    <div className="flex items-baseline gap-3 mt-0.5">
                      <span className="text-3xl sm:text-4xl font-black text-brand-700">
                        ₹{pkg.discountedPrice.toLocaleString('en-IN')}
                      </span>
                      {pkg.originalPrice > pkg.discountedPrice && (
                        <span className="text-base sm:text-lg text-slate-400 line-through">
                          ₹{pkg.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  {savings > 0 && (
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-xl">
                      Save ₹{savings.toLocaleString('en-IN')} ({discountPercent}% OFF)
                    </span>
                  )}
                </div>

                {/* Booking Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsEnquireOpen(true)}
                    className="w-full py-3.5 px-6 gold-gradient hover:gold-gradient-hover text-brand-900 font-extrabold text-sm rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <CalendarCheck className="w-4 h-4" />
                    <span>Book Package Now</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 px-6 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Enquire on WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 font-medium pt-1">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Free Sample Collection
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Digital WhatsApp Reports
                  </span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* 4 Key Pillar Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center shadow-sm">
            <FlaskConical className="w-6 h-6 text-emerald-600 mb-2" />
            <span className="text-sm font-bold text-slate-900">{pkg.testCount}+ Parameters</span>
            <span className="text-xs text-slate-500 mt-0.5">Comprehensive Evaluation</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center shadow-sm">
            <Home className="w-6 h-6 text-brand-700 mb-2" />
            <span className="text-sm font-bold text-slate-900">Doorstep Pickup</span>
            <span className="text-xs text-slate-500 mt-0.5">Free Home Sample Collection</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center shadow-sm">
            <Clock className="w-6 h-6 text-blue-600 mb-2" />
            <span className="text-sm font-bold text-slate-900">Within 24 Hours</span>
            <span className="text-xs text-slate-500 mt-0.5">Prompt Digital PDF Reports</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-5 flex flex-col items-center text-center shadow-sm">
            <ShieldCheck className="w-6 h-6 text-amber-600 mb-2" />
            <span className="text-sm font-bold text-slate-900">Quality Verified</span>
            <span className="text-xs text-slate-500 mt-0.5">Senior Pathologist Approved</span>
          </div>
        </div>

        {/* Preparation Guidelines */}
        {pkg.preparation && (
          <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-5 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
                Sample Preparation &amp; Fasting Instructions:
              </h3>
              <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-medium">
                {pkg.preparation}
              </p>
            </div>
          </div>
        )}

        {/* Benefits & Why Choose Section */}
        {pkg.benefits && pkg.benefits.length > 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-700" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Why Choose This Package?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2">
              {pkg.benefits.map((benefit, i) => (
                <div 
                  key={i} 
                  className="flex items-start gap-3 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs sm:text-sm text-slate-700 font-medium"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Included Tests & Parameters with Search Filter */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Included Tests &amp; Parameters ({pkg.includedTests.length})
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                All parameters tested with automated clinical analyzers for 99.8% precision.
              </p>
            </div>

            {pkg.includedTests.length > 4 && (
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search parameter (e.g. CBC, Sugar)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700/20 focus:border-brand-700 bg-slate-50"
                />
              </div>
            )}
          </div>

          {filteredTests.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 space-y-2">
              <p>No tests matching &quot;{searchTerm}&quot; found in this package.</p>
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="text-brand-700 font-bold hover:underline"
              >
                Clear search
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredTests.map((test, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2.5 p-3.5 bg-slate-50 hover:bg-emerald-50/40 border border-slate-200/70 rounded-xl transition-colors text-xs font-medium text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-snug">{test}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* How Home Collection Works */}
        <div 
          style={{ backgroundColor: '#082222' }}
          className="bg-gradient-to-br from-brand-900 via-brand-800 to-[#0a2726] text-white rounded-3xl p-6 sm:p-10 space-y-6 shadow-xl border border-brand-700/60 overflow-hidden relative"
        >
          {/* Decorative background glow */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-xl space-y-2 relative z-10">
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider bg-yellow-400/15 border border-yellow-400/30 px-3 py-1 rounded-full inline-block">
              Convenient &amp; Safe
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              How Doorstep Sample Collection Works
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm font-normal">
              We bring clinical laboratory standards directly to the comfort of your home.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 relative z-10">
            <div 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)' }}
              className="backdrop-blur-sm rounded-2xl p-5 space-y-2 border border-white/15 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-brand-950 font-black flex items-center justify-center text-sm shadow">
                1
              </div>
              <h3 className="font-bold text-sm text-white">Book Online or WhatsApp</h3>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Choose your package, pick a convenient time slot and share your address.
              </p>
            </div>

            <div 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)' }}
              className="backdrop-blur-sm rounded-2xl p-5 space-y-2 border border-white/15 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-brand-950 font-black flex items-center justify-center text-sm shadow">
                2
              </div>
              <h3 className="font-bold text-sm text-white">Trained Phlebotomist Visits</h3>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Certified sample collection professional arrives equipped with sterile vacutainers.
              </p>
            </div>

            <div 
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.07)' }}
              className="backdrop-blur-sm rounded-2xl p-5 space-y-2 border border-white/15 shadow-sm"
            >
              <div className="w-8 h-8 rounded-full bg-yellow-400 text-brand-950 font-black flex items-center justify-center text-sm shadow">
                3
              </div>
              <h3 className="font-bold text-sm text-white">Fast Digital Reports</h3>
              <p className="text-xs text-slate-200 leading-relaxed font-normal">
                Samples are analyzed on automated robotic systems. Verified reports arrive via WhatsApp.
              </p>
            </div>
          </div>
        </div>

        {/* Other Related Packages */}
        {relatedPackages.length > 0 && (
          <div className="space-y-6 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Explore Other Health Packages
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Tailored preventive health profiles for every member of your family.
                </p>
              </div>

              <Link
                href="/packages"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 hover:text-brand-900"
              >
                <span>View All</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPackages.map((rel) => {
                const relImg = rel.imageUrl || defaultImages[rel.category] || bgImg;
                return (
                  <Link
                    key={rel.id}
                    href={`/packages/${rel.slug}`}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all hover:-translate-y-1 group flex flex-col justify-between"
                  >
                    <div>
                      <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                        <Image
                          src={relImg}
                          alt={rel.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="bg-brand-700 text-yellow-400 text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow">
                            {rel.testCount}+ Tests
                          </span>
                        </div>
                      </div>

                      <div className="p-5 space-y-2">
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md uppercase">
                          {rel.category}
                        </span>
                        <h3 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2 text-sm sm:text-base">
                          {rel.title}
                        </h3>
                        <p className="text-slate-500 text-xs line-clamp-2">
                          {rel.description}
                        </p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 border-t border-slate-100 mt-2 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block">Package Price</span>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-lg font-black text-brand-700">
                            ₹{rel.discountedPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{rel.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      <span className="text-xs font-bold text-brand-700 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                        View Details →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Floating Bottom Bar on Mobile for quick booking */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 p-3 px-4 shadow-2xl flex items-center justify-between gap-3">
        <div>
          <span className="text-[10px] text-slate-400 block font-medium leading-none">Price</span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-xl font-black text-brand-700">
              ₹{pkg.discountedPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-400 line-through">
              ₹{pkg.originalPrice.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Enquire on WhatsApp"
            className="w-10 h-10 rounded-xl bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow"
          >
            <MessageCircle className="w-5 h-5" />
          </a>

          <button
            type="button"
            onClick={() => setIsEnquireOpen(true)}
            className="px-5 py-2.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-extrabold text-xs rounded-xl shadow cursor-pointer"
          >
            Book Package
          </button>
        </div>
      </div>

      {/* Enquire Modal */}
      <EnquireModal
        isOpen={isEnquireOpen}
        onClose={() => setIsEnquireOpen(false)}
        defaultTestOrPackage={pkg.title}
        defaultPackageId={pkg.id}
        defaultType="package"
      />

    </div>
  );
}
