'use client';

import React from 'react';
import { Target, HeartHandshake, UserCheck, FileSpreadsheet, Users, Activity, Award, MapPin } from 'lucide-react';

export default function WhyAiCura() {
  const pillars = [
    {
      title: 'Precision',
      subtitle: 'Accurate testing',
      icon: Target,
    },
    {
      title: 'Convenience',
      subtitle: 'Healthcare at your door',
      icon: HeartHandshake,
    },
    {
      title: 'Care',
      subtitle: 'Human support',
      icon: UserCheck,
    },
    {
      title: 'Clarity',
      subtitle: 'Reports you can act on',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <section className="py-16 bg-brand-700 text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Why AiCura intro & 4 Pillars */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider block mb-1">
                OUR COMMITMENT
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-sans tracking-tight">
                Why AiCura?
              </h2>
              <p className="text-slate-200 text-sm mt-1">
                More than a test. A clearer understanding of your health.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {pillars.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="bg-brand-800/80 p-4 rounded-2xl border border-emerald-600/40 flex flex-col items-center text-center hover:border-yellow-400/60 transition-colors"
                  >
                    <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-yellow-400 flex items-center justify-center mb-3">
                      <IconComp className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <span className="text-[11px] text-slate-300 mt-0.5">{item.subtitle}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Key Stats Grid */}
          <div className="lg:col-span-5 bg-brand-800/90 rounded-3xl p-8 border border-emerald-600/50 shadow-2xl">
            <div className="grid grid-cols-2 gap-6">
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Users className="w-5 h-5" />
                  <span className="text-3xl sm:text-4xl font-black font-sans text-white">10,000+</span>
                </div>
                <p className="text-xs font-medium text-slate-300">Happy Customers</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Activity className="w-5 h-5" />
                  <span className="text-3xl sm:text-4xl font-black font-sans text-white">500+</span>
                </div>
                <p className="text-xs font-medium text-slate-300">Tests Available</p>
              </div>

              <div className="space-y-1 border-t border-emerald-700/60 pt-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Award className="w-5 h-5" />
                  <span className="text-3xl sm:text-4xl font-black font-sans text-white">5+</span>
                </div>
                <p className="text-xs font-medium text-slate-300">Years of Service</p>
              </div>

              <div className="space-y-1 border-t border-emerald-700/60 pt-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  <MapPin className="w-5 h-5" />
                  <span className="text-3xl sm:text-4xl font-black font-sans text-white">20+</span>
                </div>
                <p className="text-xs font-medium text-slate-300">Collection Locations</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
