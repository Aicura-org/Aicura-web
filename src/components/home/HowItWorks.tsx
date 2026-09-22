'use client';

import React from 'react';
import { FileEdit, PhoneCall, Syringe, Microchip, FileCheck } from 'lucide-react';

export default function HowItWorks() {
  const steps = [
    {
      step: '01',
      title: 'Submit Enquiry',
      desc: 'Fill in your details online or via WhatsApp',
      icon: FileEdit,
    },
    {
      step: '02',
      title: 'Our Team Contacts You',
      desc: 'We confirm your test & time slot',
      icon: PhoneCall,
    },
    {
      step: '03',
      title: 'Sample Collection',
      desc: 'At your home or lab location',
      icon: Syringe,
    },
    {
      step: '04',
      title: 'Testing at AiCura',
      desc: 'Accurate & reliable clinical testing',
      icon: Microchip,
    },
    {
      step: '05',
      title: 'Get Your Report',
      desc: 'Via Email / WhatsApp within hours',
      icon: FileCheck,
    },
  ];

  return (
    <section className="py-16 bg-emerald-50/50 border-y border-emerald-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block mb-1">
            Simple & Transparent
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
            How it works
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            From enquiry to your report — a simple and hassle-free process.
          </p>
        </div>

        {/* 5 Steps Process Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
          {steps.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center relative group">
                
                {/* Step Circle with Icon */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-white border-2 border-emerald-200 group-hover:border-brand-700 text-brand-700 group-hover:bg-brand-700 group-hover:text-yellow-400 flex items-center justify-center shadow-md transition-all duration-300">
                    <IconComp className="w-7 h-7" />
                  </div>
                  
                  {/* Step number badge */}
                  <span className="absolute -top-2 -right-2 bg-yellow-400 text-brand-900 text-[10px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow border border-white">
                    {item.step}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-brand-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed max-w-[180px]">
                  {item.desc}
                </p>

                {/* Connector Arrow for Desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 -right-4 translate-x-1/2 text-emerald-300 pointer-events-none">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
