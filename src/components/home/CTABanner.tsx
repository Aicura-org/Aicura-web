'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import EnquireModal from '../ui/EnquireModal';

export default function CTABanner() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* CTA Banner */}
          <div
            className="relative rounded-3xl overflow-hidden shadow-2xl min-h-[360px] sm:min-h-[400px] bg-cover bg-center lg:bg-[center_right]"
            style={{
              backgroundImage: "url('/Modern Clinic Cta Banner.png')",
            }}
          >

            {/* Background Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/90 via-brand-900/65 to-transparent"></div>

            {/* Soft Teal Glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 min-h-[360px] sm:min-h-[400px]">

              {/* Left Column Text */}
              <div className="lg:col-span-7 space-y-4 text-white p-8 sm:p-12">

                {/* Small Label */}
                <span className="text-yellow-400 text-[11px] md:text-xs font-bold uppercase tracking-widest block">
                  START YOUR WELLNESS JOURNEY
                </span>

                {/* Heading */}
                <h2 className="text-xl sm:text-3xl font-bold font-sans tracking-tight leading-snug">
                  Take the Next Step Towards a{' '}
                  <span className="text-yellow-400">
                    Healthier You
                  </span>
                </h2>

                {/* Description */}
                <p className="text-slate-200 text-sm max-w-xl">
                  Book a test, choose a curated health package, or get in
                  touch with our expert medical team today.
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap items-center gap-4 pt-4">

                  {/* Enquire Button */}
                  <button
                    onClick={() => setModalOpen(true)}
                    className="px-6 py-3.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-sm rounded-full shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                  >
                    Enquire Now
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Contact Button */}
                  <Link
                    href="/contact"
                    className="px-6 py-3.5 bg-brand-800/80 hover:bg-brand-600 text-white font-semibold text-sm rounded-full transition-all hover:scale-105"
                  >
                    Contact Us
                  </Link>

                </div>
              </div>

              {/* Right Column Graphic */}
              <div className="lg:col-span-5 relative">
                {/* 
                  The image is already applied as the
                  background of the complete CTA banner.
                  Keeping this column maintains your
                  original grid structure.
                */}
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