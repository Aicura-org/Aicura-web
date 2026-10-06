'use client';

import React, { useState } from 'react';
import { Plus, Minus, ArrowRight } from 'lucide-react';
import { CampaignFaqItem } from '@/lib/campaign-helper';

interface CampaignFaqSectionProps {
  faqs: CampaignFaqItem[];
}

export function CampaignFaqSection({ faqs }: CampaignFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqs || faqs.length === 0) return null;

  const toggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  // Split evenly into 2 columns (left and right)
  const half = Math.ceil(faqs.length / 2);
  const leftFaqs = faqs.slice(0, half);
  const rightFaqs = faqs.slice(half);

  return (
    <section id="faqs" className="py-8 sm:py-12 md:py-16 bg-white border-b border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row: Title on Left, View All FAQs Pill Button on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-slate-900 tracking-tight font-sans">
              Frequently Asked Questions
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Here are some common questions about this campaign.
            </p>
          </div>

          <a
            href="#campaign-enquiry-card"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#dcf3e8] hover:bg-[#ceeada] text-[#0d6e46] text-xs font-bold transition-colors w-fit self-start sm:self-auto shadow-2xs"
          >
            <span>View All FAQs</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 2-Column FAQ Accordion Grid matching reference screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2.5 sm:gap-4">
          
          {/* Left Column */}
          <div className="space-y-2.5 sm:space-y-3.5">
            {leftFaqs.map((faq, idx) => {
              const actualIdx = idx;
              const isOpen = openIndex === actualIdx;
              return (
                <div
                  key={actualIdx}
                  className={`rounded-xl sm:rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-slate-300 bg-slate-50/40 shadow-xs'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(actualIdx)}
                    className="w-full text-left px-4 py-3.5 sm:px-5 sm:py-4 flex items-center justify-between gap-3 focus:outline-none cursor-pointer"
                  >
                    <span className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                    <span className="text-slate-500 shrink-0 font-bold text-base leading-none">
                      {isOpen ? <Minus className="w-4 h-4 text-teal-800" /> : <Plus className="w-4 h-4 text-slate-500" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Column */}
          <div className="space-y-3 sm:space-y-3.5">
            {rightFaqs.map((faq, idx) => {
              const actualIdx = half + idx;
              const isOpen = openIndex === actualIdx;
              return (
                <div
                  key={actualIdx}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isOpen
                      ? 'border-slate-300 bg-slate-50/40 shadow-xs'
                      : 'border-slate-200/90 bg-white hover:border-slate-300 shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggle(actualIdx)}
                    className="w-full text-left px-5 py-4 flex items-center justify-between gap-3 focus:outline-none cursor-pointer"
                  >
                    <span className="text-xs sm:text-[13px] font-bold text-slate-900 leading-snug">
                      {faq.question}
                    </span>
                    <span className="text-slate-500 shrink-0 font-bold text-base leading-none">
                      {isOpen ? <Minus className="w-4 h-4 text-teal-800" /> : <Plus className="w-4 h-4 text-slate-500" />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 pt-1 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}

export default CampaignFaqSection;
