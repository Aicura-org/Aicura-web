'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialItem {
  id: string;
  patientName: string;
  location: string;
  comment: string;
  rating: number;
  avatarUrl?: string | null;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    async function fetchTestimonials() {
      try {
        const res = await fetch('/api/testimonials');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setTestimonials(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load testimonials:', err);
      }
    }
    fetchTestimonials();
  }, []);

  return (
    <section className="py-16 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-brand-700 text-xs font-bold uppercase tracking-wider block mb-1">
              PATIENT REVIEWS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
              Trusted By Our Patients
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Real experiences. Real trust.
            </p>
          </div>

          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <button
              aria-label="Previous review"
              className="w-9 h-9 rounded-full border border-slate-200 hover:border-brand-700 hover:bg-brand-700 hover:text-white flex items-center justify-center text-slate-600 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              aria-label="Next review"
              className="w-9 h-9 rounded-full border border-slate-200 hover:border-brand-700 hover:bg-brand-700 hover:text-white flex items-center justify-center text-slate-600 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-lg transition-all flex flex-col justify-between relative group"
            >
              <Quote className="w-8 h-8 text-emerald-200/60 absolute top-4 right-4 group-hover:text-emerald-300/80 transition-colors" />

              <div className="space-y-4">
                {/* Rating Stars */}
                <div className="flex items-center gap-1 text-yellow-400">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Comment */}
                <p className="text-slate-700 text-sm italic leading-relaxed">
                  "{item.comment}"
                </p>
              </div>

              {/* Patient Info */}
              <div className="flex items-center gap-3 pt-6 border-t border-slate-200/70 mt-4">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-brand-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  {item.avatarUrl ? (
                    <Image src={item.avatarUrl} alt={item.patientName} fill className="object-cover" />
                  ) : (
                    item.patientName.charAt(0)
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
          ))}
        </div>

      </div>
    </section>
  );
}
