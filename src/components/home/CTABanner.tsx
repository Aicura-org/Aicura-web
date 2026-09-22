'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import EnquireModal from '../ui/EnquireModal';

export default function CTABanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative rounded-3xl hero-gradient overflow-hidden border border-emerald-600/40 shadow-2xl p-8 sm:p-12">
            
            {/* Geometric accents */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              
              {/* Left Column Text */}
              <div className="lg:col-span-7 space-y-4 text-white">
                <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest block">
                  START YOUR WELLNESS JOURNEY
                </span>
                
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-sans tracking-tight leading-tight">
                  Take the Next Step Towards a <span className="text-yellow-400">Healthier You</span>
                </h2>

                <p className="text-slate-200 text-sm sm:text-base max-w-xl">
                  Book a test, choose a curated health package, or get in touch with our expert medical team today.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-4">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-6 py-3.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-sm rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                  >
                    Enquire Now
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <Link
                    href="/contact"
                    className="px-6 py-3.5 bg-brand-800/80 hover:bg-brand-600 text-white font-semibold text-sm rounded-full border border-emerald-500/40 hover:border-yellow-400 transition-all hover:scale-105"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>

              {/* Right Column Graphic */}
              <div className="lg:col-span-5 relative">
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden border-2 border-emerald-500/30 shadow-xl">
                  <Image
                    src="https://images.unsplash.com/photo-1576765608535-5f04d1e3f289?auto=format&fit=crop&q=80&w=800"
                    alt="Healthy family smiling"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-transparent"></div>
                  
                  <div className="absolute bottom-4 left-4 right-4 text-right">
                    <span className="text-yellow-300 font-serif italic text-lg font-bold block drop-shadow-md">
                      Healthy Families, Brighter Tomorrows
                    </span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* Modal */}
      <EnquireModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="test"
      />
    </>
  );
}
