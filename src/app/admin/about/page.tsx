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
  Building,
  Layers,
  Sliders,
  Type,
  ImageIcon,
  Award,
  ShieldCheck,
  Microscope,
  Stethoscope,
  Clock,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import Image from 'next/image';

interface AboutData {
  id?: string;
  badgeText: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  imageUrl: string;
  imagePublicId: string | null;
  badge1Title: string;
  badge1Subtitle: string;
  badge2Title: string;
  badge2Subtitle: string;
  badge3Text: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar4Title: string;
  pillar4Desc: string;
  primaryBtnText: string;
  primaryBtnLink: string;
  secondaryBtnText: string;
  isActive: boolean;
}

const defaultData: AboutData = {
  badgeText: 'About AiCura Diagnostics',
  titlePrefix: 'Pioneering Clinical Precision &',
  titleHighlight: 'Trusted Healthcare.',
  description:
    'At AiCura Diagnostics, we believe accurate diagnostics are the cornerstone of effective healthcare. Combining state-of-the-art laboratory automation with seasoned medical pathologists, we deliver trustworthy, high-precision results for you and your family.',
  imageUrl:
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000',
  imagePublicId: null,
  badge1Title: 'NABL Standard',
  badge1Subtitle: 'Quality Assured Testing',
  badge2Title: '99.8% Precision',
  badge2Subtitle: 'Double Verified Results',
  badge3Text: '10,000+ Happy Patients',
  pillar1Title: 'Fully Automated Analyzers',
  pillar1Desc: 'Advanced robotic equipment ensuring error-free testing with rapid turnaround.',
  pillar2Title: 'NABL & ISO Compliant',
  pillar2Desc: 'Standardized protocols matching the highest global benchmarks for diagnostic accuracy.',
  pillar3Title: 'MD Pathologist Verified',
  pillar3Desc: 'Every diagnostic report is validated by veteran senior pathologists.',
  pillar4Title: 'Same-Day Digital Reports',
  pillar4Desc: 'Prompt delivery of secure, comprehensive reports directly via WhatsApp & Email.',
  primaryBtnText: 'Learn More About Us',
  primaryBtnLink: '/about',
  secondaryBtnText: 'Contact Our Lab',
  isActive: true,
};

