'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2, Eye } from 'lucide-react';
import { PackageItem } from '@/types';
import EnquireModal from '../ui/EnquireModal';
import PackageDetailsModal from '../ui/PackageDetailsModal';

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
            setPackages(data.data.slice(0, 5));
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

  return (
    <>
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
            <div>
              <span className="text-brand-700 text-xs font-bold tracking-wider uppercase block mb-1">
                PACKAGES FOR A HEALTHIER YOU
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
                Popular Health Packages
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Comprehensive health checkups tailored for every stage of life.
              </p>
            </div>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 text-brand-700 hover:text-brand-800 font-bold text-sm mt-4 md:mt-0 group"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {packages.map((pkg) => {
                const bgImg = pkg.imageUrl || defaultImages[pkg.category] || 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=400';
                return (
                  <div
                    key={pkg.id}
                    className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    <div>
                      {/* Image Header - Clickable for details */}
                      <div 
                        onClick={() => handleViewDetails(pkg)}
                        className="relative h-40 w-full overflow-hidden bg-slate-200 cursor-pointer"
                        title="Click to view package details"
                      >
                        <Image
                          src={bgImg}
                          alt={pkg.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {pkg.badgeText && (
                          <div className="absolute top-3 left-3 bg-brand-700 text-yellow-400 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow">
                            {pkg.badgeText}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white/95 text-slate-900 text-[11px] font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 backdrop-blur-xs">
                            <Eye className="w-3.5 h-3.5 text-brand-700" /> View Details
                          </span>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 space-y-2">
                        <h3 
                          onClick={() => handleViewDetails(pkg)}
                          className="text-base font-bold text-slate-900 leading-snug group-hover:text-brand-700 transition-colors cursor-pointer"
                        >
                          {pkg.title}
                        </h3>
                        <div className="text-xs font-semibold text-emerald-700 bg-emerald-100/70 inline-block px-2.5 py-0.5 rounded-md">
                          {pkg.testCount}+ Tests
                        </div>
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                          {pkg.description}
                        </p>
                      </div>
                    </div>

                    {/* Pricing & Footer Buttons */}
                    <div className="p-4 pt-0 space-y-3">
                      <div className="flex items-baseline gap-2 border-t border-slate-200 pt-3">
                        <span className="text-xs text-slate-400 line-through font-medium">
                          ₹{pkg.originalPrice.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xl font-extrabold text-brand-700 font-sans">
                          ₹{pkg.discountedPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 gap-2">
                        <button
                          type="button"
                          onClick={() => handleViewDetails(pkg)}
                          className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 hover:text-brand-800 font-semibold text-xs rounded-xl border border-slate-300 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          <span>View Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleEnquire(pkg)}
                          className="w-full py-2.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-xs rounded-xl shadow-sm transition-all hover:scale-[1.02] active:scale-95"
                        >
                          Enquire Now
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
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

