'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Award, 
  Microscope, 
  CheckCircle2, 
  Clock, 
  ArrowRight,
  Stethoscope
} from 'lucide-react';
import EnquireModal from '../ui/EnquireModal';

export interface AboutSectionData {
  id?: string;
  badgeText?: string | null;
  titlePrefix?: string | null;
  titleHighlight?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  badge1Title?: string | null;
  badge1Subtitle?: string | null;
  badge2Title?: string | null;
  badge2Subtitle?: string | null;
  badge3Text?: string | null;
  pillar1Title?: string | null;
  pillar1Desc?: string | null;
  pillar2Title?: string | null;
  pillar2Desc?: string | null;
  pillar3Title?: string | null;
  pillar3Desc?: string | null;
  pillar4Title?: string | null;
  pillar4Desc?: string | null;
  primaryBtnText?: string | null;
  primaryBtnLink?: string | null;
  secondaryBtnText?: string | null;
  isActive?: boolean;
}

interface DoorstepCareProps {
  initialData?: AboutSectionData | null;
}

const defaultAbout = {
  badgeText: 'About AiCura Diagnostics',
  titlePrefix: 'Pioneering Clinical Precision &',
  titleHighlight: 'Trusted Healthcare.',
  description:
    'At AiCura Diagnostics, we believe accurate diagnostics are the cornerstone of effective healthcare. Combining state-of-the-art laboratory automation with seasoned medical pathologists, we deliver trustworthy, high-precision results for you and your family.',
  imageUrl:
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000',
  badge1Title: 'NABL Standard',
  badge1Subtitle: 'Quality Assured Testing',
  badge2Title: '99.8% Precision',
  badge2Subtitle: 'Double Verified Results',
  badge3Text: '10,000+ Happy Patients',
  pillar1Title: 'Fully Automated Analyzers',
  pillar1Desc: 'Advanced robotic equipment ensuring error-free testing with rapid turnaround.',
  pillar2Title: 'NABL & ISO Compliant',
  pillar2Desc: 'Standardized protocols matching the highest global benchmarks for diagnostic accuracy.',
  pillar3Title: 'MD Pathologist Verified',
  pillar3Desc: 'Every diagnostic report is validated by veteran senior pathologists.',
  pillar4Title: 'Same-Day Digital Reports',
  pillar4Desc: 'Prompt delivery of secure, comprehensive reports directly via WhatsApp & Email.',
  primaryBtnText: 'Learn More About Us',
  primaryBtnLink: '/about',
  secondaryBtnText: 'Contact Our Lab',
};

export default function DoorstepCare({ initialData }: DoorstepCareProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [about, setAbout] = useState(initialData || defaultAbout);

  useEffect(() => {
    if (initialData) {
      setAbout(initialData);
    } else {
      fetch('/api/about', { cache: 'no-store' })
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setAbout(json.data);
          }
        })
        .catch(() => {});
    }
  }, [initialData]);

  const badgeText = about.badgeText || defaultAbout.badgeText;
  const titlePrefix = about.titlePrefix || defaultAbout.titlePrefix;
  const titleHighlight = about.titleHighlight || defaultAbout.titleHighlight;
  const description = about.description || defaultAbout.description;
  const imageUrl = about.imageUrl || defaultAbout.imageUrl;
  const badge1Title = about.badge1Title || defaultAbout.badge1Title;
  const badge1Subtitle = about.badge1Subtitle || defaultAbout.badge1Subtitle;
  const badge2Title = about.badge2Title || defaultAbout.badge2Title;
  const badge2Subtitle = about.badge2Subtitle || defaultAbout.badge2Subtitle;
  const badge3Text = about.badge3Text || defaultAbout.badge3Text;

  const pillars = [
    {
      icon: Microscope,
      title: about.pillar1Title || defaultAbout.pillar1Title,
      desc: about.pillar1Desc || defaultAbout.pillar1Desc,
    },
    {
      icon: ShieldCheck,
      title: about.pillar2Title || defaultAbout.pillar2Title,
      desc: about.pillar2Desc || defaultAbout.pillar2Desc,
    },
    {
      icon: Stethoscope,
      title: about.pillar3Title || defaultAbout.pillar3Title,
      desc: about.pillar3Desc || defaultAbout.pillar3Desc,
    },
    {
      icon: Clock,
      title: about.pillar4Title || defaultAbout.pillar4Title,
      desc: about.pillar4Desc || defaultAbout.pillar4Desc,
    },
  ];

  return (
    <>
      <section className="py-20 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/60 border-y border-slate-200/80 overflow-hidden relative">
        {/* Subtle decorative background lights */}
        <div className="absolute top-10 left-10 w-72 h-72 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-amber-100/40 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content Column */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Clean Badge Without Sprinkle */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-xs font-bold text-brand-800 tracking-wider uppercase">
                  {badgeText}
                </span>
              </div>
              
              {/* Main Headline */}
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-sans tracking-tight leading-[1.15]">
                {titlePrefix} <span className="text-brand-700">{titleHighlight}</span>
              </h2>

              {/* Description */}
              <p className="text-slate-600 text-base leading-relaxed">
                {description}
              </p>

              {/* 4 Feature Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {pillars.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <div 
                      key={idx} 
                      className="p-3.5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-emerald-300 hover:shadow-sm transition-all group"
                    >
                      <div className="flex items-center gap-2.5 mb-1.5">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {item.title}
                        </h4>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed pl-10">
                        {item.desc}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-4">
                <Link
                  href={about.primaryBtnLink || defaultAbout.primaryBtnLink}
                  className="inline-flex items-center gap-2 px-7 py-3.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-sm rounded-full shadow-md hover:shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>{about.primaryBtnText || defaultAbout.primaryBtnText}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-300 text-slate-700 hover:text-brand-800 hover:border-brand-700 font-semibold text-sm rounded-full shadow-xs hover:bg-slate-50 transition-colors"
                >
                  <span>{about.secondaryBtnText || defaultAbout.secondaryBtnText}</span>
                </button>
              </div>

            </div>

            {/* Right Graphic Column */}
            <div className="lg:col-span-6 relative">
              
              {/* Main Laboratory Image */}
              <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-2xl h-[440px] sm:h-[500px] w-full group bg-slate-900">
                <Image
                  src={imageUrl}
                  alt="AiCura Advanced Clinical Diagnostics Laboratory"
                  fill
                  unoptimized
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Gradient Overlay for card contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 pointer-events-none" />

                {/* Floating Badge 1: Top Right */}
                <div className="absolute top-6 right-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xl flex items-center gap-3 max-w-xs transition-transform hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-brand-700 flex items-center justify-center shrink-0">
                    <Award className="w-5 h-5 text-emerald-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{badge1Title}</h4>
                    <span className="text-[11px] text-slate-500">{badge1Subtitle}</span>
                  </div>
                </div>

                {/* Floating Badge 2: Bottom Left */}
                <div className="absolute bottom-6 left-6 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-200/80 shadow-xl flex items-center gap-3 max-w-xs transition-transform hover:-translate-y-1">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">{badge2Title}</h4>
                    <span className="text-[11px] text-slate-500">{badge2Subtitle}</span>
                  </div>
                </div>

                {/* Floating Badge 3: Center Bottom Mini Tag */}
                <div className="absolute bottom-6 right-6 bg-brand-800/90 text-white backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-500/50 shadow-lg flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400" />
                  <span className="text-xs font-semibold">{badge3Text}</span>
                </div>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Booking / Enquiry Modal */}
      <EnquireModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="contact"
      />
    </>
  );
}
