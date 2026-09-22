'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Sparkles,
  Upload,
  Link as LinkIcon,
  Trash2,
  Save,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Eye,
  ExternalLink,
  Compass,
  Monitor,
  Smartphone,
  Info,
  Plus,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import Image from 'next/image';

interface PackageOption {
  id: string;
  title: string;
  slug: string;
  category: string;
}

interface HeroSlideData {
  id?: string;
  buttonLink: string;
  imageUrl: string;
  imagePublicId: string | null;
  mobileImageUrl: string;
  mobileImagePublicId: string | null;
  displayOrder?: number;
  title?: string | null;
}

const emptySlide = (order: number): HeroSlideData => ({
  buttonLink: '/packages',
  imageUrl: '',
  imagePublicId: null,
  mobileImageUrl: '',
  mobileImagePublicId: null,
  displayOrder: order,
});

export default function AdminHeroPage() {
  const [slides, setSlides] = useState<HeroSlideData[]>([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [packagesList, setPackagesList] = useState<PackageOption[]>([]);
  const [navSelection, setNavSelection] = useState<string>('/packages');
  const [customUrl, setCustomUrl] = useState<string>('');

  // Mode states for desktop image
  const [desktopInputMode, setDesktopInputMode] = useState<'upload' | 'url'>('upload');
  const [desktopPastedUrl, setDesktopPastedUrl] = useState('');
  const [desktopUploading, setDesktopUploading] = useState(false);

  // Mode states for mobile image
  const [mobileInputMode, setMobileInputMode] = useState<'upload' | 'url'>('upload');
  const [mobilePastedUrl, setMobilePastedUrl] = useState('');
  const [mobileUploading, setMobileUploading] = useState(false);

  // Preview states
  const [previewTab, setPreviewTab] = useState<'desktop' | 'mobile'>('desktop');
  const [previewIndex, setPreviewIndex] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    type: 'slide' | 'desktop' | 'mobile';
    slideIndex: number;
  }>({
    isOpen: false,
    type: 'slide',
    slideIndex: 0,
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const desktopFileInputRef = useRef<HTMLInputElement>(null);
  const mobileFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      setLoading(true);

      // 1. Fetch available health packages
      const pkgRes = await fetch('/api/packages', { cache: 'no-store' });
      if (pkgRes.ok) {
        const pkgJson = await pkgRes.json();
        if (pkgJson.success && Array.isArray(pkgJson.data)) {
          setPackagesList(pkgJson.data);
        }
      }

      // 2. Fetch hero carousel slides
      const heroRes = await fetch('/api/hero', { cache: 'no-store' });
      if (heroRes.ok) {
        const heroJson = await heroRes.json();
        if (heroJson.success && Array.isArray(heroJson.data) && heroJson.data.length > 0) {
          const loadedSlides: HeroSlideData[] = heroJson.data.map((item: any, idx: number) => ({
            id: item.id,
            buttonLink: item.buttonLink || '/packages',
            imageUrl: item.imageUrl || '',
            imagePublicId: item.imagePublicId || null,
            mobileImageUrl: item.mobileImageUrl || '',
            mobileImagePublicId: item.mobileImagePublicId || null,
            displayOrder: item.displayOrder ?? idx,
            title: item.title,
          }));
          setSlides(loadedSlides);
          setActiveSlideIndex(0);
          setPreviewIndex(0);
          syncNavSelection(loadedSlides[0]?.buttonLink || '/packages');
          setDesktopPastedUrl(loadedSlides[0]?.imageUrl || '');
          setMobilePastedUrl(loadedSlides[0]?.mobileImageUrl || '');
        } else {
          // Default initial slide
          const defaultSlides = [emptySlide(0)];
          setSlides(defaultSlides);
          setActiveSlideIndex(0);
          setPreviewIndex(0);
          syncNavSelection('/packages');
          setDesktopPastedUrl('');
          setMobilePastedUrl('');
        }
      } else {
        const defaultSlides = [emptySlide(0)];
        setSlides(defaultSlides);
      }
    } catch (err) {
      console.error('Failed fetching hero & package data:', err);
      showNotice('error', 'Failed to load hero banner settings.');
      setSlides([emptySlide(0)]);
    } finally {
      setLoading(false);
    }
  };

  const syncNavSelection = (link: string) => {
    const standardPresets = ['/packages', '/tests-services', '/home-collection', '/about', '/contact'];
    if (standardPresets.includes(link) || link.startsWith('/packages/')) {
      setNavSelection(link);
      setCustomUrl('');
    } else {
      setNavSelection('custom');
      setCustomUrl(link);
    }
  };

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const currentSlide = slides[activeSlideIndex] || slides[0] || emptySlide(0);

  // Switch active slide
  const handleSelectSlide = (index: number) => {
    setActiveSlideIndex(index);
    setPreviewIndex(index);
    const targetLink = slides[index]?.buttonLink || '/packages';
    syncNavSelection(targetLink);
    setDesktopPastedUrl(slides[index]?.imageUrl || '');
    setMobilePastedUrl(slides[index]?.mobileImageUrl || '');
  };

  // Add new slide
  const handleAddSlide = () => {
    const newIdx = slides.length;
    const newSlide = emptySlide(newIdx);
    const updated = [...slides, newSlide];
    setSlides(updated);
    setActiveSlideIndex(newIdx);
    setPreviewIndex(newIdx);
    syncNavSelection('/packages');
    setDesktopPastedUrl('');
    setMobilePastedUrl('');
    showNotice('success', `Slide ${newIdx + 1} added. Upload banner images below.`);
  };

  // Reorder slides
  const handleMoveSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const updated = [...slides];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;

    // update displayOrder
    updated.forEach((s, idx) => {
      s.displayOrder = idx;
    });

    setSlides(updated);
    setActiveSlideIndex(targetIndex);
    setPreviewIndex(targetIndex);

    // Save reorder if slides have IDs
    const orders = updated
      .filter((s) => Boolean(s.id))
      .map((s, idx) => ({ id: s.id as string, displayOrder: idx }));

    if (orders.length > 0) {
      try {
        await fetch('/api/hero', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'reorder', orders }),
        });
        showNotice('success', 'Slide order updated successfully!');
      } catch (err) {
        console.error('Failed updating slide order:', err);
      }
    }
  };

  // Navigation link changes
  const handleNavSelectChange = (val: string) => {
    setNavSelection(val);
    const newLink = val === 'custom' ? customUrl || '/packages' : val;
    updateCurrentSlide({ buttonLink: newLink });
  };

  const handleCustomUrlChange = (val: string) => {
    setCustomUrl(val);
    updateCurrentSlide({ buttonLink: val });
  };

  const updateCurrentSlide = (fields: Partial<HeroSlideData>) => {
    setSlides((prev) => {
      const updated = [...prev];
      if (updated[activeSlideIndex]) {
        updated[activeSlideIndex] = { ...updated[activeSlideIndex], ...fields };
      }
      return updated;
    });
  };

  // Upload handlers
  const handleDesktopFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotice('error', 'Please select a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    try {
      setDesktopUploading(true);
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Desktop image upload failed');
      }

      updateCurrentSlide({
        imageUrl: json.data.url,
        imagePublicId: json.data.public_id || null,
      });
      setDesktopPastedUrl(json.data.url);
      showNotice('success', 'Desktop banner image uploaded to Cloudinary!');
    } catch (err: any) {
      showNotice('error', err.message || 'Error uploading desktop image.');
    } finally {
      setDesktopUploading(false);
      if (desktopFileInputRef.current) desktopFileInputRef.current.value = '';
    }
  };

  const handleMobileFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotice('error', 'Please select a valid image file (PNG, JPG, WebP, etc.)');
      return;
    }

    try {
      setMobileUploading(true);
      const data = new FormData();
      data.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Mobile image upload failed');
      }

      updateCurrentSlide({
        mobileImageUrl: json.data.url,
        mobileImagePublicId: json.data.public_id || null,
      });
      setMobilePastedUrl(json.data.url);
      showNotice('success', 'Mobile banner image uploaded to Cloudinary!');
    } catch (err: any) {
      showNotice('error', err.message || 'Error uploading mobile image.');
    } finally {
      setMobileUploading(false);
      if (mobileFileInputRef.current) mobileFileInputRef.current.value = '';
    }
  };

  const handleApplyDesktopUrl = () => {
    if (!desktopPastedUrl.trim()) {
      showNotice('error', 'Please enter a valid image URL');
      return;
    }
    updateCurrentSlide({
      imageUrl: desktopPastedUrl.trim(),
      imagePublicId: currentSlide.imageUrl === desktopPastedUrl.trim() ? currentSlide.imagePublicId : null,
    });
    showNotice('success', 'Desktop image URL applied!');
  };

  const handleApplyMobileUrl = () => {
    if (!mobilePastedUrl.trim()) {
      showNotice('error', 'Please enter a valid image URL');
      return;
    }
    updateCurrentSlide({
      mobileImageUrl: mobilePastedUrl.trim(),
      mobileImagePublicId: currentSlide.mobileImageUrl === mobilePastedUrl.trim() ? currentSlide.mobileImagePublicId : null,
    });
    showNotice('success', 'Mobile image URL applied!');
  };

  // Delete Action confirmation
  const handleConfirmDelete = async () => {
    const { type, slideIndex } = deleteModalState;
    const target = slides[slideIndex];
    if (!target) return;

    try {
      setDeleting(true);

      if (type === 'slide') {
        if (target.id) {
          const res = await fetch(`/api/hero?id=${target.id}&type=slide`, {
            method: 'DELETE',
          });
          const json = await res.json();
          if (!res.ok || !json.success) {
            throw new Error(json.message || 'Failed deleting slide from database');
          }
        }

        const remaining = slides.filter((_, idx) => idx !== slideIndex);
        const finalSlides = remaining.length > 0 ? remaining : [emptySlide(0)];
        setSlides(finalSlides);
        const nextActive = Math.min(activeSlideIndex, finalSlides.length - 1);
        setActiveSlideIndex(nextActive);
        setPreviewIndex(nextActive);
        syncNavSelection(finalSlides[nextActive]?.buttonLink || '/packages');
        showNotice('success', 'Hero slide deleted successfully.');
      } else if (type === 'desktop') {
        if (target.id) {
          await fetch(`/api/hero?id=${target.id}&type=desktop`, { method: 'DELETE' });
        }
        updateCurrentSlide({ imageUrl: '', imagePublicId: null });
        setDesktopPastedUrl('');
        showNotice('success', 'Desktop image removed.');
      } else if (type === 'mobile') {
        if (target.id) {
          await fetch(`/api/hero?id=${target.id}&type=mobile`, { method: 'DELETE' });
        }
        updateCurrentSlide({ mobileImageUrl: '', mobileImagePublicId: null });
        setMobilePastedUrl('');
        showNotice('success', 'Mobile image removed.');
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Failed deleting asset.');
    } finally {
      setDeleting(false);
      setDeleteModalState({ isOpen: false, type: 'slide', slideIndex: 0 });
    }
  };

  // Save Current Slide
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentSlide.buttonLink || !currentSlide.buttonLink.trim()) {
      showNotice('error', 'Please select or enter a navigation target location.');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/hero', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...currentSlide,
          displayOrder: activeSlideIndex,
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed saving hero settings');
      }

      // Update slide ID if newly created
      if (json.data?.savedBanner?.id) {
        updateCurrentSlide({ id: json.data.savedBanner.id });
      }

      showNotice('success', `Slide ${activeSlideIndex + 1} saved successfully! Live on homepage.`);
    } catch (err: any) {
      showNotice('error', err.message || 'Error saving hero slide.');
    } finally {
      setSaving(false);
    }
  };

  // Live Auto Carousel Rotation for Preview (every 3s)
  const validPreviewSlides = slides.filter(
    (s) => Boolean(s.imageUrl) || Boolean(s.mobileImageUrl)
  );

  const nextPreviewSlide = useCallback(() => {
    if (validPreviewSlides.length > 1) {
      setPreviewIndex((prev) => (prev + 1) % validPreviewSlides.length);
    }
  }, [validPreviewSlides.length]);

  const prevPreviewSlide = useCallback(() => {
    if (validPreviewSlides.length > 1) {
      setPreviewIndex((prev) => (prev - 1 + validPreviewSlides.length) % validPreviewSlides.length);
    }
  }, [validPreviewSlides.length]);

  useEffect(() => {
    if (validPreviewSlides.length <= 1) return;
    const interval = setInterval(() => {
      nextPreviewSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, [validPreviewSlides.length, nextPreviewSlide]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-700" />
          <span className="text-sm font-medium">Loading Hero Carousel Manager...</span>
        </div>
      </AdminLayout>
    );
  }

  const activeSlidePreview = validPreviewSlides[previewIndex] || currentSlide;
  const desktopPreviewImg = activeSlidePreview.imageUrl || activeSlidePreview.mobileImageUrl;
  const mobilePreviewImg = activeSlidePreview.mobileImageUrl || activeSlidePreview.imageUrl;

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Hero Carousel CMS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              Hero Carousel Banners (Auto 3s Rotation)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Create multiple desktop & mobile banner slides that automatically rotate every 3 seconds with left/right arrows and indicator dots.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleAddSlide}
              className="px-4 py-2.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-xs rounded-xl flex items-center gap-2 shadow-md hover:scale-105 transition-all"
            >
              <Plus className="w-4 h-4" /> Add Slide
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-2 transition-colors"
            >
              <Eye className="w-4 h-4" /> Live Website <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Notice Banner */}
        {notification && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold shadow-sm transition-all ${
              notification.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {notification.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              )}
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Slide Selector Tabs */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto py-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Slides ({slides.length}):
            </span>
            {slides.map((slide, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSlide(idx)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  idx === activeSlideIndex
                    ? 'bg-brand-900 text-yellow-400 shadow-md ring-2 ring-yellow-400/40'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>Slide {idx + 1}</span>
                {slide.imageUrl && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400" title="Has image" />
                )}
              </button>
            ))}
            <button
              type="button"
              onClick={handleAddSlide}
              className="px-3.5 py-2 border-2 border-dashed border-slate-300 hover:border-brand-600 text-slate-600 hover:text-brand-900 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New Slide
            </button>
          </div>

          {/* Slide Position & Delete Controls */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              disabled={activeSlideIndex === 0}
              onClick={() => handleMoveSlide(activeSlideIndex, 'up')}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors"
              title="Move Slide Up"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
            <button
              type="button"
              disabled={activeSlideIndex === slides.length - 1}
              onClick={() => handleMoveSlide(activeSlideIndex, 'down')}
              className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 disabled:opacity-30 transition-colors"
              title="Move Slide Down"
            >
              <ArrowDown className="w-4 h-4" />
            </button>
            <div className="w-[1px] h-4 bg-slate-300 mx-1" />
            <button
              type="button"
              onClick={() =>
                setDeleteModalState({
                  isOpen: true,
                  type: 'slide',
                  slideIndex: activeSlideIndex,
                })
              }
              className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              title="Delete this slide"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete Slide
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Form Controls for Active Slide */}
            <div className="lg:col-span-7 space-y-6">
              {/* Click Navigation Selector */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="space-y-1">
                  <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wider">
                    <Compass className="w-4 h-4 text-brand-700" /> Slide {activeSlideIndex + 1} Destination Link
                  </h2>
                  <p className="text-xs text-slate-500">
                    Select where visitors are navigated when clicking this specific carousel slide.
                  </p>
                </div>

                <div className="space-y-3 pt-1">
                  <select
                    value={navSelection}
                    onChange={(e) => handleNavSelectChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 bg-white focus:ring-2 focus:ring-brand-700 focus:outline-none"
                  >
                    <optgroup label="Main Site Navigation Pages">
                      <option value="/packages">All Health Packages (/packages)</option>
                      <option value="/tests-services">Tests & Services (/tests-services)</option>
                      <option value="/home-collection">Home Sample Collection (/home-collection)</option>
                      <option value="/about">About Us (/about)</option>
                      <option value="/contact">Contact Us (/contact)</option>
                    </optgroup>

                    {packagesList.length > 0 && (
                      <optgroup label="Specific Health Package Detail Pages">
                        {packagesList.map((pkg) => (
                          <option key={pkg.id} value={`/packages/${pkg.slug}`}>
                            Package: {pkg.title} (/packages/{pkg.slug})
                          </option>
                        ))}
                      </optgroup>
                    )}

                    <optgroup label="Custom Options">
                      <option value="custom">Custom Relative URL or External Link...</option>
                    </optgroup>
                  </select>

                  {/* Custom URL Input Field */}
                  {navSelection === 'custom' && (
                    <div className="space-y-1.5 animate-fade-in pt-1">
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                        Custom URL Path
                      </label>
                      <div className="relative">
                        <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                        <input
                          type="text"
                          placeholder="/campaign/monsoon-special or https://example.com"
                          value={customUrl}
                          onChange={(e) => handleCustomUrlChange(e.target.value)}
                          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-mono text-slate-800 focus:ring-2 focus:ring-brand-700 focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Target Link Badge */}
                  <div className="bg-slate-100 p-3 rounded-xl text-xs font-mono flex items-center justify-between text-slate-700">
                    <span className="text-[11px] text-slate-500 font-sans">Current Target Link:</span>
                    <span className="font-bold text-brand-900 bg-white px-2.5 py-1 rounded border border-slate-200">
                      {currentSlide.buttonLink}
                    </span>
                  </div>
                </div>
              </div>

              {/* 1. Desktop Banner Upload */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-700 rounded-xl">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        1. Desktop Banner Image (Slide {activeSlideIndex + 1})
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Landscape ratio (e.g. 1920×800 or 16:9 / 21:9)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setDesktopInputMode('upload')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        desktopInputMode === 'upload'
                          ? 'bg-white text-brand-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setDesktopInputMode('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        desktopInputMode === 'url'
                          ? 'bg-white text-brand-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                {desktopInputMode === 'upload' ? (
                  <div className="border-2 border-dashed border-slate-300 hover:border-brand-600 p-5 rounded-2xl text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <input
                      ref={desktopFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleDesktopFileUpload}
                      className="hidden"
                      id="desktop-hero-upload"
                    />
                    <label htmlFor="desktop-hero-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-brand-700/10 text-brand-700 flex items-center justify-center">
                        {desktopUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {desktopUploading ? 'Uploading Desktop Banner...' : 'Select Desktop Banner Image'}
                      </span>
                      <span className="text-[11px] text-slate-400">PNG, JPG, WebP directly to Cloudinary</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="url"
                        placeholder="https://example.com/desktop-banner.jpg"
                        value={desktopPastedUrl}
                        onChange={(e) => setDesktopPastedUrl(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyDesktopUrl}
                      className="px-4 py-2 bg-brand-800 text-white font-bold text-xs rounded-xl hover:bg-brand-900 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Active Desktop Preview */}
                {currentSlide.imageUrl ? (
                  <div className="bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium text-[11px]">Active Desktop Image</span>
                      {currentSlide.imagePublicId && (
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">
                          {currentSlide.imagePublicId}
                        </span>
                      )}
                    </div>
                    <div className="relative h-32 w-full rounded-xl overflow-hidden border border-slate-700">
                      <Image src={currentSlide.imageUrl} alt="Desktop Hero" fill className="object-cover" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400 truncate max-w-[240px]">{currentSlide.imageUrl}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModalState({
                            isOpen: true,
                            type: 'desktop',
                            slideIndex: activeSlideIndex,
                          })
                        }
                        className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-500 text-xs">
                    No desktop banner image set for this slide.
                  </div>
                )}
              </div>

              {/* 2. Mobile Banner Upload */}
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                        2. Mobile Banner Image (Slide {activeSlideIndex + 1})
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Portrait ratio (e.g. 800×1000 or 4:5 / 1:1)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setMobileInputMode('upload')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        mobileInputMode === 'upload'
                          ? 'bg-white text-brand-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setMobileInputMode('url')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        mobileInputMode === 'url'
                          ? 'bg-white text-brand-900 shadow-sm'
                          : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      URL
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-amber-50 text-amber-900 p-3 rounded-xl text-xs">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Optional:</strong> If no mobile banner is uploaded for this slide, the desktop banner will automatically be used.
                  </span>
                </div>

                {mobileInputMode === 'upload' ? (
                  <div className="border-2 border-dashed border-slate-300 hover:border-brand-600 p-5 rounded-2xl text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <input
                      ref={mobileFileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleMobileFileUpload}
                      className="hidden"
                      id="mobile-hero-upload"
                    />
                    <label htmlFor="mobile-hero-upload" className="cursor-pointer flex flex-col items-center gap-1.5">
                      <div className="w-10 h-10 rounded-full bg-brand-700/10 text-brand-700 flex items-center justify-center">
                        {mobileUploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {mobileUploading ? 'Uploading Mobile Banner...' : 'Select Mobile Banner Image'}
                      </span>
                      <span className="text-[11px] text-slate-400">PNG, JPG, WebP directly to Cloudinary</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="url"
                        placeholder="https://example.com/mobile-banner.jpg"
                        value={mobilePastedUrl}
                        onChange={(e) => setMobilePastedUrl(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-brand-700 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyMobileUrl}
                      className="px-4 py-2 bg-brand-800 text-white font-bold text-xs rounded-xl hover:bg-brand-900 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}

                {/* Active Mobile Preview */}
                {currentSlide.mobileImageUrl ? (
                  <div className="bg-slate-900 text-white p-3 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400 font-medium text-[11px]">Active Mobile Image</span>
                      {currentSlide.mobileImagePublicId && (
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">
                          {currentSlide.mobileImagePublicId}
                        </span>
                      )}
                    </div>
                    <div className="relative h-36 w-28 mx-auto rounded-xl overflow-hidden border border-slate-700">
                      <Image src={currentSlide.mobileImageUrl} alt="Mobile Hero" fill className="object-cover" />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400 truncate max-w-[240px]">{currentSlide.mobileImageUrl}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setDeleteModalState({
                            isOpen: true,
                            type: 'mobile',
                            slideIndex: activeSlideIndex,
                          })
                        }
                        className="px-2.5 py-1 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-100 rounded-xl text-slate-500 text-xs">
                    No mobile-specific banner image set (Desktop image will be used as fallback).
                  </div>
                )}
              </div>

              {/* Submit Action Button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-3.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-extrabold text-sm rounded-2xl shadow-lg hover:shadow-yellow-500/20 transition-all hover:scale-105 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Saving Slide {activeSlideIndex + 1}...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" /> Save Slide {activeSlideIndex + 1}
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: Live Responsive Carousel Preview */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4 sticky top-6">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="space-y-0.5">
                    <h3 className="text-xs font-bold text-yellow-400 flex items-center gap-2 uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" /> Live Carousel Preview
                    </h3>
                    <span className="text-[10px] text-slate-400 font-mono">Auto 3s Rotation</span>
                  </div>

                  {/* Device Toggle Tabs */}
                  <div className="flex items-center bg-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setPreviewTab('desktop')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        previewTab === 'desktop'
                          ? 'bg-brand-700 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Monitor className="w-3.5 h-3.5" /> Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTab('mobile')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                        previewTab === 'mobile'
                          ? 'bg-brand-700 text-white shadow-sm'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Mobile
                    </button>
                  </div>
                </div>

                {/* Preview Container */}
                {previewTab === 'desktop' ? (
                  <div className="space-y-2">
                    <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                      <span>
                        Slide {validPreviewSlides.length > 0 ? previewIndex + 1 : 1} of {Math.max(validPreviewSlides.length, 1)}
                      </span>
                      <span className="truncate max-w-[160px]">Target: {activeSlidePreview.buttonLink}</span>
                    </div>

                    <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 bg-slate-950 h-[220px] flex items-end justify-start p-3 shadow-2xl group cursor-pointer">
                      {desktopPreviewImg ? (
                        <Image
                          src={desktopPreviewImg}
                          alt="Desktop preview"
                          fill
                          className="object-cover transition-all duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-950 flex items-center justify-center text-slate-500 text-xs font-mono">
                          No Banner Configured
                        </div>
                      )}

                      {/* Navigation Arrow Controls in Preview */}
                      {validPreviewSlides.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              prevPreviewSlide();
                            }}
                            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 z-20"
                          >
                            <ChevronLeft className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              nextPreviewSlide();
                            }}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/80 z-20"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                          {/* Dots in Preview */}
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20 bg-black/40 px-2.5 py-1 rounded-full">
                            {validPreviewSlides.map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all ${
                                  i === previewIndex ? 'w-5 bg-yellow-400' : 'w-1.5 bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                        <span className="bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full text-yellow-400 font-mono text-[10px] border border-yellow-500/30 flex items-center gap-1.5 shadow-lg">
                          <ExternalLink className="w-3 h-3" /> Clicks go to: {activeSlidePreview.buttonLink}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                      <span>
                        Slide {validPreviewSlides.length > 0 ? previewIndex + 1 : 1} of {Math.max(validPreviewSlides.length, 1)}
                      </span>
                      <span className="truncate max-w-[140px]">Target: {activeSlidePreview.buttonLink}</span>
                    </div>

                    <div className="mx-auto w-[220px] h-[340px] rounded-3xl overflow-hidden border-4 border-slate-700 bg-slate-950 relative shadow-2xl group cursor-pointer">
                      {mobilePreviewImg ? (
                        <Image
                          src={mobilePreviewImg}
                          alt="Mobile preview"
                          fill
                          className="object-cover transition-all duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-slate-950 flex items-center justify-center text-slate-500 text-xs font-mono text-center p-2">
                          No Banner Configured
                        </div>
                      )}

                      {/* Navigation Controls in Mobile Preview */}
                      {validPreviewSlides.length > 1 && (
                        <>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              prevPreviewSlide();
                            }}
                            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center z-20"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              nextPreviewSlide();
                            }}
                            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center z-20"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 bg-black/50 px-2 py-0.5 rounded-full">
                            {validPreviewSlides.map((_, i) => (
                              <div
                                key={i}
                                className={`h-1.5 rounded-full transition-all ${
                                  i === previewIndex ? 'w-4 bg-yellow-400' : 'w-1.5 bg-white/50'
                                }`}
                              />
                            ))}
                          </div>
                        </>
                      )}

                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center pointer-events-none">
                        <span className="bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-full text-yellow-400 font-mono text-[10px] border border-yellow-500/30 text-center shadow-lg truncate max-w-[180px]">
                          {activeSlidePreview.buttonLink}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <p className="text-[11px] text-slate-400 italic text-center pt-2 border-t border-slate-800">
                  Slides auto-advance every 3 seconds and pause on mouse hover or touch interaction.
                </p>
              </div>
            </div>
          </div>
        </form>

        {/* Delete Confirmation Modal */}
        {deleteModalState.isOpen && (
          <div className="fixed inset-0 bg-slate-900/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-900">
                  {deleteModalState.type === 'slide'
                    ? `Delete Slide ${deleteModalState.slideIndex + 1}?`
                    : `Delete ${deleteModalState.type === 'desktop' ? 'Desktop' : 'Mobile'} Image?`}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {deleteModalState.type === 'slide'
                    ? 'Are you sure you want to delete this hero slide? Any uploaded images will be permanently removed from Cloudinary and the carousel.'
                    : `Are you sure you want to delete this ${deleteModalState.type} banner image?`}
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() =>
                    setDeleteModalState({ isOpen: false, type: 'slide', slideIndex: 0 })
                  }
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleConfirmDelete}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" /> Confirm Delete
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}


