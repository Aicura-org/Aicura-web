'use client';

import React from 'react';
import Link from 'next/link';

interface AiCuraLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  showSubtitle?: boolean;
}

export function AiCuraLogo({
  className = '',
  variant = 'dark',
  showSubtitle = true,
}: AiCuraLogoProps) {
  const isDarkText = variant === 'dark' || variant === 'auto';

  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 group ${className}`} aria-label="AiCura Diagnostics">
      {/* Brand Icon: Folded Geometric Ribbon / Prism Mark matching reference */}
      <div className="relative w-8 h-8 sm:w-9 sm:h-9 shrink-0 flex items-center justify-center">
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full transform transition-transform group-hover:scale-105 duration-200"
        >
          {/* Left Ribbon Facet (Deep Emerald/Teal) */}
          <path
            d="M8 20L20 6L20 34L8 20Z"
            fill="#064E3B"
            className="transition-colors"
          />
          {/* Right Ribbon Facet (Vibrant Cyan/Teal) */}
          <path
            d="M20 6L32 20L20 34L20 6Z"
            fill="#0D9488"
            className="transition-colors"
          />
          {/* Inner Accent Angle / Fold Highlight */}
          <path
            d="M14 20L20 13L26 20L20 27L14 20Z"
            fill="#14B8A6"
            fillOpacity="0.4"
          />
          <path
            d="M20 13L26 20L20 27V13Z"
            fill="#5EEAD4"
            fillOpacity="0.6"
          />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col justify-center leading-none">
        <span
          className={`font-black text-lg sm:text-xl tracking-tight transition-colors ${
            isDarkText ? 'text-slate-900 group-hover:text-teal-900' : 'text-white'
          }`}
          style={{ fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)' }}
        >
          AiCura
        </span>
        {showSubtitle && (
          <span
            className={`text-[9.5px] sm:text-[10px] font-bold tracking-[0.14em] uppercase transition-colors -mt-0.5 ${
              isDarkText ? 'text-teal-800/90' : 'text-emerald-200'
            }`}
          >
            Diagnostics
          </span>
        )}
      </div>
    </Link>
  );
}

export default AiCuraLogo;
