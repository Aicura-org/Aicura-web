'use client';

import React from 'react';
import {
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Home,
  MessageCircle,
} from 'lucide-react';
import CampaignEnquiryForm from './CampaignEnquiryForm';
import { CampaignItem } from '@/types';
import { ParsedCampaignData } from '@/lib/campaign-helper';

interface Props {
  campaign: CampaignItem;
  data: ParsedCampaignData;
}

export function CampaignLandingHero({ campaign, data }: Props) {
  const scrollToForm = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('campaign-enquiry-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      const firstInput = el.querySelector('input');
      if (firstInput) firstInput.focus();
    }
  };

  const whatsappMessage = `Hi AiCura, I would like to book the campaign offer: ${campaign.title}`;

  // Image fallback: prefer real senior couple photo matching reference
  const heroImageSrc =
    campaign.heroImageUrl && !campaign.heroImageUrl.includes('unsplash')
      ? campaign.heroImageUrl
      : '/senior-couple.webp';

  const displayTitle =
    !campaign.title || campaign.title === 'Empower Senior Health with Tailored Diagnostics'
      ? 'Comprehensive Senior Health Checkup'
      : campaign.title;

  return (
    <section className="relative bg-[#f8f9fa] pt-6 sm:pt-10 lg:pt-12 pb-10 sm:pb-14 lg:pb-16 border-b border-slate-200/70 overflow-hidden min-h-0 lg:min-h-[640px] flex items-center">
      {/* 1. Desktop Background: Wide couple banner with localized left fade */}
      <div className="hidden lg:block absolute inset-0 w-full h-full pointer-events-none overflow-hidden select-none">
        <img
          src={heroImageSrc}
          alt={campaign.title}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              '/api/campaign-assets/senior_couple_hero_1791291769977.jpg';
          }}
          className="w-full h-full object-cover object-[58%_25%]"
        />

        {/* Soft fade strictly behind the left text column, leaving couple in center completely untouched */}
        <div className="absolute inset-y-0 left-0 w-[45%] bg-gradient-to-r from-white/95 via-white/80 via-70% to-transparent pointer-events-none" />
      </div>

      {/* 2. Mobile/Tablet Clean Subtle Backdrop */}
      <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-white via-[#f7faf8] to-[#f0f7f3] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
          
          {/* Left Column: Offer Details & Value Proposition (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5 relative">
            {/* Subtle soft backdrop strictly behind text for high legibility */}
            <div className="hidden lg:block absolute -inset-4 -z-10 bg-white/50 blur-lg rounded-3xl pointer-events-none" />
            
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 bg-[#e8f7f2] text-teal-800 border border-teal-200/80 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wide">
              <span>{data.badgeText}</span>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl lg:text-[42px] font-black text-slate-900 leading-[1.15] font-sans tracking-tight">
              {displayTitle}
            </h1>

            {/* Subtitle / Overview */}
            <p className="text-xs sm:text-sm lg:text-base text-slate-600 font-normal leading-relaxed">
              {data.overview}
            </p>

            {/* 4 Checkmark Bullets (2x2 grid on sm+) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 pt-1 text-xs font-semibold text-slate-700">
              {data.highlights.slice(0, 4).map((point, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="leading-snug">{point}</span>
                </div>
              ))}
            </div>

            {/* Pricing Area */}
            <div className="pt-1 sm:pt-2">
              {data.originalPrice && (
                <div className="text-xs sm:text-sm text-slate-400 line-through font-semibold mb-0.5">
                  ₹{data.originalPrice.toLocaleString('en-IN')}
                </div>
              )}
              <div className="flex items-center gap-3">
                <span className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                  ₹{data.price.toLocaleString('en-IN')}
                </span>
                {data.discount && (
                  <span className="text-xs font-extrabold bg-[#f5b324] text-slate-950 px-2.5 py-1 rounded-md shadow-2xs">
                    {data.discount}
                  </span>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-2 space-y-2">
              <button
                onClick={scrollToForm}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-[#f5b324] hover:bg-[#e5a519] active:bg-[#d49610] text-slate-950 font-extrabold text-sm sm:text-base rounded-xl shadow-xs transition-all cursor-pointer"
              >
                <span>{campaign.ctaText || 'Book Senior Health Package'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <p className="text-[11px] text-slate-400 font-medium text-center sm:text-left">
                Safe. Secure. Easy Booking
              </p>
            </div>
          </div>

          {/* Middle Column: Handwritten script & background couple space */}
          <div className="lg:col-span-3 flex flex-col items-center justify-start h-full pt-1 lg:pt-2 relative pointer-events-none select-none">
            {/* Mobile / Tablet couple display */}
            <div className="lg:hidden w-full max-w-[340px] mx-auto rounded-2xl overflow-hidden shadow-md my-2 aspect-[4/3] relative border-2 border-white/90">
              <img
                src={heroImageSrc}
                alt={campaign.title}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    '/api/campaign-assets/senior_couple_hero_1791291769977.jpg';
                }}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-2.5 right-3 text-right -rotate-6">
                <span className="font-serif italic text-xs text-slate-800 font-bold leading-tight block drop-shadow-xs">
                  Because their health matters ♡
                </span>
              </div>
            </div>

            {/* Desktop Handwritten Script Overlay matching reference exactly */}
            <div className="hidden lg:block text-right -rotate-6 pt-2">
              <span className="font-serif italic text-xs sm:text-sm text-slate-800 font-semibold leading-tight block drop-shadow-2xs">
                Because
              </span>
              <span className="font-serif italic text-xs sm:text-sm text-slate-800 font-semibold leading-tight block drop-shadow-2xs">
                their health
              </span>
              <span className="font-serif italic text-xs sm:text-sm text-slate-800 font-semibold leading-tight block drop-shadow-2xs">
                matters
              </span>
              <span className="text-slate-600 text-xs block mt-0.5 mr-2">♡</span>
            </div>
          </div>

          {/* Right Column: Direct Enquiry Card Floating over the wide banner (4 cols on lg) */}
          <div className="lg:col-span-4 w-full max-w-lg mx-auto lg:max-w-none">
            <div
              id="campaign-enquiry-card"
              className="bg-white/95 backdrop-blur-xs rounded-2xl p-5 sm:p-7 shadow-xl border border-slate-200/90 text-slate-900 scroll-mt-20"
            >
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-sans">
                  Claim Campaign Offer
                </h3>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  Fill in your details and our team will contact you for booking &amp; home collection.
                </p>
              </div>

              <CampaignEnquiryForm
                campaignId={campaign.id}
                campaignSlug={campaign.slug}
                ctaText="Get My Offer →"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default CampaignLandingHero;
