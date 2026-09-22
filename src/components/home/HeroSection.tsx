'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface HeroSlide {
  id?: string;
  buttonLink?: string | null;
  imageUrl?: string | null;
  mobileImageUrl?: string | null;
  title?: string | null;
}

interface HeroSectionProps {
  initialBanners?: HeroSlide[] | null;
}

export default function HeroSection({ initialBanners }: HeroSectionProps) {
  const [banners, setBanners] = useState<HeroSlide[]>(initialBanners || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);

  // Fallback client-side fetch if initialBanners not supplied
  useEffect(() => {
    async function loadHeroConfig() {
      try {
        const res = await fetch('/api/hero');
        if (res.ok) {
          const json = await res.json();
          if (json.success && Array.isArray(json.data) && json.data.length > 0) {
            setBanners(json.data);
          }
        }
      } catch (err) {
        console.error('Failed loading hero config:', err);
      }
    }

    if (!initialBanners || initialBanners.length === 0) {
      loadHeroConfig();
    }
  }, [initialBanners]);

  const validSlides = banners.filter(
    (b) => Boolean(b.imageUrl) || Boolean(b.mobileImageUrl)
  );

  const totalSlides = validSlides.length;

  const nextSlide = useCallback(() => {
    if (totalSlides > 1) {
      setCurrentIndex((prev) => (prev + 1) % totalSlides);
    }
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    if (totalSlides > 1) {
      setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    }
  }, [totalSlides]);

  // Auto-advance every 3 seconds
  useEffect(() => {
    if (totalSlides <= 1 || isPaused) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [totalSlides, isPaused, nextSlide]);

  // Touch Swipe Handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;

    // Minimum swipe threshold of 50px
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartXRef.current = null;
  };

  // If no banners exist, render the clean placeholder
  if (totalSlides === 0) {
    return (
      <section className="w-full overflow-hidden">
        <div className="relative w-full h-[65vh] min-h-[480px] lg:h-[82vh] bg-slate-950 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-950 via-brand-900 to-slate-900" />
        </div>
      </section>
    );
  }

  const currentSlide = validSlides[currentIndex] || validSlides[0];
  const targetLink = currentSlide.buttonLink || '/packages';

  return (
    <section
      className="relative w-full overflow-hidden bg-slate-950 select-none group"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="Homepage Hero Banners"
    >
      <div className="relative w-full h-[65vh] min-h-[480px] lg:h-[82vh]">
        {/* Slides Track */}
        {validSlides.map((slide, index) => {
          const isCurrent = index === currentIndex;
          const desktopImg = slide.imageUrl || slide.mobileImageUrl;
          const mobileImg = slide.mobileImageUrl || slide.imageUrl;
          const slideLink = slide.buttonLink || '/packages';

          return (
            <div
              key={slide.id || index}
              className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                isCurrent
                  ? 'opacity-100 z-10 pointer-events-auto'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
              aria-hidden={!isCurrent}
            >
              <Link href={slideLink} className="block w-full h-full cursor-pointer">
                {/* Desktop Image */}
                {desktopImg && (
                  <div
                    className={
                      mobileImg && mobileImg !== desktopImg
                        ? 'hidden md:block absolute inset-0 w-full h-full'
                        : 'absolute inset-0 w-full h-full'
                    }
                  >
                    <Image
                      src={desktopImg}
                      alt={slide.title || `Hero Banner ${index + 1}`}
                      fill
                      className="object-cover object-center w-full h-full group-hover:scale-[1.01] transition-transform duration-500"
                      priority={index === 0}
                    />
                  </div>
                )}

                {/* Mobile Image */}
                {mobileImg && mobileImg !== desktopImg && (
                  <div className="block md:hidden absolute inset-0 w-full h-full">
                    <Image
                      src={mobileImg}
                      alt={slide.title || `Mobile Banner ${index + 1}`}
                      fill
                      className="object-cover object-center w-full h-full"
                      priority={index === 0}
                    />
                  </div>
                )}
              </Link>
            </div>
          );
        })}

        {/* Carousel Controls (Show only if more than 1 slide exists) */}
        {totalSlides > 1 && (
          <>
            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                prevSlide();
              }}
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all duration-200 hover:scale-110 shadow-lg z-20 focus:outline-none focus:ring-2 focus:ring-yellow-400 opacity-80 sm:opacity-0 group-hover:opacity-100"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                nextSlide();
              }}
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/75 text-white backdrop-blur-md flex items-center justify-center border border-white/20 transition-all duration-200 hover:scale-110 shadow-lg z-20 focus:outline-none focus:ring-2 focus:ring-yellow-400 opacity-80 sm:opacity-0 group-hover:opacity-100"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Carousel Indicator Dots */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-full border border-white/10">
              {validSlides.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setCurrentIndex(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 focus:outline-none ${
                    idx === currentIndex
                      ? 'w-7 bg-yellow-400 shadow-md'
                      : 'w-2 bg-white/50 hover:bg-white/80'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}


