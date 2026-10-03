'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2, Eye } from 'lucide-react';
import { PackageItem } from '@/types';
import EnquireModal from '../ui/EnquireModal';
import PackageDetailsModal from '../ui/PackageDetailsModal';

const INITIAL_COUNT = 4;

export default function PopularPackages() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);
  const [detailPkg, setDetailPkg] = useState<PackageItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    async function fetchPackages() {
      try {
        const res = await fetch('/api/packages?isPopular=true');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setPackages(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load popular packages', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPackages();
  }, []);

  const handleEnquire = (pkg: PackageItem) => {
    setSelectedPkg(pkg);
    setIsModalOpen(true);
  };

  const handleViewDetails = (pkg: PackageItem) => {
    setDetailPkg(pkg);
    setIsDetailModalOpen(true);
  };

  const defaultImages: Record<string, string> = {
    'Full Body Checkup': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400',
    'Senior Care': 'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=400',
    'Specialized Care': 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=400',
    'Vitamins & Hormones': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
  };

  const visiblePackages = packages.slice(0, INITIAL_COUNT);

  return (
    <>
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-5 md:mb-8">
            <div>
              <span className="text-brand-700 text-[11px] md:text-xs font-bold tracking-wider uppercase block mb-1">
                PACKAGES FOR A HEALTHIER YOU
              </span>
              <h2 className="text-xl sm:text-3xl font-bold text-black font-sans tracking-tight leading-snug">
                Popular Health Packages
              </h2>
              <p className="text-slate-600 text-sm mt-2 md:mt-1">
                Comprehensive health checkups tailored for every stage of life.
              </p>
            </div>
            <Link
              href="/packages"
              className="hidden md:inline-flex items-center gap-2 text-brand-700 hover:text-brand-800 font-bold text-sm group"
            >
              View All Packages
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Package Cards Grid */}
          {loading ? (
            <div className="py-12 flex justify-center text-slate-400 text-xs items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-brand-700" /> Loading packages...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5">
                {visiblePackages.map((pkg) => {
                  const bgImg =
                    pkg.imageUrl ||
                    defaultImages[pkg.category] ||
                    'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400';
                  const discount =
                    pkg.originalPrice > pkg.discountedPrice
                      ? Math.round((1 - pkg.discountedPrice / pkg.originalPrice) * 100)
                      : 0;

                  return (
                    <div
                      key={pkg.id}
                      className="bg-white rounded-2xl sm:rounded-3xl overflow-hidden ring-1 ring-slate-100 shadow-[0_2px_16px_rgba(15,23,42,0.06)] hover:shadow-[0_14px_36px_rgba(15,23,42,0.12)] transition-all duration-300 flex flex-col group sm:hover:-translate-y-1"
                    >
                      {/* Image: full bleed, no padding */}
                      <div
                        onClick={() => handleViewDetails(pkg)}
                        className="relative w-full h-36 sm:h-52 shrink-0 overflow-hidden bg-slate-200 cursor-pointer"
                      >
                        <Image
                          src={bgImg}
                          alt={pkg.title}
                          fill
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-transparent" />

                        <div className="absolute bottom-2 left-2 bg-white/95 text-emerald-700 text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
                          {pkg.testCount}+ Tests
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex flex-col flex-1 min-w-0 p-2.5 sm:p-4">
                        <h3
                          onClick={() => handleViewDetails(pkg)}
                          className="text-[13px] font-semibold sm:text-base sm:font-bold text-slate-900 leading-snug line-clamp-2 min-h-[2.25rem] sm:min-h-0 group-hover:text-brand-700 transition-colors cursor-pointer"
                        >
                          {pkg.title}
                        </h3>
                        <p className="text-slate-500 text-[10px] sm:text-xs leading-snug mt-1 line-clamp-2">
                          {pkg.description}
                        </p>

                        <div className="mt-auto pt-2.5 sm:pt-3">
                          {/* Price: normal weight */}
                          <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mb-2.5 sm:mb-3">
                            <span className="text-[15px] sm:text-xl font-medium text-brand-700 font-sans leading-none">
                              ₹{pkg.discountedPrice.toLocaleString('en-IN')}
                            </span>
                            {discount > 0 && (
                              <>
                                <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                                  ₹{pkg.originalPrice.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[9px] sm:text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded-md">
                                  {discount}% OFF
                                </span>
                              </>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEnquire(pkg)}
                              className="flex-1 py-2 sm:py-2.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-semibold sm:font-bold text-[11px] sm:text-xs rounded-full shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                            >
                              Enquire Now
                            </button>
                            <button
                              type="button"
                              onClick={() => handleViewDetails(pkg)}
                              aria-label="View details"
                              title="View details"
                              className="w-8 h-8 sm:w-9 sm:h-9 shrink-0 rounded-full border border-slate-200 text-slate-500 hover:border-brand-700 hover:bg-brand-700 hover:text-white flex items-center justify-center transition-colors"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile only: View All button at bottom */}
              <div className="flex justify-center mt-5 md:hidden">
                <Link
                  href="/packages"
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-brand-700 text-brand-700 active:bg-brand-700 active:text-white font-semibold text-xs transition-colors"
                >
                  View All Packages
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </>
          )}

        </div>
      </section>

      {/* Full Package Details Modal */}
      <PackageDetailsModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        pkg={detailPkg}
        onEnquire={(pkg) => {
          setIsDetailModalOpen(false);
          handleEnquire(pkg);
        }}
      />

      {/* Enquiry Modal */}
      <EnquireModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTestOrPackage={selectedPkg ? selectedPkg.title : ''}
        defaultPackageId={selectedPkg ? selectedPkg.id : undefined}
        defaultType="package"
      />
    </>
  );
}