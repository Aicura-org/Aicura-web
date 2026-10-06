'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CampaignIncludedItem } from '@/lib/campaign-helper';

interface CampaignIncludedServicesProps {
  items: CampaignIncludedItem[];
  campaignTitle?: string;
  sectionTitle?: string;
}

function DiagnosticCardIcon({ iconName, title }: { iconName?: string; title: string }) {
  const norm = (iconName + ' ' + title).toLowerCase();

  // 1. Complete Blood Count (CBC) - Red Blood Droplet
  if (norm.includes('cbc') || norm.includes('blood count') || norm.includes('droplet')) {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
        <path
          d="M12 2.5C12 2.5 5 11 5 15.5C5 19.09 7.91 22 11.5 22C15.09 22 18 19.09 18 15.5C18 11 12 2.5 12 2.5Z"
          fill="#EF4444"
        />
        <path
          d="M10 14C10 12.5 11 10.5 11.5 9.5C11.6 9.3 11.8 9.3 11.9 9.5C12.5 10.5 14 13 14 15C14 16.38 12.88 17.5 11.5 17.5C10.5 17.5 10 16.5 10 14Z"
          fill="#FCA5A5"
          fillOpacity="0.7"
        />
      </svg>
    );
  }

  // 2. Diabetes Screening - Orange circular badge with checkmark
  if (norm.includes('diabet') || norm.includes('sugar') || norm.includes('glucose')) {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
        <circle cx="12" cy="12" r="10" fill="#F97316" />
        <path
          d="M7.5 12.5L10.5 15.5L16.5 9.5"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // 3. Liver Function Test (LFT) - Coral/orange liver
  if (norm.includes('liver') || norm.includes('lft') || norm.includes('hepatic')) {
    return (
      <svg viewBox="0 0 28 24" className="w-7 h-6 shrink-0" fill="none">
        <path
          d="M3 8C3 4.5 6.5 3 11 3C19 3 25 5.5 25 11C25 16.5 21 21 15 21C9.5 21 6.5 18 4.5 15.5C3.5 14.2 3 11.5 3 8Z"
          fill="#F97316"
        />
        <path
          d="M13 11C13 8 16 6 19 6C22 6 23.5 7.5 23.5 9.5C23.5 12 20.5 15 16.5 15.5C14 15.8 13 13.5 13 11Z"
          fill="#FDBA74"
          fillOpacity="0.6"
        />
      </svg>
    );
  }

  // 4. Kidney Function Test (KFT) - Red kidneys
  if (norm.includes('kidney') || norm.includes('kft') || norm.includes('renal')) {
    return (
      <svg viewBox="0 0 28 24" className="w-7 h-6 shrink-0" fill="none">
        <path
          d="M4.5 11C3 7 5.5 3.5 8.5 3.5C11 3.5 12.5 5.5 12.5 8C12.5 10.5 10.5 11.5 10.5 13C10.5 14.5 12.5 15.5 12.5 17.5C12.5 20 10.5 21.5 8 21.5C4.5 21.5 3 17 4.5 11Z"
          fill="#DC2626"
        />
        <path
          d="M23.5 11C25 7 22.5 3.5 19.5 3.5C17 3.5 15.5 5.5 15.5 8C15.5 10.5 17.5 11.5 17.5 13C17.5 14.5 15.5 15.5 15.5 17.5C15.5 20 17.5 21.5 20 21.5C23.5 21.5 25 17 23.5 11Z"
          fill="#DC2626"
        />
      </svg>
    );
  }

  // 5. Lipid Profile (Cholesterol) - Red heart with ECG pulse line
  if (norm.includes('lipid') || norm.includes('cholesterol') || norm.includes('heart')) {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
        <path
          d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"
          fill="#DC2626"
        />
        <path
          d="M5.5 11.5H8.5L10 8.5L12 14.5L13.5 11.5H18.5"
          stroke="white"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // 6. Thyroid Profile - Red butterfly silhouette
  if (norm.includes('thyroid') || norm.includes('tsh') || norm.includes('zap')) {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
        <path
          d="M7 4C4.5 4 3 7 3 11C3 15 5 19 8 19C9.5 19 10.5 17.5 11 16C11.5 14.5 12 14 12 14C12 14 12.5 14.5 13 16C13.5 17.5 14.5 19 16 19C19 19 21 15 21 11C21 7 19.5 4 17 4C14.5 4 13.5 6 12 8C10.5 6 9.5 4 7 4Z"
          fill="#DC2626"
        />
        <path d="M10 13H14" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }

  // 7. Vitamin Levels (B12, D) - Green angled capsule
  if (norm.includes('vitamin') || norm.includes('b12') || norm.includes('capsule') || norm.includes('pill')) {
    return (
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
        <rect
          x="3.5"
          y="7.5"
          width="17"
          height="9"
          rx="4.5"
          transform="rotate(-45 12 12)"
          stroke="#16A34A"
          strokeWidth="2.4"
          fill="none"
        />
        <path d="M15.5 8.5L8.5 15.5" stroke="#16A34A" strokeWidth="2" />
        <path d="M12 5L19 12C20.5 10.5 20.5 8.5 19 7C17.5 5.5 15.5 5.5 14 7L12 5Z" fill="#16A34A" />
      </svg>
    );
  }

  // 8. Cardiac Risk Markers - Red circle with heart pulse
  return (
    <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" fill="none">
      <circle cx="12" cy="12" r="10" fill="#DC2626" />
      <path
        d="M6 12H9L10.5 8.5L12.5 15.5L14 12H18"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function renderFormattedTitle(title: string) {
  // Check for known common titles to format into 2 crisp lines exactly matching screenshot
  const t = title.trim();
  if (t === 'Complete Blood Count (CBC)') {
    return (
      <>
        <span className="block">Complete</span>
        <span className="block">Blood Count (CBC)</span>
      </>
    );
  }
  if (t === 'Diabetes Screening') {
    return (
      <>
        <span className="block">Diabetes</span>
        <span className="block">Screening</span>
      </>
    );
  }
  if (t === 'Liver Function Test (LFT)') {
    return (
      <>
        <span className="block">Liver Function</span>
        <span className="block">Test (LFT)</span>
      </>
    );
  }
  if (t === 'Kidney Function Test (KFT)') {
    return (
      <>
        <span className="block">Kidney Function</span>
        <span className="block">Test (KFT)</span>
      </>
    );
  }
  if (t === 'Lipid Profile (Cholesterol)') {
    return (
      <>
        <span className="block">Lipid Profile</span>
        <span className="block">(Cholesterol)</span>
      </>
    );
  }
  if (t === 'Thyroid Profile (TSH, T3, T4)') {
    return (
      <>
        <span className="block">Thyroid Profile</span>
        <span className="block">(TSH, T3, T4)</span>
      </>
    );
  }
  if (t === 'Vitamin Levels (B12, D)') {
    return (
      <>
        <span className="block">Vitamin Levels</span>
        <span className="block">(B12, D)</span>
      </>
    );
  }
  if (t === 'Cardiac Risk Markers') {
    return (
      <>
        <span className="block">Cardiac Risk</span>
        <span className="block">Markers</span>
      </>
    );
  }

  // Dynamic fallback: split on parentheses or midpoint
  if (t.includes('(')) {
    const idx = t.indexOf('(');
    return (
      <>
        <span className="block">{t.substring(0, idx).trim()}</span>
        <span className="block">{t.substring(idx).trim()}</span>
      </>
    );
  }
  const words = t.split(' ');
  if (words.length >= 2) {
    const half = Math.ceil(words.length / 2);
    return (
      <>
        <span className="block">{words.slice(0, half).join(' ')}</span>
        <span className="block">{words.slice(half).join(' ')}</span>
      </>
    );
  }

  return <span>{title}</span>;
}

export function CampaignIncludedServices({
  items,
  sectionTitle,
}: CampaignIncludedServicesProps) {
  if (!items || items.length === 0) return null;

  const displayHeading = sectionTitle || '72+ Tests for Complete Senior Health Assessment';

  return (
    <section id="included-tests" className="py-8 sm:py-12 md:py-14 bg-[#eef8f4] border-b border-emerald-100/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Row: Title on Left, View All Button on Right */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-5 sm:mb-7">
          <div>
            <span className="text-[10px] sm:text-[11px] font-extrabold tracking-wider text-emerald-800 uppercase block mb-1">
              WHAT&apos;S INCLUDED
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-[32px] font-black text-slate-900 tracking-tight font-sans leading-tight">
              {displayHeading}
            </h2>
          </div>

          {/* Mint Pill Button matching reference */}
          <a
            href="#campaign-enquiry-card"
            className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-1.5 rounded-full bg-[#dcf3e8] hover:bg-[#ceeada] text-[#0d6e46] text-xs font-bold transition-colors w-fit self-start sm:self-auto shadow-2xs"
          >
            <span>View All 72 Tests</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* 2-Column on Mobile, 4-Column on Desktop Grid matching reference exactly */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 shadow-2xs hover:shadow-xs transition-shadow flex items-center gap-2.5 sm:gap-3.5 border border-emerald-50/40"
            >
              {/* Medical Diagnostic Colored SVG Icon */}
              <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center shrink-0">
                <DiagnosticCardIcon iconName={item.icon} title={item.title} />
              </div>

              {/* Two-Line Bold Title */}
              <div className="min-w-0 font-bold text-slate-900 text-[11px] sm:text-xs lg:text-[13px] leading-tight sm:leading-[1.25]">
                {renderFormattedTitle(item.title)}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default CampaignIncludedServices;
