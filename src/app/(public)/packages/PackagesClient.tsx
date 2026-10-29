'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EnquireModal from '@/components/ui/EnquireModal';
import { PackageItem } from '@/types';
import { CheckCircle2 } from 'lucide-react';

interface PackagesClientProps {
  initialPackages: PackageItem[];
}

const defaultImages: Record<string, string> = {
  'Full Body Checkup':
    'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=600',
  'Senior Care':
    'https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&q=80&w=600',
  'Specialized Care':
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&q=80&w=600',
  'Vitamins & Hormones':
    'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600',
};

export default function PackagesClient({ initialPackages }: PackagesClientProps) {
  const [packages] = useState<PackageItem[]>(initialPackages);
  const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);
  const [isEnquireOpen, setIsEnquireOpen] = useState(false);

  const handleEnquire = (pkg: PackageItem) => {
    setSelectedPkg(pkg);
    setIsEnquireOpen(true);
  };

  return (
    <>
      {packages.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Custom Preventive Health Checkup Packages
          </h2>
          <p className="text-slate-600 text-xs max-w-lg mx-auto leading-relaxed">
            Contact our medical team to customize a full body health checkup package with free doorstep blood sample collection.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedPkg(null);
              setIsEnquireOpen(true);
            }}
            className="px-5 py-2.5 gold-gradient text-brand-900 font-bold text-xs rounded-xl shadow hover:scale-105 transition-transform"
          >
            Enquire Now →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const bgImg =
              pkg.imageUrl ||
              defaultImages[pkg.category] ||
              'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=600';
            const packageUrl = `/packages/${pkg.slug}`;
            return (
              <div
                key={pkg.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
              >
                <div>
                  {/* Image Container */}
                  <Link
                    href={packageUrl}
                    className="relative h-48 w-full bg-slate-200 overflow-hidden block"
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
                  </Link>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-md">
                        {pkg.category}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        Home Sample Included
                      </span>
                    </div>

                    <Link href={packageUrl} className="block">
                      <h2 className="text-xl font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                        {pkg.title}
                      </h2>
                    </Link>

                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                      {pkg.description}
                    </p>

                    {/* Included Tests Preview */}
                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-700 block mb-2">
                        Key Tests Included:
                      </span>
                      <ul className="space-y-1.5 text-xs text-slate-600">
                        {pkg.includedTests.slice(0, 4).map((testName, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span className="line-clamp-1">{testName}</span>
                          </li>
                        ))}
                      </ul>
                      {pkg.includedTests.length > 4 && (
                        <Link
                          href={packageUrl}
                          className="text-xs text-brand-700 hover:text-brand-900 font-bold mt-2 inline-flex items-center gap-1"
                        >
                          + View all {pkg.includedTests.length} tests →
                        </Link>
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
                    <Link
                      href={packageUrl}
                      className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl transition-colors text-center flex items-center justify-center"
                    >
                      Details &amp; Tests
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleEnquire(pkg)}
                      className="w-full py-3 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-xs rounded-xl shadow transition-transform hover:scale-105 cursor-pointer"
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

      {/* Enquire Modal */}
      <EnquireModal
        isOpen={isEnquireOpen}
        onClose={() => setIsEnquireOpen(false)}
        defaultTestOrPackage={selectedPkg ? selectedPkg.title : ''}
        defaultPackageId={selectedPkg ? selectedPkg.id : undefined}
        defaultType="package"
      />
    </>
  );
}

