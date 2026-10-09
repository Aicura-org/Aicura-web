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
  Stethoscope,
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
  badge3Title?: string | null;
  badge3Subtitle?: string | null;
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
  badge1Title: 'Quality Standard',
  badge1Subtitle: 'Quality Assured Testing',
  badge2Title: '99.8% Precision',
  badge2Subtitle: 'Double Verified Results',
  badge3Text: '',
  badge3Title: 'Happy Clients',
  badge3Subtitle: 'Quality Assured Testing',
  pillar1Title: 'Fully Automated Analyzers',
  pillar1Desc: 'Advanced robotic equipment ensuring error-free testing with rapid turnaround.',
  pillar2Title: 'ISO Compliant & Certified',
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
  const badge3Parts = (about.badge3Text || defaultAbout.badge3Text || '').trim().split(/\s+/);
  const badge3Title =
    badge3Parts.length > 1
      ? badge3Parts.slice(1).join(' ')
      : (about as AboutSectionData).badge3Title || defaultAbout.badge3Title;
  const badge3Subtitle =
    badge3Parts.length > 1
      ? `${badge3Parts[0]} Served`
      : (about as AboutSectionData).badge3Subtitle || defaultAbout.badge3Subtitle;

  const pillars = [
    {
      icon: Microscope,
      title: about.pillar1Title || defaultAbout.pillar1Title,
      desc: about.pillar1Desc || defaultAbout.pillar1Desc,
      card: 'bg-brand-50',
      box: 'bg-brand-100',
      iconColor: 'text-brand-700',
    },
    {
      icon: ShieldCheck,
      title: about.pillar2Title || defaultAbout.pillar2Title,
      desc: about.pillar2Desc || defaultAbout.pillar2Desc,
      card: 'bg-emerald-50',
      box: 'bg-emerald-100',
      iconColor: 'text-emerald-700',
    },
    {
      icon: Stethoscope,
      title: about.pillar3Title || defaultAbout.pillar3Title,
      desc: about.pillar3Desc || defaultAbout.pillar3Desc,
      card: 'bg-amber-50',
      box: 'bg-amber-100',
      iconColor: 'text-amber-700',
    },
    {
      icon: Clock,
      title: about.pillar4Title || defaultAbout.pillar4Title,
      desc: about.pillar4Desc || defaultAbout.pillar4Desc,
      card: 'bg-sky-50',
      box: 'bg-sky-100',
      iconColor: 'text-sky-700',
    },
  ];

  return (
    <>
      <section className="bg-white py-10 md:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* 1. Content on the left, image on the right */}
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
            <div className="space-y-5">
              <div>
                <span className="text-brand-700 text-[11px] md:text-xs font-bold tracking-wider uppercase block mb-1">
                  {badgeText}
                </span>
                <h2 className="text-xl sm:text-3xl font-bold text-black font-sans tracking-tight leading-snug">
                  {titlePrefix}{' '}
                  <span className="text-brand-700">{titleHighlight}</span>
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-slate-600 sm:text-base pb-5">
                {description}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href={about.primaryBtnLink || defaultAbout.primaryBtnLink}
                  className="gold-gradient hover:gold-gradient-hover inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold text-brand-900 transition-transform active:scale-[0.98]"
                >
                  <span>{about.primaryBtnText || defaultAbout.primaryBtnText}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-full bg-slate-100 px-6 py-3.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-200 hover:text-brand-800"
                >
                  <span>{about.secondaryBtnText || defaultAbout.secondaryBtnText}</span>
                </button>
              </div>
            </div>

            <div>
              <div className="relative h-56 w-full overflow-hidden rounded-[1.75rem] sm:h-72 lg:h-96 lg:rounded-[2.5rem]">
                <Image
                  src={imageUrl}
                  alt="AiCura Advanced Clinical Diagnostics Laboratory"
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>

              {/* Badges panel: below image on mobile, overlapping image from sm up.
                  Mobile: 2 centered cards on row 1, 1 full-width centered card on row 2.
                  sm and up: original 3 columns. */}
              <div className="relative z-10 mx-0 mt-3 grid grid-cols-2 gap-2.5 rounded-3xl p-0 sm:mx-4 sm:-mt-10 sm:grid-cols-3 sm:gap-2 sm:p-2">
                <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-emerald-50 px-2 py-3 text-center sm:flex-row sm:justify-start sm:gap-2.5 sm:p-3 sm:text-left">
                  <Award className="h-6 w-6 shrink-0 text-emerald-700 sm:h-5 sm:w-5" />
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold leading-tight text-slate-900 sm:whitespace-nowrap">{badge1Title}</h4>
                    <span className="mt-0.5 block text-[11px] leading-snug text-slate-600">{badge1Subtitle}</span>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center gap-1.5 rounded-2xl bg-amber-50 px-2 py-3 text-center sm:flex-row sm:justify-start sm:gap-2.5 sm:p-3 sm:text-left">
                  <ShieldCheck className="h-6 w-6 shrink-0 text-amber-700 sm:h-5 sm:w-5" />
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold leading-tight text-slate-900 sm:whitespace-nowrap">{badge2Title}</h4>
                    <span className="mt-0.5 block text-[11px] leading-snug text-slate-600">{badge2Subtitle}</span>
                  </div>
                </div>

                {/* Full width + centered on mobile, normal single column on desktop */}
                <div className="col-span-2 flex items-center justify-center gap-2.5 rounded-2xl bg-brand-50 px-3 py-3 text-left sm:col-span-1 sm:justify-start sm:p-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-brand-700 sm:h-5 sm:w-5" />
                  <div className="min-w-0">
                    <h4 className="text-[13px] font-bold leading-tight text-slate-900 sm:whitespace-nowrap">{badge3Title}</h4>
                    <span className="mt-0.5 block text-[11px] leading-snug text-slate-600">{badge3Subtitle}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Pillars: compact icon-left list on mobile, 2 cols on sm, 4 across on desktop */}
          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-x-4 sm:gap-y-8 md:mt-12 lg:grid-cols-4 lg:gap-8">
            {pillars.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`group flex items-center gap-3.5 rounded-2xl p-4 sm:block sm:p-5 ${item.card}`}
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl sm:mb-3 ${item.box} ${item.iconColor} transition-transform group-hover:scale-105`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-[15px] font-bold leading-snug text-slate-900 sm:text-base">
                      {item.title}
                    </h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:mt-1.5 sm:text-sm">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
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