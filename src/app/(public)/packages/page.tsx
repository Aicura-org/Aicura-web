'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import EnquireModal from '@/components/ui/EnquireModal';
import PackageDetailsModal from '@/components/ui/PackageDetailsModal';
import { PackageItem } from '@/types';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

export default function PackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);
  const [detailModalPkg, setDetailModalPkg] = useState<PackageItem | null>(null);
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);

  useEffect(() => {
    async function loadPackages() {
      try {
        const res = await fetch('/api/packages');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setPackages(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load packages', err);
      } finally {
        setLoading(false);
      }
    }
    loadPackages();
  }, []);

  const handleEnquire = (pkg: PackageItem) => {
    setSelectedPkg(pkg);
    setIsEnquireOpen(true);
  };

  const defaultImages: Record<string, string> = {
    'Full Body Checkup': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
    'Senior Care': 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600',
    'Specialized Care': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
    'Vitamins & Hormones': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Banner */}
      <section className="relative w-full h-[50vh] min-h-[250px] bg-white border-b border-slate-200 shadow-sm overflow-hidden flex items-center">
        <Image
          src="/campaigns-packages-banner.webp"
          alt="Comprehensive Health Packages - AiCura Diagnostics"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center w-full h-full"
        />
        {/* Heading Overlay on Top of Image - Left Aligned with Black Text */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl space-y-3 text-left">
              <span className="inline-flex items-center gap-1.5 text-black bg-yellow-400 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-black" /> Preventative Diagnostic Care
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight">
                Comprehensive Health Packages
              </h1>
              <p className="text-slate-800 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
                Choose from doctor-curated checkup packages designed for every age group and wellness need. Includes free home sample collection!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Packages Listing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-brand-700 animate-spin" />
            <p className="text-xs font-semibold">Fetching latest health packages...</p>
          </div>
        ) : packages.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No health packages available at the moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => {
              const bgImg = pkg.imageUrl || defaultImages[pkg.category] || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600';
              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  <div>
                    {/* Image Container */}
                    <div 
                      onClick={() => setDetailModalPkg(pkg)}
                      className="relative h-48 w-full bg-slate-200 overflow-hidden cursor-pointer"
                    >
                      <Image
                        src={bgImg}
                        alt={pkg.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="bg-brand-700 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full shadow">
                          {pkg.testCount}+ Parameters Covered
                        </span>
                      </div>
                      {pkg.badgeText && (
                        <div className="absolute top-4 right-4">
                          <span className="bg-yellow-400 text-brand-900 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow uppercase">
                            {pkg.badgeText}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md">
                          {pkg.category}
                        </span>
                        <span className="text-xs text-slate-400 font-medium">Home Sample Included</span>
                      </div>

                      <h2 
                        onClick={() => setDetailModalPkg(pkg)}
                        className="text-xl font-bold text-slate-900 group-hover:text-brand-700 transition-colors cursor-pointer"
                      >
                        {pkg.title}
                      </h2>

                      <p className="text-slate-600 text-xs leading-relaxed">
                        {pkg.description}
                      </p>

                      {/* Included Tests Preview */}
                      <div className="pt-2">
                        <span className="text-xs font-bold text-slate-700 block mb-2">Key Tests Included:</span>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {pkg.includedTests.slice(0, 4).map((testName, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <span>{testName}</span>
                            </li>
                          ))}
                        </ul>
                        {pkg.includedTests.length > 4 && (
                          <button
                            type="button"
                            onClick={() => setDetailModalPkg(pkg)}
                            className="text-xs text-brand-700 hover:text-brand-900 font-bold mt-2 flex items-center gap-1"
                          >
                            + View all {pkg.includedTests.length} tests →
                          </button>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Footer Pricing & CTA */}
                  <div className="p-6 pt-0 space-y-3">
                    <div className="flex items-baseline justify-between border-t border-slate-100 pt-4">
                      <div>
                        <span className="text-xs text-slate-400 block">Package Price</span>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-brand-700">
                            ₹{pkg.discountedPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ₹{pkg.originalPrice.toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        Save ₹{(pkg.originalPrice - pkg.discountedPrice).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setDetailModalPkg(pkg)}
                        className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors"
                      >
                        Details & Tests
                      </button>
                      <button
                        type="button"
                        onClick={() => handleEnquire(pkg)}
                        className="w-full py-3 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-xs rounded-xl shadow transition-transform hover:scale-105"
                      >
                        Book Package →
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
      {/* Package Details Modal */}
      <PackageDetailsModal
        isOpen={Boolean(detailModalPkg)}
        onClose={() => setDetailModalPkg(null)}
        pkg={detailModalPkg}
        onEnquire={(pkg) => {
          setDetailModalPkg(null);
          handleEnquire(pkg);
        }}
      />

      {/* Enquire Modal */}
      <EnquireModal
        isOpen={isEnquireOpen}
        onClose={() => setIsEnquireOpen(false)}
        defaultTestOrPackage={selectedPkg ? selectedPkg.title : ''}
        defaultPackageId={selectedPkg ? selectedPkg.id : undefined}
        defaultType="package"
      />
    </div>
  );
}
