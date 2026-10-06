'use client';

import React from 'react';
import { Home, Shield, FileText, Users } from 'lucide-react';
import { CampaignBenefitItem } from '@/lib/campaign-helper';

interface CampaignWhyChooseProps {
  benefits: CampaignBenefitItem[];
  sectionTitle?: string;
  sectionSubtitle?: string;
}

const BENEFIT_ICONS = [
  <Home className="w-6 h-6 text-[#0b6644]" key="home" />,
  <Shield className="w-6 h-6 text-[#0b6644]" key="shield" />,
  <FileText className="w-6 h-6 text-[#0b6644]" key="file" />,
  <Users className="w-6 h-6 text-[#0b6644]" key="users" />,
];

export function CampaignWhyChoose({
  benefits,
  sectionTitle = 'Why Choose This Campaign?',
  sectionSubtitle = 'Designed for senior citizens to detect health issues early and live a healthier, happier life.',
}: CampaignWhyChooseProps) {
  if (!benefits || benefits.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 md:py-16 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight font-sans">
            {sectionTitle}
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            {sectionSubtitle}
          </p>
        </div>

        {/* 4 Cards Grid matching reference screenshot exactly */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {benefits.slice(0, 4).map((benefit, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-4 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
            >
              {/* Top Row: Mint Icon on Left + Title on Right */}
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-[#daf2e6] flex items-center justify-center shrink-0">
                    {BENEFIT_ICONS[idx % BENEFIT_ICONS.length]}
                  </div>

                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-snug">
                    {benefit.title}
                  </h3>
                </div>

                {/* Description below */}
                <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default CampaignWhyChoose;
