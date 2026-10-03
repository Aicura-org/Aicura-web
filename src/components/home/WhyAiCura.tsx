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

  const stats = [
    { value: '10,000+', label: 'Happy Customers', icon: Users, tile: 'bg-emerald-50', iconBox: 'bg-emerald-100 text-emerald-700' },
    { value: '500+', label: 'Tests Available', icon: Activity, tile: 'bg-sky-50', iconBox: 'bg-sky-100 text-sky-700' },
    { value: '5+', label: 'Years of Service', icon: Award, tile: 'bg-amber-50', iconBox: 'bg-amber-100 text-amber-700' },
    { value: '20+', label: 'Collection Locations', icon: MapPin, tile: 'bg-rose-50', iconBox: 'bg-rose-100 text-rose-700' },
  ];

  return (
    <section className="relative overflow-hidden bg-brand-700 py-14 text-white md:py-20">
      {/* Background glows */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-yellow-400/5 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* Left: intro + 4 pillars */}
          <div className="space-y-7 lg:col-span-7">
            <div>
              <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-yellow-400">
                Our Commitment
              </span>
              <h2 className="font-sans text-2xl font-bold tracking-tight text-white sm:text-4xl">
                Why AiCura?
              </h2>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-200 sm:text-base">
                More than a test. A clearer understanding of your health.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
              {pillars.map((item, idx) => {
                const IconComp = item.icon;
                return (
                  <div
                    key={idx}
                    className="group relative flex items-center gap-4 overflow-hidden rounded-2xl border border-white/10 bg-brand-800/70 p-4 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-800 sm:p-5"
                  >
                    {/* Yellow accent bar */}

                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-yellow-400 transition-colors duration-300 group-hover:bg-yellow-400 group-hover:text-brand-900">
                      <IconComp className="h-6 w-6" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-base leading-tight text-white">{item.title}</h3>
                      <span className="mt-0.5 block text-sm leading-snug text-slate-300">{item.subtitle}</span>
                    </div>

                    {/* Step number, mobile polish */}
                    <span className="text-xs font-bold tabular-nums text-white/20 sm:hidden">
                      0{idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: key stats (light tiles that stand out on the dark section) */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={idx}
                    className={`group relative overflow-hidden rounded-3xl p-4 text-center shadow-lg shadow-black/10 transition-transform duration-300 hover:-translate-y-1 sm:p-6 sm:text-left ${stat.tile}`}
                  >
                    <div className={`mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-xl sm:mx-0 sm:h-11 sm:w-11 ${stat.iconBox}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="font-sans text-[26px] leading-none tracking-tight text-brand-900 sm:text-4xl">
                      {stat.value}
                    </div>
                    <p className="mt-2 text-xs font-semibold leading-snug text-slate-600 sm:text-sm">{stat.label}</p>

                    {/* Decorative icon watermark */}
                    <Icon className="pointer-events-none absolute -bottom-3 -right-3 h-20 w-20 text-black/[0.04] transition-transform duration-500 group-hover:scale-110 sm:h-24 sm:w-24" />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}