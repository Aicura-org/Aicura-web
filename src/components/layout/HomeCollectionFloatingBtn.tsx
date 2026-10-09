'use client';

import React from 'react';
import Link from 'next/link';

interface HomeCollectionFloatingBtnProps {
  className?: string;
  bottomOffsetClass?: string;
}

export default function HomeCollectionFloatingBtn({
  className = '',
  bottomOffsetClass = 'bottom-[92px] right-6',
}: HomeCollectionFloatingBtnProps) {
  return (
    <Link
      href="/home-collection"
      aria-label="Book Home Sample Collection"
      title="Book Home Sample Collection"
      className={`fixed ${bottomOffsetClass} z-50 w-14 h-14 bg-gradient-to-tr from-brand-900 via-brand-800 to-teal-700 hover:from-brand-800 hover:to-teal-600 text-white rounded-full flex items-center justify-center shadow-xl hover:shadow-2xl hover:shadow-teal-900/40 border border-teal-500/30 transition-all duration-200 hover:scale-110 active:scale-95 group ${className}`}
    >
      {/* Mini "HOME" badge with high-contrast readable dark text */}
      <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#facc15] !text-slate-950 text-[9.5px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-md border border-slate-900/80 whitespace-nowrap pointer-events-none">
        HOME
      </span>

      {/* Concept A: Diagnostic Vacutainer (Blood Sample Tube) + Doorstep Frame + Droplet */}
      <svg
        viewBox="0 0 32 32"
        fill="none"
        className="w-8 h-8 text-white transition-transform group-hover:scale-105"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        {/* Doorstep / Home Architectural Frame */}
        <path
          d="M4 14L16 4.5L28 14V25.5C28 26.6 27.1 27.5 26 27.5H6C4.9 27.5 4 26.6 4 25.5V14Z"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white/80"
        />

        {/* Doorstep Threshold Detail */}
        <path
          d="M7.5 27.5V22C7.5 21.4 8 21 8.6 21H10.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          className="text-teal-200/50"
        />

        {/* Diagnostic Vacutainer Blood Tube */}
        {/* Gold Cap / Rubber Stopper */}
        <rect
          x="13.5"
          y="9.5"
          width="5"
          height="2.5"
          rx="0.8"
          fill="#FACC15"
        />
        {/* Transparent Glass Tube Body */}
        <path
          d="M14 12V21C14 22.1 14.9 23 16 23C17.1 23 18 22.1 18 21V12"
          stroke="white"
          strokeWidth="1.7"
          strokeLinecap="round"
        />
        {/* Blood / Clinical Sample Fill */}
        <path
          d="M14.4 16.5V21C14.4 21.9 15.1 22.6 16 22.6C16.9 22.6 17.6 21.9 17.6 21V16.5H14.4Z"
          fill="#EF4444"
        />
        {/* Graduation / Calibration Marks */}
        <line x1="16.2" y1="14" x2="17.6" y2="14" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
        <line x1="16.2" y1="15.5" x2="17.6" y2="15.5" stroke="white" strokeWidth="0.8" strokeLinecap="round" />

        {/* Diagnostic Blood Droplet (Golden with highlight) */}
        <path
          d="M22.5 15C22.5 15 25 18 25 19.5C25 20.9 23.9 22 22.5 22C21.1 22 20 20.9 20 19.5C20 18 22.5 15 22.5 15Z"
          fill="#FACC15"
        />
        <circle cx="21.8" cy="18.8" r="0.6" fill="white" fillOpacity="0.8" />
      </svg>

      {/* Tooltip on Hover */}
      <span className="absolute right-16 top-3 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium shadow-md pointer-events-none">
        Book Home Sample Collection 🧪🏠
      </span>
    </Link>
  );
}
