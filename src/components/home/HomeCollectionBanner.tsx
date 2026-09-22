'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import EnquireModal from '../ui/EnquireModal';

export interface HomeCollectionBannerProps {
  initialData?: {
    id?: string;
    badgeText?: string | null;
    titlePrefix?: string | null;
    titleHighlight?: string | null;
    subtitle?: string | null;
    bgImageUrl?: string | null;
    bikeImageUrl?: string | null;
    buttonText?: string | null;
    buttonLink?: string | null;
    animationSpeed?: number;
    animationEnabled?: boolean;
    isActive?: boolean;
  } | null;
}

export default function HomeCollectionBanner({ initialData }: HomeCollectionBannerProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const bikeRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isReverse, setIsReverse] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  // If set to inactive explicitly in admin, do not render
  if (initialData?.isActive === false) {
    return null;
  }

  const badge = initialData?.badgeText || 'HOME COLLECTION';
  const prefix = initialData?.titlePrefix || 'Healthcare that';
  const highlight = initialData?.titleHighlight || 'comes home.';
  const subtitle =
    initialData?.subtitle ||
    'Professional sample collection at your doorstep. Safe, convenient and trusted by thousands.';
  const bgImage = initialData?.bgImageUrl || '';
  const bikeImage = initialData?.bikeImageUrl || '';
  const buttonText = initialData?.buttonText || 'Book Home Collection';
  const buttonLink = initialData?.buttonLink || '/home-collection';
  const animationEnabled = initialData?.animationEnabled !== false;

  const isModalTrigger = !buttonLink || buttonLink === '#modal' || buttonLink.startsWith('modal');

  useEffect(() => {
    if (!animationEnabled) return;

    let ticking = false;

    const updateBikePosition = () => {
      const section = sectionRef.current;
      const bike = bikeRef.current;
      if (!section || !bike) return;

      const rect = section.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;

      // Progress: 0 when top of section enters bottom of viewport, 1 when bottom leaves top of viewport
      const totalDistance = windowHeight + rect.height;
      const currentDistance = windowHeight - rect.top;
      const progress = Math.min(Math.max(currentDistance / totalDistance, 0), 1);

      // Travel smoothly from -12% to 105% across the screen
      const leftPercent = -12 + progress * 117;
      bike.style.left = `${leftPercent}%`;

      const currentScrollY = window.scrollY || window.pageYOffset;
      if (currentScrollY > lastScrollY.current + 2) {
        setIsReverse(false);
      } else if (currentScrollY < lastScrollY.current - 2) {
        setIsReverse(true);
      }
      lastScrollY.current = currentScrollY;

      setIsScrolling(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);

      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateBikePosition);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    // Initial position calculation
    updateBikePosition();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [animationEnabled]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden border-y border-slate-200/80 bg-gradient-to-b from-sky-100/60 via-slate-50 to-slate-200 min-h-[380px] sm:min-h-[460px] lg:min-h-[520px] flex flex-col justify-between"
      >
        {/* Full-width Background Image */}
        {bgImage ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt="Home Collection Banner"
              fill
              priority
              className="object-cover object-center w-full h-full"
              sizes="100vw"
            />
            {/* Subtle overlay for text clarity */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/20 to-black/30" />
          </div>
        ) : (
          /* Fallback Full-width Scenery when no custom background image uploaded */
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-200/60 via-slate-100 to-slate-300">
            <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 lg:h-40 bg-slate-800 border-t-4 border-slate-700 flex items-center">
              <div className="w-full border-b-2 border-dashed border-white/60" />
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-emerald-700" />
            </div>
          </div>
        )}

        {/* Top / Center Text Content */}
        <div className="relative z-10 pt-10 sm:pt-14 lg:pt-16 px-4 sm:px-6 lg:px-8 text-center max-w-4xl mx-auto flex flex-col items-center">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-4 sm:px-5 py-1.5 rounded-full shadow-md border border-slate-200 mb-4 transition-transform hover:scale-105">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-slate-800">
                {badge}
              </span>
            </div>
          )}

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight drop-shadow-sm font-sans">
            {prefix}{' '}
            {highlight && (
              <span className="text-brand-700 underline decoration-yellow-400 decoration-4 underline-offset-4">
                {highlight}
              </span>
            )}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-3 sm:mt-4 text-sm sm:text-base lg:text-lg text-slate-700 font-medium max-w-2xl leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              {subtitle}
            </p>
          )}

          {/* Action Button */}
          {buttonText && (
            <div className="mt-5 sm:mt-6">
              {isModalTrigger ? (
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-7 sm:px-9 py-3.5 sm:py-4 gold-gradient hover:gold-gradient-hover text-brand-900 font-extrabold text-sm sm:text-base rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95"
                >
                  {buttonText} →
                </button>
              ) : (
                <Link
                  href={buttonLink}
                  className="inline-block px-7 sm:px-9 py-3.5 sm:py-4 gold-gradient hover:gold-gradient-hover text-brand-900 font-extrabold text-sm sm:text-base rounded-full shadow-xl transition-all transform hover:scale-105 active:scale-95"
                >
                  {buttonText} →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Full-width Road & Animated Travelling Bike */}
        <div className="relative z-10 w-full h-28 sm:h-36 lg:h-44 overflow-hidden pointer-events-none">
          {bikeImage ? (
            /* Custom Uploaded Transparent Bike Cutout */
            <div
              ref={bikeRef}
              className="absolute bottom-2 sm:bottom-4 lg:bottom-6 w-40 sm:w-56 lg:w-72 h-24 sm:h-36 lg:h-44 transition-transform duration-300 ease-out will-change-transform"
              style={{
                left: animationEnabled ? '-12%' : '25%',
                transform: isReverse ? 'scaleX(-1)' : 'scaleX(1)',
              }}
            >
              <div className={`relative w-full h-full ${isScrolling ? 'animate-bounce-subtle' : ''}`}>
                <Image
                  src={bikeImage}
                  alt="Sample Collection Executive"
                  fill
                  className="object-contain"
                  sizes="(max-width: 640px) 180px, (max-width: 1024px) 240px, 300px"
                />
              </div>
            </div>
          ) : (
            /* Fallback Graphic Bike Rider */
            <div
              ref={bikeRef}
              className="absolute bottom-2 sm:bottom-4 lg:bottom-6 w-40 sm:w-56 lg:w-64 transition-transform duration-300 ease-out will-change-transform"
              style={{
                left: animationEnabled ? '-12%' : '25%',
                transform: isReverse ? 'scaleX(-1)' : 'scaleX(1)',
              }}
            >
              <div className={`relative flex items-center ${isScrolling ? 'animate-bounce-subtle' : ''}`}>
                <svg
                  viewBox="0 0 200 120"
                  className="w-full h-auto drop-shadow-xl"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect x="25" y="32" width="38" height="34" rx="5" fill="#005A5B" />
                  <rect x="29" y="36" width="30" height="26" rx="3" fill="#00796B" />
                  <text x="33" y="52" fill="#FACC15" fontSize="7" fontWeight="bold">AiCura</text>
                  <text x="33" y="59" fill="#FFFFFF" fontSize="5">Lab Care</text>
                  
                  <circle cx="92" cy="22" r="11" fill="#0F172A" />
                  <rect x="94" y="22" width="10" height="4" rx="2" fill="#38BDF8" />
                  <path d="M78 35 L102 35 L96 68 L76 68 Z" fill="#005A5B" />
                  <path d="M96 42 L116 52 L112 56 L94 46 Z" fill="#005A5B" />
                  <path d="M82 68 L98 68 L104 90 L88 90 Z" fill="#1E293B" />

                  <path d="M45 80 L75 80 L108 80 L135 62 L125 50 L115 50 L95 72 L50 72 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
                  <path d="M120 46 L138 60 L144 60 L128 44 Z" fill="#005A5B" />
                  <rect x="116" y="44" width="14" height="4" rx="2" fill="#334155" />
                  <circle cx="140" cy="58" r="4" fill="#FEF08A" />
                  
                  <circle cx="50" cy="90" r="16" fill="#1E293B" stroke="#64748B" strokeWidth="4" />
                  <circle cx="50" cy="90" r="7" fill="#E2E8F0" />
                  <circle cx="142" cy="90" r="16" fill="#1E293B" stroke="#64748B" strokeWidth="4" />
                  <circle cx="142" cy="90" r="7" fill="#E2E8F0" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Embedded Global Keyframe Style */}
      <style jsx global>{`
        @keyframes subtleBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-3px);
          }
        }
        .animate-bounce-subtle {
          animation: subtleBounce 0.3s ease-in-out infinite;
        }
      `}</style>

      {/* Booking Enquiry Modal */}
      <EnquireModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType="home_collection"
      />
    </>
  );
}
