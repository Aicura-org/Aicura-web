'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const faqs = [
  {
    id: 'faq-1',
    question: 'How do I prepare for a home sample collection?',
    answer: 'If your test requires fasting (e.g. Full Body, Lipid Profile, Fasting Blood Sugar), do not consume food or beverages except plain water for 10-12 hours prior to collection. Keep your doctor prescription ready if applicable.',
  },
  {
    id: 'faq-2',
    question: 'Are home sample collection charges extra?',
    answer: 'Home collection is completely FREE for all health checkup packages and test orders above ₹499.',
  },
  {
    id: 'faq-3',
    question: 'How quickly will I receive my test reports?',
    answer: 'Routine blood tests (CBC, Glucose, Thyroid) are delivered within 6 to 12 hours. Comprehensive packages take 18-24 hours directly on WhatsApp & Email.',
  },
  {
    id: 'faq-4',
    question: 'Is AiCura Diagnostics lab NABL accredited?',
    answer: 'Yes, all our diagnostic laboratories follow strict NABL quality standards and ISO certifications for 100% test accuracy.',
  },
];

export default function FAQSection() {
  const [openId, setOpenId] = useState<string | null>('faq-1');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-white font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-wider block mb-1">
            HELP & FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
            Questions, Answered.
          </h2>
          <p className="text-slate-600 text-sm mt-1">
            Find answers to common questions regarding home sample collection and test reports.
          </p>
        </div>

        {/* 2 Column Accordion Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-5xl mx-auto">
          {faqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-slate-200 rounded-2xl overflow-hidden bg-slate-50 hover:border-brand-700 transition-colors"
              >
                <button
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-4 text-left font-bold text-slate-900 text-sm flex items-center justify-between gap-4 bg-white hover:bg-slate-50 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-brand-700 shrink-0" />
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-brand-700' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-4 pt-1 text-slate-600 text-xs leading-relaxed border-t border-slate-100 bg-emerald-50/40">
                    {faq.answer}
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
