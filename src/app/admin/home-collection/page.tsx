'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  Upload,
  Link as LinkIcon,
  Save,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Eye,
  Trash2,
  Play,
  Pause,
  Sparkles,
  Layers,
  Sliders,
  Type,
  ImageIcon,
  RotateCcw,
} from 'lucide-react';
import Image from 'next/image';

interface HomeCollectionData {
  id?: string;
  badgeText: string;
  titlePrefix: string;
  titleHighlight: string;
  subtitle: string;
  bgImageUrl: string;
  bgImagePublicId: string | null;
  bikeImageUrl: string;
  bikeImagePublicId: string | null;
  buttonText: string;
  buttonLink: string;
  animationSpeed: number;
  animationEnabled: boolean;
  isActive: boolean;
}

const defaultData: HomeCollectionData = {
  badgeText: 'HOME COLLECTION',
  titlePrefix: 'Healthcare that',
  titleHighlight: 'comes home.',
  subtitle: 'Professional sample collection at your doorstep. Safe, convenient and trusted by thousands.',
  bgImageUrl: '',
  bgImagePublicId: null,
  bikeImageUrl: '',
  bikeImagePublicId: null,
  buttonText: 'Book Home Collection',
  buttonLink: '/home-collection',
  animationSpeed: 14,
  animationEnabled: true,
  isActive: true,
};

