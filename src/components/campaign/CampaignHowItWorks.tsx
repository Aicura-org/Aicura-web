'use client';

import React from 'react';
import { Phone, Headphones, Home, FileText } from 'lucide-react';

interface StepItem {
  num: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const STEPS: StepItem[] = [
  {
    num: '01',
    title: 'Enquire Online',
    description: 'Fill in the form with your details.',
    icon: <Phone className="w-6 h-6 text-[#0d7a54]" />,
  },
  {
    num: '02',
    title: 'Our Team Calls You',
    description: 'Our executive will confirm the details.',
    icon: <Headphones className="w-6 h-6 text-[#0d7a54]" />,
  },
  {
    num: '03',
    title: 'Home Sample Collection',
    description: 'Our trained staff will visit your home.',
    icon: <Home className="w-6 h-6 text-[#0d7a54]" />,
  },
  {
    num: '04',
    title: 'Get Your Reports',
    description: 'Receive digital reports within 24 hours.',
    icon: <FileText className="w-6 h-6 text-[#0d7a54]" />,
  },
];

export function CampaignHowItWorks() {
  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-6 sm:mb-10">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight font-sans">
            How It Works?
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Book your senior health checkup in just a few simple steps.
          </p>
        </div>

        {/* Content Layout: 4 Steps on Left, Photo on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-center">
          
          {/* Left: 4 Steps (7 cols on lg) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-4 relative">
              {STEPS.map((step, idx) => (
                <div key={idx} className="relative flex flex-col items-start">
                  
                  {/* Step Number Circle Badge + Dotted Line Header */}
                  <div className="w-full flex items-center justify-between relative mb-2.5 sm:mb-3">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#00897b] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-2xs">
                      {step.num}
                    </div>

                    {/* Dotted Arrow Connector (desktop & tablet between steps) */}
                    {idx < STEPS.length - 1 && (
                      <div className="hidden sm:flex items-center flex-1 mx-2 text-emerald-400">
                        <div className="border-t-2 border-dotted border-emerald-400/80 w-full" />
                        <span className="text-emerald-500 text-xs -ml-1">▸</span>
                      </div>
                    )}
                  </div>

                  {/* Mint Circular Icon Container */}
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#e8f7f2] flex items-center justify-center mb-2.5 sm:mb-3 shrink-0">
                    {step.icon}
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xs sm:text-sm font-bold text-slate-900 mb-1 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Phlebotomist Blood Draw Photo with Handwritten Script (5 cols on lg) */}
          <div className="lg:col-span-5 relative flex justify-center lg:justify-end mt-4 lg:mt-0">
            <div className="relative w-full max-w-[340px] sm:max-w-[420px]">
              
              {/* Handwritten Script Overlay */}
              <div className="absolute top-3 right-4 z-10 text-right pointer-events-none select-none -rotate-6">
                <span className="font-serif italic text-xs sm:text-sm text-slate-800 font-bold leading-tight block drop-shadow-xs">
                  Safe.
                </span>
                <span className="font-serif italic text-xs sm:text-sm text-slate-800 font-bold leading-tight block drop-shadow-xs">
                  Simple.
                </span>
                <span className="font-serif italic text-xs sm:text-sm text-slate-800 font-bold leading-tight block drop-shadow-xs">
                  At Home.
                </span>
                <span className="text-slate-700 text-xs block mt-0.5 mr-2">♡</span>
              </div>

              {/* Photo Frame */}
              <div className="rounded-3xl overflow-hidden shadow-sm aspect-[4/3] bg-slate-100">
                <img
                  src="/Home Blood Draw in a Bright Living Room.png"
                  alt="Safe. Simple. At Home Sample Collection"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default CampaignHowItWorks;
