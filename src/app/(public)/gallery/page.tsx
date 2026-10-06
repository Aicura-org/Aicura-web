'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { X, ZoomIn, Tag, Loader2, ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

interface GalleryImage {
  id: string;
  imageUrl: string;
  title: string | null;
  description: string | null;
  category: string;
  altText: string | null;
  displayOrder: number;
  isActive: boolean;
}

const CATEGORIES = ['all', 'general', 'lab', 'team', 'equipment', 'facility', 'events', 'certificates'];

const categoryLabels: Record<string, string> = {
  all: 'All Photos',
  general: 'General',
  lab: 'Laboratory',
  team: 'Our Team',
  equipment: 'Equipment',
  facility: 'Facility',
  events: 'Events',
  certificates: 'Certificates',
};

function LightboxModal({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  const img = images[index];

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose, onPrev, onNext]);

  if (!img) return null;

  return (
    <div
      className="fixed inset-0 z-[999] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Counter */}
      <div className="absolute top-5 left-5 text-white/60 text-sm font-medium z-10">
        {index + 1} / {images.length}
      </div>

      {/* Prev */}
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Next */}
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Image + Caption */}
      <div
        className="relative flex flex-col items-center gap-4 max-w-5xl w-full max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative w-full max-h-[75vh] rounded-2xl overflow-hidden shadow-2xl">
          <Image
            src={img.imageUrl}
            alt={img.altText || img.title || 'Gallery image'}
            width={1200}
            height={800}
            className="object-contain w-full max-h-[75vh]"
            priority
          />
        </div>
        {(img.title || img.description) && (
          <div className="text-center">
            {img.title && (
              <p className="text-white font-semibold text-base">{img.title}</p>
            )}
            {img.description && (
              <p className="text-white/60 text-sm mt-1">{img.description}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch('/api/gallery');
        const json = await res.json();
        if (json.success) {
          // Only show active images
          setImages((json.data || []).filter((img: GalleryImage) => img.isActive));
        }
      } catch {
        // Silently fail on public page
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  }, []);

  const filtered =
    activeCategory === 'all'
      ? images
      : images.filter((img) => img.category === activeCategory);

  // Only show categories that have images
  const availableCategories = CATEGORIES.filter(
    (cat) => cat === 'all' || images.some((img) => img.category === cat)
  );

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    document.body.style.overflow = '';
  }, []);

  const gotoPrev = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }, [filtered.length]);

  const gotoNext = useCallback(() => {
    setLightboxIndex((i) => (i === null ? null : (i + 1) % filtered.length));
  }, [filtered.length]);

  return (
    <>
      {/* Lightbox */}
      {lightboxIndex !== null && (
        <LightboxModal
          images={filtered}
          index={lightboxIndex}
          onClose={closeLightbox}
          onPrev={gotoPrev}
          onNext={gotoNext}
        />
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#0b2e2d] via-[#0f3938] to-[#134e4a] py-20 px-6 overflow-hidden">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #facc15 1px, transparent 1px)', backgroundSize: '32px 32px' }}
        />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-yellow-400/20 border border-yellow-400/30 text-yellow-300 text-xs font-semibold tracking-widest uppercase mb-5">
            <Tag className="w-3.5 h-3.5" /> Our Gallery
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight mb-4">
            A Look Inside{' '}
            <span className="text-yellow-400">AiCura Diagnostics</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Explore our state-of-the-art laboratory, dedicated team, and world-class facilities — because transparency builds trust.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">

        {/* Category Filter */}
        {!loading && availableCategories.length > 1 && (
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-10">
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all border ${
                  activeCategory === cat
                    ? 'bg-[#0f3938] text-yellow-400 border-[#0f3938] shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-[#0f3938]/40 hover:text-[#0f3938]'
                }`}
              >
                {categoryLabels[cat] || cat}
                {cat !== 'all' && (
                  <span className={`ml-1.5 text-xs ${activeCategory === cat ? 'text-yellow-300' : 'text-slate-400'}`}>
                    ({images.filter((img) => img.category === cat).length})
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-4 text-slate-400">
            <Loader2 className="w-10 h-10 animate-spin text-[#0f3938]" />
            <p className="text-sm">Loading gallery...</p>
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 gap-5">
            <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center">
              <ImageIcon className="w-10 h-10 text-slate-300" />
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-slate-700">No photos yet</p>
              <p className="text-sm text-slate-400 mt-1.5">Check back soon — we're adding photos regularly.</p>
            </div>
          </div>
        )}

        {/* Masonry-style Gallery Grid */}
        {!loading && filtered.length > 0 && (
          <>
            <p className="text-center text-xs text-slate-400 mb-6">
              {filtered.length} photo{filtered.length !== 1 ? 's' : ''}
              {activeCategory !== 'all' ? ` in ${categoryLabels[activeCategory] || activeCategory}` : ''}
            </p>
            <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-0">
              {filtered.map((img, idx) => (
                <div
                  key={img.id}
                  onClick={() => openLightbox(idx)}
                  className="break-inside-avoid mb-4 group relative rounded-2xl overflow-hidden cursor-zoom-in bg-slate-100 border border-slate-200 hover:border-[#0f3938]/30 hover:shadow-xl transition-all duration-300"
                >
                  <Image
                    src={img.imageUrl}
                    alt={img.altText || img.title || 'Gallery photo'}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        {img.title && (
                          <p className="text-white text-sm font-semibold truncate leading-tight">{img.title}</p>
                        )}
                        {img.description && (
                          <p className="text-white/70 text-xs mt-0.5 line-clamp-2">{img.description}</p>
                        )}
                      </div>
                      <div className="ml-2 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                        <ZoomIn className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </div>

                  {/* Category badge */}
                  <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-sm text-white text-[10px] font-semibold">
                      {categoryLabels[img.category] || img.category}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA Banner */}
      {!loading && (
        <section className="bg-gradient-to-r from-[#0b2e2d] to-[#134e4a] py-14 px-6 mt-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
              Visit Our Diagnostic Centre
            </h2>
            <p className="text-slate-300 text-sm mb-7 leading-relaxed">
              Experience our world-class facilities in person. Book a home collection or walk in — we're here for you.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a
                href="/home-collection"
                className="px-6 py-3 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold text-sm transition-colors shadow-lg"
              >
                Book Home Collection
              </a>
              <a
                href="/contact"
                className="px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 text-white font-semibold text-sm transition-colors"
              >
                Contact Us
              </a>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
