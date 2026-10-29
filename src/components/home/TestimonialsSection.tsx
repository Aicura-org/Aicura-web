'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export interface TestimonialDisplayItem {
  id: string;
  patientName: string;
  location: string;
  comment: string;
  rating: number;
  avatarUrl?: string | null;
}

interface TestimonialsSectionProps {
  initialData?: TestimonialDisplayItem[];
}

function TestimonialCard({ item }: { item: TestimonialDisplayItem }) {
  return (
    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative group h-full">
      <Quote className="w-8 h-8 text-emerald-200/60 absolute top-4 right-4 group-hover:text-emerald-300/80 transition-colors" />

      <div className="space-y-4">
        <div className="flex items-center gap-1 text-yellow-400">
          {Array.from({ length: item.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          ))}
        </div>

        <p className="text-slate-700 text-sm italic leading-relaxed">
          &ldquo;{item.comment}&rdquo;
        </p>
      </div>

      <div className="flex items-center gap-3 pt-6 border-t border-slate-200/70 mt-4">
        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-brand-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
          {item.avatarUrl ? (
            <Image src={item.avatarUrl} alt={item.patientName} fill className="object-cover" />
          ) : (
            item.patientName.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900 leading-tight">
            {item.patientName}
          </h3>
          <span className="text-xs text-slate-500">{item.location}</span>
        </div>
      </div>
    </div>
  );
}

const DESKTOP_PAGE_SIZE = 3;
const AUTO_SLIDE_INTERVAL_MS = 4000;

export default function TestimonialsSection({ initialData }: TestimonialsSectionProps) {
  const [testimonials, setTestimonials] = useState<TestimonialDisplayItem[]>(initialData || []);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (initialData !== undefined) {
      setTestimonials(initialData);
      return;
    }

    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data)) {
            setTestimonials(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      }
    }
    fetchTestimonials();
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const total = testimonials.length;
  const canSlide = total > DESKTOP_PAGE_SIZE;

  const handleNext = useCallback(() => {
    if (!canSlide) return;

    if (currentIndex >= total) {
      // Snap back to 0 without transition, then slide to 1
      setIsTransitioning(false);
      setCurrentIndex(0);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setIsTransitioning(true);
          setCurrentIndex(1);
        });
      });
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canSlide, currentIndex, total]);

  const handlePrev = useCallback(() => {
    if (!canSlide) return;

    if (currentIndex <= 0) {
      // Snap to total (cloned start position) without transition, then slide to total - 1
      setIsTransitioning(false);
      setCurrentIndex(total);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => {
          setIsTransitioning(true);
          setCurrentIndex(total - 1);
        });
      });
    } else {
      setIsTransitioning(true);
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canSlide, currentIndex, total]);

  // Auto-slide timer when there are more than 3 testimonials
  useEffect(() => {
    if (!canSlide || isPaused) return;

    const timer = setInterval(() => {
      handleNext();
    }, AUTO_SLIDE_INTERVAL_MS);

    return () => clearInterval(timer);
  }, [canSlide, isPaused, handleNext]);

  const handleTransitionEnd = () => {
    if (currentIndex >= total) {
      setIsTransitioning(false);
      setCurrentIndex(0);
    }
  };

  if (total === 0) {
    return null;
  }

  // Append first 3 items at the end for seamless infinite loop when total > 3
  const desktopTrackItems = canSlide
    ? [...testimonials, ...testimonials.slice(0, DESKTOP_PAGE_SIZE)]
    : testimonials;

  return (
    <section
      id="patient-reviews"
      className="py-16 bg-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Marquee animation for mobile */}
      <style>{`
        @keyframes testimonial-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .testimonial-track {
          animation: testimonial-marquee var(--marquee-duration, 30s) linear infinite;
        }
        .testimonial-track:active { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) {
          .testimonial-track { animation: none; }
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-brand-700 text-xs font-bold uppercase tracking-wider block mb-1">
              PATIENT REVIEWS
            </span>
            <h2 className="font-sans text-2xl font-bold tracking-tight text-black sm:text-4xl">
              Trusted By Our Patients
            </h2>
            <p className="text-slate-600 text-sm mt-1">Real experiences. Real trust.</p>
          </div>

          {/* Desktop Prev/Next buttons when > 3 testimonials */}
          {canSlide && (
            <div className="hidden md:flex items-center gap-2 mt-4 md:mt-0">
              <button
                type="button"
                onClick={handlePrev}
                aria-label="Previous review"
                className="w-9 h-9 rounded-full border border-slate-200 hover:border-brand-700 hover:bg-brand-700 hover:text-white flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                aria-label="Next review"
                className="w-9 h-9 rounded-full border border-slate-200 hover:border-brand-700 hover:bg-brand-700 hover:text-white flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>

        {/* Desktop: Smooth auto-sliding 3-column carousel when > 3, static 3-col grid when <= 3 */}
        {canSlide ? (
          <div className="hidden md:block overflow-hidden -mx-3 py-2">
            <div
              onTransitionEnd={handleTransitionEnd}
              className={`flex w-full ${
                isTransitioning ? 'transition-transform duration-500 ease-in-out' : ''
              }`}
              style={{
                transform: `translateX(-${currentIndex * (100 / DESKTOP_PAGE_SIZE)}%)`,
              }}
            >
              {desktopTrackItems.map((item, idx) => (
                <div
                  key={`${item.id}-${idx}`}
                  className="w-1/3 shrink-0 px-3"
                >
                  <TestimonialCard item={item} />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="hidden md:grid grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <TestimonialCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>

      {/* Mobile: continuous auto-slide */}
      <div className="md:hidden overflow-hidden">
        <div
          className="testimonial-track flex w-max"
          style={{ ['--marquee-duration' as string]: `${Math.max(15, testimonials.length * 7)}s` }}
        >
          {[...testimonials, ...testimonials].map((item, index) => (
            <div key={`${item.id}-${index}`} className="w-[85vw] max-w-[320px] mr-4 shrink-0">
              <TestimonialCard item={item} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
