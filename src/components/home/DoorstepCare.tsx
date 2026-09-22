'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, Shield, Heart, Award } from 'lucide-react';
import EnquireModal from '../ui/EnquireModal';

export default function DoorstepCare() {
  const [modalOpen, setModalOpen] = useState(false);

  const features = [
    'Trained & verified phlebotomists',
    'Safe & hygienic sample collection',
    'Convenient scheduling at your time slot',
    'Same quality, accurate lab results',
    'Available across selected city locations',
  ];

  return (
    <>
      <section className="py-16 bg-slate-50 border-y border-slate-200/70 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold text-brand-700 tracking-wider uppercase bg-emerald-50 px-3.5 py-1.5 rounded-full inline-block">
                Doorstep Diagnostic Care
              </span>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-sans tracking-tight leading-tight">
                Healthcare that <span className="text-brand-700">comes home.</span>
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                Professional, hassle-free sample collection at your doorstep. Enjoy the comfort of certified phlebotomists delivering accredited clinical precision without leaving your home.
              </p>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-2">
                {features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{feat}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-7 py-3.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-sm rounded-full shadow-lg transition-transform hover:scale-105"
                >
                  Book Home Collection →
                </button>
              </div>
            </div>

            {/* Right Graphic Column with 3 floating feature badges */}
            <div className="lg:col-span-6 relative">
              
              {/* Main Phlebotomist Image */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200 shadow-2xl h-[420px] sm:h-[480px] w-full">
                <Image
                  src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&q=80&w=800"
                  alt="Doctor taking blood sample home collection"
                  fill
                  className="object-cover"
                />

                {/* Floating Badge 1: Top Right */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xl flex items-center gap-3 max-w-xs">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-brand-700 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">Your Health</h4>
                    <span className="text-[11px] text-slate-500">Our Highest Priority</span>
                  </div>
                </div>

                {/* Floating Badge 2: Middle Right */}
                <div className="absolute top-1/2 -translate-y-1/2 right-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xl flex items-center gap-3 max-w-xs">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-brand-700 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">Accurate Results</h4>
                    <span className="text-[11px] text-slate-500">You Can Trust Always</span>
                  </div>
                </div>

                {/* Floating Badge 3: Bottom Right */}
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xl flex items-center gap-3 max-w-xs">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-brand-700 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">Caring For</h4>
                    <span className="text-[11px] text-slate-500">Healthier Lives Daily</span>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Booking Modal */}
      <EnquireModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="home_collection"
      />
    </>
  );
}
