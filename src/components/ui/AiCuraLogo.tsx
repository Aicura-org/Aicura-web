'use client';

import React from 'react';
import Link from 'next/link';

interface AiCuraLogoProps {
  className?: string;
  variant?: 'light' | 'dark' | 'auto';
  imageClassName?: string;
}

export function AiCuraLogo({
  className = '',
  variant = 'dark',
  imageClassName = 'h-9 sm:h-12 w-auto object-contain group-hover:scale-105 transition-transform',
}: AiCuraLogoProps) {
  const isLight = variant === 'light';
  const logoSrc = isLight ? '/logo.webp' : '/logo-dark.webp';

  return (
    <Link href="/" className={`inline-flex items-center group ${className}`} aria-label="AiCura Diagnostics">
      <img
        src={logoSrc}
        alt="AiCura Diagnostics"
        className={imageClassName}
      />
    </Link>
  );
}

export default AiCuraLogo;

