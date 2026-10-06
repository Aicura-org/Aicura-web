'use client';

import React from 'react';
import { ArrowRight, FlaskConical, Home, Clock } from 'lucide-react';
import { ParsedCampaignData } from '@/lib/campaign-helper';

interface CampaignFinalCtaProps {
  title: string;
  data: ParsedCampaignData;
}

export function CampaignFinalCta({ title, data }: CampaignFinalCtaProps) {
  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('campaign-enquiry-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = el.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Dark Forest Green Banner Container matching reference */}
        <div className="bg-[#05382b] rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
            
            {/* Left Column: Headline, Subtitle & Yellow Pill CTA (5 cols on lg) */}
            <div className="lg:col-span-5 space-y-3">
              <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-[#f5b324] block">
                GIVE THEM A HEALTHIER TOMORROW
              </span>

              <h2 className="text-xl sm:text-2xl lg:text-[28px] font-black text-white tracking-tight leading-tight font-sans">
                Book the Senior Health Package Today
              </h2>

              <p className="text-xs sm:text-[13px] text-emerald-100/80 leading-relaxed pb-1">
                Comprehensive testing. Convenient home collection. Trusted care.
              </p>

              <div>
                <button
                  onClick={scrollToForm}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-7 py-3.5 sm:py-3 bg-[#f5b324] hover:bg-[#e5a519] active:bg-[#d49610] text-slate-950 font-black text-xs sm:text-sm rounded-full shadow-xs transition-all cursor-pointer hover:scale-[1.02]"
                >
                  <span>Book Senior Health Package</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Middle Column: 3 Feature Badges (3 cols on lg) */}
            <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2 sm:gap-2.5 text-white text-xs font-semibold">
              <div className="rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 p-2.5 sm:p-3 flex items-center gap-2.5 backdrop-blur-xs">
                <FlaskConical className="w-4 h-4 sm:w-5 sm:h-5 text-teal-200 shrink-0" />
                <span>72+ Tests Covered</span>
              </div>

              <div className="rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 p-2.5 sm:p-3 flex items-center gap-2.5 backdrop-blur-xs">
                <Home className="w-4 h-4 sm:w-5 sm:h-5 text-teal-200 shrink-0" />
                <span>Home Collection</span>
              </div>

              <div className="sm:col-span-2 lg:col-span-1 rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 p-2.5 sm:p-3 flex items-center gap-2.5 backdrop-blur-xs">
                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-teal-200 shrink-0" />
                <span>Reports in 24 Hours</span>
              </div>
            </div>

            {/* Right Column: Smiling Senior Couple with White Script (4 cols on lg) */}
            <div className="lg:col-span-4 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[300px] sm:max-w-[340px]">
                
                {/* Handwritten White Script Overlay */}
                <div className="absolute top-2.5 right-4 z-10 text-right pointer-events-none select-none -rotate-6">
                  <span className="font-serif italic text-xs sm:text-sm text-white font-bold leading-tight block drop-shadow-md">
                    Healthy
                  </span>
                  <span className="font-serif italic text-xs sm:text-sm text-white font-bold leading-tight block drop-shadow-md">
                    Seniors
                  </span>
                  <span className="font-serif italic text-xs sm:text-sm text-white font-bold leading-tight block drop-shadow-md">
                    Happier
                  </span>
                  <span className="font-serif italic text-xs sm:text-sm text-white font-bold leading-tight block drop-shadow-md">
                    Tomorrows
                  </span>
                  <span className="text-white text-xs block mt-0.5 mr-2 drop-shadow-md">♡</span>
                </div>

                {/* Photo frame */}
                <div className="rounded-2xl sm:rounded-3xl overflow-hidden shadow-lg aspect-[4/3] bg-emerald-950">
                  <img
                    src="/senior-couple.jpg"
                    alt="Senior Health Diagnostic Care"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src =
                        '/api/campaign-assets/senior_couple_hero_1791291769977.jpg';
                    }}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default CampaignFinalCta;