export default function AdminAboutPage() {
  const [formData, setFormData] = useState<AboutData>(defaultData);
  const [savedData, setSavedData] = useState<AboutData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Image upload modes
  const [imageMode, setImageMode] = useState<'upload' | 'url'>('upload');
  const [imagePastedUrl, setImagePastedUrl] = useState('');
  const [imageUploading, setImageUploading] = useState(false);
  const [previewImageError, setPreviewImageError] = useState(false);

  // Active tab in settings editor
  const [activeTab, setActiveTab] = useState<'content' | 'image' | 'pillars' | 'badges'>('content');

  // Notification state
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const isDirty = useMemo(() => {
    if (loading) return false;
    return JSON.stringify(formData) !== JSON.stringify(savedData);
  }, [formData, savedData, loading]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('aicura_admin_token') : null;
      const res = await fetch('/api/about', {
        cache: 'no-store',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          const loaded: AboutData = {
            id: json.data.id,
            badgeText: json.data.badgeText || defaultData.badgeText,
            titlePrefix: json.data.titlePrefix || defaultData.titlePrefix,
            titleHighlight: json.data.titleHighlight || defaultData.titleHighlight,
            description: json.data.description || defaultData.description,
            imageUrl: json.data.imageUrl || defaultData.imageUrl,
            imagePublicId: json.data.imagePublicId || null,
            badge1Title: json.data.badge1Title || defaultData.badge1Title,
            badge1Subtitle: json.data.badge1Subtitle || defaultData.badge1Subtitle,
            badge2Title: json.data.badge2Title || defaultData.badge2Title,
            badge2Subtitle: json.data.badge2Subtitle || defaultData.badge2Subtitle,
            badge3Text: json.data.badge3Text || defaultData.badge3Text,
            pillar1Title: json.data.pillar1Title || defaultData.pillar1Title,
            pillar1Desc: json.data.pillar1Desc || defaultData.pillar1Desc,
            pillar2Title: json.data.pillar2Title || defaultData.pillar2Title,
            pillar2Desc: json.data.pillar2Desc || defaultData.pillar2Desc,
            pillar3Title: json.data.pillar3Title || defaultData.pillar3Title,
            pillar3Desc: json.data.pillar3Desc || defaultData.pillar3Desc,
            pillar4Title: json.data.pillar4Title || defaultData.pillar4Title,
            pillar4Desc: json.data.pillar4Desc || defaultData.pillar4Desc,
            primaryBtnText: json.data.primaryBtnText || defaultData.primaryBtnText,
            primaryBtnLink: json.data.primaryBtnLink || defaultData.primaryBtnLink,
            secondaryBtnText: json.data.secondaryBtnText || defaultData.secondaryBtnText,
            isActive: json.data.isActive ?? true,
          };
          setFormData(loaded);
          setSavedData(loaded);
          setImagePastedUrl(loaded.imageUrl || '');
        }
      }
    } catch (err) {
      console.error('Failed fetching About section data:', err);
      showNotice('error', 'Failed to load About section configuration.');
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showNotice('error', 'Please select a valid image file (PNG, JPG, WebP)');
      return;
    }

    try {
      setImageUploading(true);
      const data = new FormData();
      data.append('file', file);
      data.append('category', 'about');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: data,
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Image upload failed');
      }

      setFormData((prev) => ({
        ...prev,
        imageUrl: json.data.url,
        imagePublicId: json.data.public_id || null,
      }));
      setImagePastedUrl(json.data.url);
      setPreviewImageError(false);
      showNotice('success', 'Lab image successfully uploaded to Cloudinary!');
    } catch (err: any) {
      showNotice('error', err.message || 'Error uploading image.');
    } finally {
      setImageUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleApplyUrl = () => {
    if (!imagePastedUrl.trim()) {
      showNotice('error', 'Please enter a valid image URL');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      imageUrl: imagePastedUrl.trim(),
      imagePublicId: null,
    }));
    setPreviewImageError(false);
    showNotice('success', 'Image URL applied to preview!');
  };

  const handleResetToDefault = () => {
    setFormData(defaultData);
    setImagePastedUrl(defaultData.imageUrl);
    showNotice('success', 'Reset all fields to default values.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setSaving(true);
      const token = typeof window !== 'undefined' ? localStorage.getItem('aicura_admin_token') : null;

      const res = await fetch('/api/about', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || 'Failed saving About section');
      }

      if (json.data) {
        setFormData(json.data);
        setSavedData(json.data);
        setImagePastedUrl(json.data.imageUrl || '');
      } else {
        setSavedData(formData);
      }

      showNotice('success', 'About Us section saved successfully! Live on homepage.');
    } catch (err: any) {
      showNotice('error', err.message || 'Error saving About section.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20 text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-brand-700" />
          <span className="text-sm font-medium">Loading About Section CMS...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold mb-2">
              <Building className="w-3.5 h-3.5" /> About Us CMS
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans">
              About Section & Laboratory Graphics
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Customize headlines, descriptions, 4 feature pillars, floating trust badges, and upload custom lab facility images.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Defaults
            </button>
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-brand-900 hover:bg-brand-800 text-yellow-400 font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
            >
              <Eye className="w-4 h-4" /> Live Website
            </a>
          </div>
        </div>

        {/* Notifications */}
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

        {/* Live Interactive Preview Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden space-y-4">
          <div className="bg-slate-50 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-700" /> Live Visual Preview (How it appears on Homepage)
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
              Real-Time Preview
            </span>
          </div>

          <div className="p-6 sm:p-8 bg-gradient-to-b from-white via-slate-50/70 to-slate-100/60 rounded-2xl border border-slate-100 mx-4 sm:mx-6 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column Preview */}
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-xs font-bold text-brand-800 uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{formData.badgeText}</span>
                </div>

                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans leading-tight">
                  {formData.titlePrefix} <span className="text-brand-700">{formData.titleHighlight}</span>
                </h2>

                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                  {formData.description}
                </p>

                {/* 4 Pillars Preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Microscope className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-none">{formData.pillar1Title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 pl-8">{formData.pillar1Desc}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <ShieldCheck className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-none">{formData.pillar2Title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 pl-8">{formData.pillar2Desc}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Stethoscope className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-none">{formData.pillar3Title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 pl-8">{formData.pillar3Desc}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-2xs">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 leading-none">{formData.pillar4Title}</h4>
                    </div>
                    <p className="text-[11px] text-slate-500 line-clamp-2 pl-8">{formData.pillar4Desc}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <span className="px-5 py-2.5 gold-gradient text-brand-900 font-bold text-xs rounded-full shadow flex items-center gap-1.5">
                    {formData.primaryBtnText} <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-semibold text-xs rounded-full shadow-2xs">
                    {formData.secondaryBtnText}
                  </span>
                </div>
              </div>

              {/* Right Laboratory Image Graphic Preview */}
              <div className="lg:col-span-6 relative">
                <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 shadow-xl h-80 sm:h-96 w-full bg-slate-900">
                  {formData.imageUrl && !previewImageError ? (
                    <Image
                      src={formData.imageUrl}
                      alt="Laboratory Facility"
                      fill
                      className="object-cover"
                      onError={() => setPreviewImageError(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                      <ImageIcon className="w-12 h-12 text-slate-600" />
                      <span className="text-xs">No image provided</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-slate-950/20 pointer-events-none" />

                  {/* Floating Badges */}
                  <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2 max-w-xs">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-900 leading-tight">{formData.badge1Title}</h5>
                      <span className="text-[9px] text-slate-500">{formData.badge1Subtitle}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-md flex items-center gap-2 max-w-xs">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-[11px] font-bold text-slate-900 leading-tight">{formData.badge2Title}</h5>
                      <span className="text-[9px] text-slate-500">{formData.badge2Subtitle}</span>
                    </div>
                  </div>

                  <div className="absolute bottom-4 right-4 bg-brand-800/90 text-white backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-500/50 shadow-md flex items-center gap-1.5 text-[11px] font-semibold">
                    <CheckCircle className="w-3.5 h-3.5 text-yellow-400" />
                    <span>{formData.badge3Text}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Editing Tabs Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
            
            {/* Tab navigation */}
            <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'content'
                    ? 'bg-brand-900 text-yellow-400 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Type className="w-4 h-4" /> 1. Headlines & Copy
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('image')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'image'
                    ? 'bg-brand-900 text-yellow-400 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> 2. Laboratory Image Upload
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pillars')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'pillars'
                    ? 'bg-brand-900 text-yellow-400 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Layers className="w-4 h-4" /> 3. Four Feature Pillars
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('badges')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === 'badges'
                    ? 'bg-brand-900 text-yellow-400 shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Sliders className="w-4 h-4" /> 4. Floating Badges & CTAs
              </button>
            </div>

            {/* TAB 1: Headlines & Copy */}
            {activeTab === 'content' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block font-bold text-slate-700 mb-1">Badge Tag Text</label>
                    <input
                      type="text"
                      value={formData.badgeText}
                      onChange={(e) => setFormData({ ...formData, badgeText: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block font-bold text-slate-700 mb-1">Headline Main Prefix</label>
                    <input
                      type="text"
                      value={formData.titlePrefix}
                      onChange={(e) => setFormData({ ...formData, titlePrefix: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="block font-bold text-slate-700 mb-1">Headline Highlight (Green Text)</label>
                    <input
                      type="text"
                      value={formData.titleHighlight}
                      onChange={(e) => setFormData({ ...formData, titleHighlight: e.target.value })}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-brand-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description Paragraph</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed font-medium"
                  />
                </div>
              </div>
            )}

            {/* TAB 2: Laboratory Image Upload */}
            {activeTab === 'image' && (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Laboratory Facility Image</h3>
                    <p className="text-slate-500">Upload high-resolution lab photo or provide direct image URL.</p>
                  </div>

                  <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setImageMode('upload')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        imageMode === 'upload' ? 'bg-white text-brand-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Cloudinary Upload
                    </button>
                    <button
                      type="button"
                      onClick={() => setImageMode('url')}
                      className={`px-3 py-1 rounded-lg font-bold transition-all ${
                        imageMode === 'url' ? 'bg-white text-brand-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'
                      }`}
                    >
                      Direct URL
                    </button>
                  </div>
                </div>

                {imageMode === 'upload' ? (
                  <div className="border-2 border-dashed border-slate-300 hover:border-brand-600 p-6 rounded-2xl text-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="about-lab-upload"
                    />
                    <label htmlFor="about-lab-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-brand-700/10 text-brand-700 flex items-center justify-center">
                        {imageUploading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Upload className="w-6 h-6" />}
                      </div>
                      <span className="text-sm font-bold text-slate-800">
                        {imageUploading ? 'Uploading Lab Image to Cloudinary...' : 'Select Laboratory Facility Image'}
                      </span>
                      <span className="text-[11px] text-slate-400">PNG, JPG, WebP supported</span>
                    </label>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={imagePastedUrl}
                        onChange={(e) => setImagePastedUrl(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleApplyUrl}
                      className="px-4 py-2 bg-brand-900 text-yellow-400 font-bold rounded-xl shadow"
                    >
                      Apply URL
                    </button>
                  </div>
                )}

                {formData.imageUrl && (
                  <div className="bg-slate-900 text-white p-3.5 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Current Image URL</span>
                      {formData.imagePublicId && (
                        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">
                          {formData.imagePublicId}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 font-mono truncate">{formData.imageUrl}</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Four Feature Pillars */}
            {activeTab === 'pillars' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Pillar 1 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Pillar 1 (Analyzers)
                  </span>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.pillar1Title}
                      onChange={(e) => setFormData({ ...formData, pillar1Title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={formData.pillar1Desc}
                      onChange={(e) => setFormData({ ...formData, pillar1Desc: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                    />
                  </div>
                </div>

                {/* Pillar 2 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Pillar 2 (NABL / ISO)
                  </span>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.pillar2Title}
                      onChange={(e) => setFormData({ ...formData, pillar2Title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={formData.pillar2Desc}
                      onChange={(e) => setFormData({ ...formData, pillar2Desc: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                    />
                  </div>
                </div>

                {/* Pillar 3 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Pillar 3 (Pathologist)
                  </span>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.pillar3Title}
                      onChange={(e) => setFormData({ ...formData, pillar3Title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={formData.pillar3Desc}
                      onChange={(e) => setFormData({ ...formData, pillar3Desc: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                    />
                  </div>
                </div>

                {/* Pillar 4 */}
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Pillar 4 (Same-Day Reports)
                  </span>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={formData.pillar4Title}
                      onChange={(e) => setFormData({ ...formData, pillar4Title: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={formData.pillar4Desc}
                      onChange={(e) => setFormData({ ...formData, pillar4Desc: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: Floating Badges & CTAs */}
            {activeTab === 'badges' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                      Badge 1 (Top Right)
                    </span>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Headline</label>
                      <input
                        type="text"
                        value={formData.badge1Title}
                        onChange={(e) => setFormData({ ...formData, badge1Title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={formData.badge1Subtitle}
                        onChange={(e) => setFormData({ ...formData, badge1Subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded uppercase">
                      Badge 2 (Bottom Left)
                    </span>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Headline</label>
                      <input
                        type="text"
                        value={formData.badge2Title}
                        onChange={(e) => setFormData({ ...formData, badge2Title: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Subtitle</label>
                      <input
                        type="text"
                        value={formData.badge2Subtitle}
                        onChange={(e) => setFormData({ ...formData, badge2Subtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-bold text-brand-800 bg-brand-100 px-2 py-0.5 rounded uppercase">
                      Badge 3 (Bottom Right)
                    </span>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Pill Tag Text</label>
                      <input
                        type="text"
                        value={formData.badge3Text}
                        onChange={(e) => setFormData({ ...formData, badge3Text: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Button Text</label>
                    <input
                      type="text"
                      value={formData.primaryBtnText}
                      onChange={(e) => setFormData({ ...formData, primaryBtnText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Primary Button Link</label>
                    <input
                      type="text"
                      value={formData.primaryBtnLink}
                      onChange={(e) => setFormData({ ...formData, primaryBtnLink: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Secondary Button Text</label>
                    <input
                      type="text"
                      value={formData.secondaryBtnText}
                      onChange={(e) => setFormData({ ...formData, secondaryBtnText: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bottom Form Actions Bar */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
              <div className="text-xs">
                {isDirty ? (
                  <span className="text-amber-600 font-bold flex items-center gap-1.5">
                    ● You have unsaved changes. Remember to click Save.
                  </span>
                ) : (
                  <span className="text-slate-400">All changes are saved to Supabase.</span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-3 bg-brand-900 text-yellow-400 font-bold text-xs rounded-xl shadow-md hover:bg-brand-800 flex items-center gap-2 hover:scale-[1.02] transition-transform"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  {saving ? 'Saving...' : 'Save About Us Settings'}
                </button>
              </div>
            </div>

          </div>
        </form>

      </div>
    </AdminLayout>
  );
}