export default function AdminHomeCollectionPage() {
  const [formData, setFormData] = useState<HomeCollectionData>(defaultData);
  const [savedData, setSavedData] = useState<HomeCollectionData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Background upload states
  const [bgMode, setBgMode] = useState<'upload' | 'url'>('upload');
  const [bgPastedUrl, setBgPastedUrl] = useState('');
  const [bgUploading, setBgUploading] = useState(false);
  const [previewBgError, setPreviewBgError] = useState(false);

  // Bike upload states
  const [bikeMode, setBikeMode] = useState<'upload' | 'url'>('upload');
  const [bikePastedUrl, setBikePastedUrl] = useState('');
  const [bikeUploading, setBikeUploading] = useState(false);
  const [previewBikeError, setPreviewBikeError] = useState(false);

  // Preview animation toggle
  const [previewPlaying, setPreviewPlaying] = useState(true);

  // Notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const bgFileInputRef = useRef<HTMLInputElement>(null);
  const bikeFileInputRef = useRef<HTMLInputElement>(null);

  // Detect unsaved changes compared to baseline saved state
  const isDirty = useMemo(() => {
    if (loading) return false;
    return JSON.stringify(formData) !== JSON.stringify(savedData);
  }, [formData, savedData, loading]);

  useEffect(() => {
    fetchData();
  }, []);

  // Prevent accidental tab close when unsaved changes exist
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/home-collection-banner');
      const json = await res.json();
      if (json.success && json.data) {
        const cleanBg =
          json.data.bgImageUrl && !json.data.bgImageUrl.startsWith('/images/home-collection')
            ? json.data.bgImageUrl
            : '';
        const cleanBike =
          json.data.bikeImageUrl && !json.data.bikeImageUrl.startsWith('/images/home-collection')
            ? json.data.bikeImageUrl
            : '';

        const loadedData: HomeCollectionData = {
          id: json.data.id,
          badgeText: json.data.badgeText ?? defaultData.badgeText,
          titlePrefix: json.data.titlePrefix ?? defaultData.titlePrefix,
          titleHighlight: json.data.titleHighlight ?? defaultData.titleHighlight,
          subtitle: json.data.subtitle ?? defaultData.subtitle,
          bgImageUrl: cleanBg,
          bgImagePublicId: json.data.bgImagePublicId ?? null,
          bikeImageUrl: cleanBike,
          bikeImagePublicId: json.data.bikeImagePublicId ?? null,
          buttonText: json.data.buttonText ?? defaultData.buttonText,
          buttonLink: json.data.buttonLink ?? defaultData.buttonLink,
          animationSpeed: json.data.animationSpeed ?? defaultData.animationSpeed,
          animationEnabled: json.data.animationEnabled ?? defaultData.animationEnabled,
          isActive: json.data.isActive ?? true,
        };

        setFormData(loadedData);
        setSavedData(loadedData);
        setBgPastedUrl(cleanBg);
        setBikePastedUrl(cleanBike);
        setPreviewBgError(false);
        setPreviewBikeError(false);
      }
    } catch (err: any) {
      showNotice('error', err.message || 'Failed to load Home Collection banner settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setFormData({ ...savedData });
    setBgPastedUrl(savedData.bgImageUrl || '');
    setBikePastedUrl(savedData.bikeImageUrl || '');
    setPreviewBgError(false);
    setPreviewBikeError(false);
    showNotice('success', 'Unsaved changes discarded.');
  };

  const handleBgFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotice('error', 'Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    try {
      setBgUploading(true);
      const data = new FormData();
      data.append('file', file);
      data.append('category', 'banner');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Background image upload failed');
      }

      setFormData((prev) => ({
        ...prev,
        bgImageUrl: json.data.url,
        bgImagePublicId: json.data.public_id || null,
      }));
      setBgPastedUrl(json.data.url);
      showNotice('success', 'Background image uploaded successfully!');
    } catch (err: any) {
      showNotice('error', err.message || 'Error uploading background image');
    } finally {
      setBgUploading(false);
      if (bgFileInputRef.current) bgFileInputRef.current.value = '';
    }
  };

  const handleApplyBgUrl = () => {
    if (!bgPastedUrl.trim()) {
      showNotice('error', 'Please enter a valid background image URL');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      bgImageUrl: bgPastedUrl.trim(),
      bgImagePublicId: null,
    }));
    showNotice('success', 'Background image URL applied!');
  };

  const handleClearBgImage = () => {
    setFormData((prev) => ({
      ...prev,
      bgImageUrl: '',
      bgImagePublicId: null,
    }));
    setBgPastedUrl('');
  };

  const handleBikeFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotice('error', 'Please select a valid image file (PNG, WebP with transparent background)');
      return;
    }

    try {
      setBikeUploading(true);
      const data = new FormData();
      data.append('file', file);
      data.append('category', 'icon');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Bike image upload failed');
      }

      setFormData((prev) => ({
        ...prev,
        bikeImageUrl: json.data.url,
        bikeImagePublicId: json.data.public_id || null,
      }));
      setBikePastedUrl(json.data.url);
      showNotice('success', 'Bike rider image uploaded successfully!');
    } catch (err: any) {
      showNotice('error', err.message || 'Error uploading bike image');
    } finally {
      setBikeUploading(false);
      if (bikeFileInputRef.current) bikeFileInputRef.current.value = '';
    }
  };

  const handleApplyBikeUrl = () => {
    if (!bikePastedUrl.trim()) {
      showNotice('error', 'Please enter a valid bike image URL');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      bikeImageUrl: bikePastedUrl.trim(),
      bikeImagePublicId: null,
    }));
    showNotice('success', 'Bike image URL applied!');
  };

  const handleClearBikeImage = () => {
    setFormData((prev) => ({
      ...prev,
      bikeImageUrl: '',
      bikeImagePublicId: null,
    }));
    setBikePastedUrl('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await fetch('/api/home-collection-banner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed to save settings');
      }

      const updated = json.data ? { ...formData, id: json.data.id } : { ...formData };
      setFormData(updated);
      setSavedData(updated);
      showNotice('success', 'Home Collection Banner settings saved successfully!');
    } catch (err: any) {
      showNotice('error', err.message || 'Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 className="w-10 h-10 text-brand-700 animate-spin" />
          <p className="text-sm font-medium text-slate-600">Loading Home Collection CMS...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Shopify-Style Floating Sticky Top Save / Discard Bar */}
      <div
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 transform ${
          isDirty
            ? 'translate-y-0 opacity-100 scale-100 pointer-events-auto'
            : '-translate-y-16 opacity-0 scale-95 pointer-events-none'
        }`}
      >
        <div className="bg-slate-900/95 backdrop-blur-md text-white px-5 py-2.5 sm:px-6 sm:py-3 rounded-2xl shadow-2xl border border-slate-700/80 flex items-center gap-4 sm:gap-6 ring-1 ring-white/10">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-slate-200">
              Unsaved changes
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDiscard}
              disabled={saving}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition disabled:opacity-50 flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Discard</span>
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 text-xs font-bold text-slate-950 bg-yellow-400 hover:bg-yellow-300 rounded-xl shadow-md transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-8 max-w-7xl mx-auto pb-16">
        
        {/* Notification Toast */}
        {notification && (
          <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold transition-all transform animate-bounce-short ${
              notification.type === 'success'
                ? 'bg-emerald-600 text-white'
                : 'bg-rose-600 text-white'
            }`}
          >
            {notification.type === 'success' ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <AlertTriangle className="w-5 h-5" />
            )}
            <span>{notification.message}</span>
          </div>
        )}

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-lg bg-emerald-100 text-brand-700">
                <Sparkles className="w-5 h-5" />
              </span>
              <h1 className="text-2xl font-black text-slate-900 font-sans tracking-tight">
                Home Collection Animation Section CMS
              </h1>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Configure the animated section displayed between Doorstep Diagnostic Care and How it Works on the homepage.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isDirty && (
              <button
                type="button"
                onClick={handleDiscard}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold text-xs rounded-xl transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Discard</span>
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center gap-2 px-6 py-2.5 font-bold text-sm rounded-xl shadow-md transition-all disabled:opacity-50 ${
                isDirty
                  ? 'bg-yellow-400 hover:bg-yellow-300 text-slate-950 ring-2 ring-yellow-400/50'
                  : 'bg-brand-700 hover:bg-brand-800 text-white'
              }`}
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>Save Changes</span>
            </button>
          </div>
        </div>

        {/* Live Interactive Preview Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-700" />
              <h2 className="text-lg font-bold text-slate-900">Live Preview</h2>
              <span className="text-xs text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full font-medium">
                Real-time output
              </span>
            </div>
            
            <button
              type="button"
              onClick={() => setPreviewPlaying(!previewPlaying)}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 transition"
            >
              {previewPlaying ? <Pause className="w-3.5 h-3.5 text-amber-600" /> : <Play className="w-3.5 h-3.5 text-emerald-600" />}
              <span>{previewPlaying ? 'Pause Motion' : 'Play Motion'}</span>
            </button>
          </div>

          {/* Banner Preview Area */}
          <div className="relative w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200 min-h-[360px] sm:min-h-[420px] flex flex-col justify-between bg-slate-100">
            
            {/* Background Image Preview */}
            {formData.bgImageUrl && !previewBgError ? (
              <div className="absolute inset-0 z-0">
                <Image
                  src={formData.bgImageUrl}
                  alt="Preview Background"
                  fill
                  className="object-cover object-center"
                  onError={() => setPreviewBgError(true)}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-black/20" />
              </div>
            ) : (
              <div className="absolute inset-0 z-0 bg-gradient-to-b from-sky-200/50 via-slate-100 to-slate-300">
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-slate-700 border-t-2 border-slate-600 flex items-center">
                  <div className="w-full border-b-2 border-dashed border-white/60" />
                  <div className="absolute bottom-0 left-0 right-0 h-3 bg-emerald-700/80" />
                </div>
              </div>
            )}

            {/* Content Preview */}
            <div className="relative z-10 pt-6 px-6 text-center max-w-2xl mx-auto flex flex-col items-center">
              {formData.badgeText && (
                <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-slate-200/70 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
                  <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-800">
                    {formData.badgeText}
                  </span>
                </div>
              )}

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-tight space-y-0.5">
                {formData.titlePrefix && <span className="block">{formData.titlePrefix}</span>}
                {formData.titleHighlight && (
                  <span className="block text-brand-700 font-black">
                    {formData.titleHighlight}
                  </span>
                )}
              </h2>

              {formData.subtitle && (
                <p className="mt-2 text-xs sm:text-sm text-slate-700 font-medium max-w-xl leading-relaxed">
                  {formData.subtitle}
                </p>
              )}

              {formData.buttonText && (
                <div className="mt-3 mb-6 sm:mb-8">
                  <span className="inline-block px-5 py-2 gold-gradient text-brand-900 font-extrabold text-xs rounded-full shadow cursor-pointer">
                    {formData.buttonText} →
                  </span>
                </div>
              )}
            </div>

            {/* Bike Animation Preview */}
            <div className="relative z-30 w-full h-28 sm:h-32 pointer-events-none">
              {formData.bikeImageUrl && !previewBikeError ? (
                <div
                  className={`absolute bottom-2 z-30 w-36 sm:w-48 h-28 sm:h-32 ${
                    formData.animationEnabled && previewPlaying ? 'preview-bike-drive' : 'left-1/3'
                  }`}
                  style={{
                    animationDuration: `${formData.animationSpeed}s`,
                  }}
                >
                  <div className="relative w-full h-full animate-bounce-subtle">
                    <Image
                      src={formData.bikeImageUrl}
                      alt="Bike Preview"
                      fill
                      className="object-contain"
                      onError={() => setPreviewBikeError(true)}
                    />
                  </div>
                </div>
              ) : (
                <div
                  className={`absolute bottom-2 w-32 sm:w-40 ${
                    formData.animationEnabled && previewPlaying ? 'preview-bike-drive' : 'left-1/3'
                  }`}
                  style={{
                    animationDuration: `${formData.animationSpeed}s`,
                  }}
                >
                  <div className="animate-bounce-subtle text-xs bg-brand-700 text-white font-bold px-3 py-1.5 rounded-xl shadow-lg border border-yellow-400 flex items-center gap-2">
                    <span>🛵</span>
                    <span>AiCura Courier</span>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* CMS Configuration Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Background Image Upload */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-brand-700" />
                <h3 className="text-base font-bold text-slate-900">1. Background Image</h3>
              </div>
              {formData.bgImageUrl && (
                <button
                  type="button"
                  onClick={handleClearBgImage}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Upload a panoramic landscape image (houses on left, AiCura clinic on right, road at bottom). Recommended aspect ratio: 16:9 or 21:9.
            </p>

            {/* Mode Switcher Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setBgMode('upload')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  bgMode === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setBgMode('url')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  bgMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Paste Image URL</span>
              </button>
            </div>

            {bgMode === 'upload' ? (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={bgFileInputRef}
                  onChange={handleBgFileUpload}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => bgFileInputRef.current?.click()}
                  disabled={bgUploading}
                  className="w-full border-2 border-dashed border-slate-300 hover:border-brand-700 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100/80 transition group"
                >
                  {bgUploading ? (
                    <div className="flex flex-col items-center gap-2 text-brand-700">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-xs font-bold">Uploading background image...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-700" />
                      <span className="text-xs font-bold text-slate-700 group-hover:text-brand-700">
                        Click to select and upload background image
                      </span>
                      <span className="text-[11px] text-slate-400">JPG, PNG, WebP up to 10MB</span>
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/banner-background.jpg"
                    value={bgPastedUrl}
                    onChange={(e) => setBgPastedUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                  <button
                    type="button"
                    onClick={handleApplyBgUrl}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            )}

            {formData.bgImageUrl && !previewBgError && (
              <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-200">
                <Image
                  src={formData.bgImageUrl}
                  alt="Current BG"
                  fill
                  className="object-cover"
                  onError={() => setPreviewBgError(true)}
                />
                <div className="absolute bottom-1 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono truncate max-w-[200px]">
                  {formData.bgImageUrl}
                </div>
              </div>
            )}
          </div>

          {/* Card 2: Bike / Vehicle Animation Image Upload */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-700" />
                <h3 className="text-base font-bold text-slate-900">2. Animated Bike / Rider Image</h3>
              </div>
              {formData.bikeImageUrl && (
                <button
                  type="button"
                  onClick={handleClearBikeImage}
                  className="text-xs text-rose-600 hover:text-rose-700 flex items-center gap-1 font-semibold"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove Image</span>
                </button>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Upload a transparent PNG/WebP cutout of the courier rider facing right. This image will travel smoothly across the road.
            </p>

            {/* Mode Switcher Tabs */}
            <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setBikeMode('upload')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  bikeMode === 'upload' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload File</span>
              </button>
              <button
                type="button"
                onClick={() => setBikeMode('url')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition ${
                  bikeMode === 'url' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Paste Image URL</span>
              </button>
            </div>

            {bikeMode === 'upload' ? (
              <div className="space-y-3">
                <input
                  type="file"
                  ref={bikeFileInputRef}
                  onChange={handleBikeFileUpload}
                  accept="image/png,image/webp"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => bikeFileInputRef.current?.click()}
                  disabled={bikeUploading}
                  className="w-full border-2 border-dashed border-slate-300 hover:border-brand-700 rounded-xl p-6 text-center bg-slate-50 hover:bg-slate-100/80 transition group"
                >
                  {bikeUploading ? (
                    <div className="flex flex-col items-center gap-2 text-brand-700">
                      <Loader2 className="w-6 h-6 animate-spin" />
                      <span className="text-xs font-bold">Uploading bike image...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="w-6 h-6 text-slate-400 group-hover:text-brand-700" />
                      <span className="text-xs font-bold text-slate-700 group-hover:text-brand-700">
                        Click to select transparent PNG / WebP bike image
                      </span>
                      <span className="text-[11px] text-slate-400">Transparent PNG recommended</span>
                    </div>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="url"
                    placeholder="https://example.com/rider-cutout.png"
                    value={bikePastedUrl}
                    onChange={(e) => setBikePastedUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                  <button
                    type="button"
                    onClick={handleApplyBikeUrl}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl"
                  >
                    Apply URL
                  </button>
                </div>
              </div>
            )}

            {formData.bikeImageUrl && !previewBikeError && (
              <div className="relative h-28 w-full rounded-xl overflow-hidden border border-slate-200 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:12px_12px]">
                <Image
                  src={formData.bikeImageUrl}
                  alt="Current Bike"
                  fill
                  className="object-contain p-2"
                  onError={() => setPreviewBikeError(true)}
                />
                <div className="absolute bottom-1 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono truncate max-w-[200px]">
                  {formData.bikeImageUrl}
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Text Content Editors */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-brand-700" />
              <h3 className="text-base font-bold text-slate-900">3. Texts & Headings</h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Top Badge Text
                </label>
                <input
                  type="text"
                  value={formData.badgeText}
                  onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                  placeholder="HOME COLLECTION"
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Title (Prefix)
                  </label>
                  <input
                    type="text"
                    value={formData.titlePrefix}
                    onChange={(e) => setFormData({ ...formData, titlePrefix: e.target.value })}
                    placeholder="Healthcare that"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Title (Highlighted Text)
                  </label>
                  <input
                    type="text"
                    value={formData.titleHighlight}
                    onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
                    placeholder="comes home."
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-brand-700 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="Professional sample collection at your doorstep..."
                  className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 leading-relaxed font-medium"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="Book Home Collection"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Button Link / Action
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    placeholder="/home-collection or #modal"
                    className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 font-medium font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Animation & Display Settings */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-brand-700" />
              <h3 className="text-base font-bold text-slate-900">4. Animation & Visibility</h3>
            </div>

            <div className="space-y-4">
              {/* Active Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Section Visibility</h4>
                  <p className="text-[11px] text-slate-500">Show this section on the public homepage</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Animation Toggle */}
              <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Bike Horizontal Motion</h4>
                  <p className="text-[11px] text-slate-500">Animate courier bike driving across the road</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.animationEnabled}
                    onChange={(e) => setFormData({ ...formData, animationEnabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-700"></div>
                </label>
              </div>

              {/* Animation Speed Slider */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">Animation Speed (Duration)</span>
                  <span className="text-xs font-extrabold text-brand-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    {formData.animationSpeed} seconds
                  </span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="30"
                  step="1"
                  value={formData.animationSpeed}
                  onChange={(e) => setFormData({ ...formData, animationSpeed: Number(e.target.value) })}
                  className="w-full accent-brand-700 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-medium">
                  <span>Fast (6s)</span>
                  <span>Normal (14s)</span>
                  <span>Slow (30s)</span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-brand-700 hover:bg-brand-800 text-white font-bold text-sm rounded-xl shadow transition disabled:opacity-50"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>
          </div>

        </div>

      </div>

      <style jsx global>{`
        @keyframes previewBikeDrive {
          0% {
            left: -20%;
          }
          100% {
            left: 110%;
          }
        }
        .preview-bike-drive {
          animation-name: previewBikeDrive;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @keyframes subtleBounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-2px);
          }
        }
        .animate-bounce-subtle {
          animation: subtleBounce 0.4s ease-in-out infinite;
        }
      `}</style>
    </AdminLayout>
  );
}
