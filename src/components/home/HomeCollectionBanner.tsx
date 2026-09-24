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
  const [data, setData] = useState(initialData);
  const [modalOpen, setModalOpen] = useState(false);
  const [bgError, setBgError] = useState(false);
  const [bikeError, setBikeError] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const bikeRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const [isReverse, setIsReverse] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    setData(initialData);
    setBgError(false);
    setBikeError(false);
  }, [initialData]);

  useEffect(() => {
    if (!initialData) {
      fetch('/api/home-collection-banner')
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data) {
            setData(json.data);
          }
        })
        .catch(() => { });
    }
  }, [initialData]);

  // If set to inactive explicitly in admin, do not render
  if (data?.isActive === false) {
    return null;
  }

  const badge = data?.badgeText || 'HOME COLLECTION';
  const prefix = data?.titlePrefix || 'Healthcare that';
  const highlight = data?.titleHighlight || 'comes home.';
  const subtitle =
    data?.subtitle ||
    'Professional sample collection at your doorstep. Safe, convenient and trusted by thousands.';
  const bgImage = data?.bgImageUrl || '';
  const bikeImage = data?.bikeImageUrl || '';
  const buttonText = data?.buttonText || 'Book Home Collection';
  const buttonLink = data?.buttonLink || '/home-collection';
  const animationEnabled = data?.animationEnabled !== false;

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
        className="relative w-full overflow-hidden border-y border-slate-200/80 bg-gradient-to-b from-sky-100/60 via-slate-50 to-slate-200 min-h-[460px] sm:min-h-[520px] lg:min-h-[580px] flex flex-col justify-between"
      >
        {/* Full-width Background Image */}
        {bgImage && !bgError ? (
          <div className="absolute inset-0 z-0">
            <Image
              src={bgImage}
              alt="Home Collection Banner"
              fill
              priority
              className="object-cover object-center w-full h-full"
              sizes="100vw"
              onError={() => setBgError(true)}
            />
            {/* Gradient overlay matching Admin live preview */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-black/20" />
          </div>
        ) : (
          /* Fallback Full-width Scenery when no custom background image uploaded or on error */
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-200/60 via-slate-100 to-slate-300">
            <div className="absolute bottom-0 left-0 right-0 h-28 sm:h-36 lg:h-40 bg-slate-800 border-t-4 border-slate-700 flex items-center">
              <div className="w-full border-b-2 border-dashed border-white/60" />
              <div className="absolute bottom-0 left-0 right-0 h-4 bg-emerald-700" />
            </div>
          </div>
        )}

        {/* Top / Center Text Content */}
        <div className="relative z-10 pt-8 sm:pt-10 lg:pt-12 pb-4 sm:pb-6 px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto flex flex-col items-center">
          {/* Badge */}
          {badge && (
            <div className="inline-flex items-center gap-1.5 bg-white/95 backdrop-blur-md px-3.5 sm:px-4 py-1 rounded-full shadow-sm border border-slate-200 mb-2.5 transition-transform hover:scale-105">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-widest text-slate-800">
                {badge}
              </span>
            </div>
          )}

          {/* Main Heading */}
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight drop-shadow-sm font-sans space-y-0.5">
            {prefix && <span className="block">{prefix}</span>}
            {highlight && (
              <span className="block text-brand-700 font-black">
                {highlight}
              </span>
            )}
          </h2>

          {/* Subtitle */}
          {subtitle && (
            <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm lg:text-base text-slate-700 font-medium max-w-xl leading-relaxed drop-shadow-[0_1px_2px_rgba(255,255,255,0.85)]">
              {subtitle}
            </p>
          )}

          {/* Action Button with generous bottom margin to clear the rider */}
          {buttonText && (
            <div className="mt-4 sm:mt-5 mb-10 sm:mb-14 lg:mb-18">
              {isModalTrigger ? (
                <button
                  onClick={() => setModalOpen(true)}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 gold-gradient hover:gold-gradient-hover text-brand-900 font-extrabold text-xs sm:text-sm rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  {buttonText} →
                </button>
              ) : (
                <Link
                  href={buttonLink}
                  className="inline-block px-6 sm:px-8 py-2.5 sm:py-3 gold-gradient hover:gold-gradient-hover text-brand-900 font-extrabold text-xs sm:text-sm rounded-full shadow-lg transition-all transform hover:scale-105 active:scale-95"
                >
                  {buttonText} →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Full-width Road & Animated Travelling Bike (High z-index to avoid clipping) */}
        <div className="relative z-30 w-full h-32 sm:h-44 lg:h-52 pointer-events-none">
          {bikeImage && !bikeError ? (
            /* Custom Uploaded Transparent Bike Cutout */
            <div
              ref={bikeRef}
              className="absolute bottom-2 sm:bottom-4 lg:bottom-6 z-30 w-44 sm:w-64 lg:w-80 h-32 sm:h-44 lg:h-52 transition-transform duration-300 ease-out will-change-transform"
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
                  className="object-contain object-bottom"
                  sizes="(max-width: 640px) 200px, (max-width: 1024px) 280px, 340px"
                  onError={() => setBikeError(true)}
                />
              </div>
            </div>
          ) : (
            /* Fallback Graphic Bike Rider */
            <div
              ref={bikeRef}
              className="absolute bottom-2 sm:bottom-4 lg:bottom-6 z-30 w-40 sm:w-56 lg:w-64 transition-transform duration-300 ease-out will-change-transform"
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
