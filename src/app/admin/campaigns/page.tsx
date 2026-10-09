'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { CampaignItem, DiagnosticTestItem } from '@/types';
import {
  serializeCampaignContent,
  CampaignIncludedItem,
  CampaignBenefitItem,
  CampaignFaqItem,
  DEFAULT_HIGHLIGHTS,
  DEFAULT_INCLUDED_SERVICES,
  DEFAULT_BENEFITS,
  DEFAULT_FAQS,
} from '@/lib/campaign-helper';
import {
  Plus,
  Megaphone,
  Edit,
  Trash2,
  ExternalLink,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  CheckCircle,
  Globe,
  CheckSquare,
  FileCheck,
  Award,
  HelpCircle,
  Layers,
  Home,
  Shield,
  FileText,
  Users,
  X,
  Save,
} from 'lucide-react';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Tab State for "Create New Campaign" Form
  const [activeTab, setActiveTab] = useState<
    'basic' | 'highlights' | 'included' | 'benefits' | 'faqs' | 'seo' | 'sections'
  >('basic');

  // Basic Campaign Fields
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [badgeText, setBadgeText] = useState('SPECIAL DIAGNOSTIC CAMPAIGN');
  const [overview, setOverview] = useState(
    'Comprehensive health checkup designed with precision testing and doorstep sample collection.'
  );
  const [price, setPrice] = useState<number>(2499);
  const [originalPrice, setOriginalPrice] = useState<number | null>(5999);
  const [discount, setDiscount] = useState('58% OFF');
  const [ctaText, setCtaText] = useState('Book Senior Health Package');
  const [ctaLink, setCtaLink] = useState('#campaign-enquiry-card');
  const [heroImageUrl, setHeroImageUrl] = useState('/senior-couple.webp');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  // Structured Data State
  const [highlights, setHighlights] = useState<string[]>([...DEFAULT_HIGHLIGHTS]);
  const [newHighlight, setNewHighlight] = useState('');

  const [includedHeading, setIncludedHeading] = useState('72+ Tests for Complete Senior Health Assessment');
  const [includedServices, setIncludedServices] = useState<CampaignIncludedItem[]>([
    ...DEFAULT_INCLUDED_SERVICES,
  ]);
  const [newIncludedTitle, setNewIncludedTitle] = useState('');
  const [newIncludedDesc, setNewIncludedDesc] = useState('');
  const [newIncludedIcon, setNewIncludedIcon] = useState('droplet');

  // Diagnostic Test Catalog for Quick Ingestion
  const [testCatalog, setTestCatalog] = useState<DiagnosticTestItem[]>([]);
  const [selectedCatalogTestId, setSelectedCatalogTestId] = useState('');

  const [benefits, setBenefits] = useState<CampaignBenefitItem[]>([...DEFAULT_BENEFITS]);
  const [faqs, setFaqs] = useState<CampaignFaqItem[]>([...DEFAULT_FAQS]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Extra Sections
  const [extraSections, setExtraSections] = useState<{ title: string; content: string; imageUrl?: string }[]>(
    []
  );
  const [newSecTitle, setNewSecTitle] = useState('');
  const [newSecContent, setNewSecContent] = useState('');
  const [newSecImageUrl, setNewSecImageUrl] = useState('');
  const [uploadingSecImg, setUploadingSecImg] = useState(false);

  useEffect(() => {
    loadCampaigns();

    // Fetch tests catalog for optional quick ingest into What's Included
    fetch('/api/tests')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json?.success && json?.data) {
          setTestCatalog(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setCampaigns(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'banner');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setHeroImageUrl(data.data.url);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSectionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingSecImg(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'general');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setNewSecImageUrl(data.data.url);
      }
    } catch (err) {
      console.error('Section image upload failed:', err);
    } finally {
      setUploadingSecImg(false);
    }
  };

  // Highlights management
  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setHighlights((prev) => [...prev, newHighlight.trim()]);
    setNewHighlight('');
  };

  const removeHighlight = (idx: number) => {
    setHighlights((prev) => prev.filter((_, i) => i !== idx));
  };

  // Included Services management
  const addIncludedService = () => {
    if (!newIncludedTitle.trim()) return;
    setIncludedServices((prev) => [
      ...prev,
      {
        title: newIncludedTitle.trim(),
        description: newIncludedDesc.trim() || undefined,
        icon: newIncludedIcon || 'droplet',
      },
    ]);
    setNewIncludedTitle('');
    setNewIncludedDesc('');
  };

  const addFromCatalog = () => {
    if (!selectedCatalogTestId) return;
    const test = testCatalog.find((t) => t.id === selectedCatalogTestId);
    if (!test) return;
    setIncludedServices((prev) => [
      ...prev,
      {
        title: test.name,
        description: test.description || `Sample: ${test.sampleType} • Turnaround: ${test.reportTurnaround}`,
        icon: test.category.toLowerCase().includes('blood') ? 'droplet' : 'activity',
      },
    ]);
    setSelectedCatalogTestId('');
  };

  const removeIncludedService = (idx: number) => {
    setIncludedServices((prev) => prev.filter((_, i) => i !== idx));
  };

  // Benefits management
  const updateBenefit = (idx: number, field: keyof CampaignBenefitItem, val: string) => {
    setBenefits((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  // FAQs management
  const addFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFaqs((prev) => [...prev, { question: newFaqQ.trim(), answer: newFaqA.trim() }]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  const removeFaq = (idx: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateFaq = (idx: number, field: 'question' | 'answer', val: string) => {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
  };

  // Extra Sections management
  const addExtraSection = () => {
    if (!newSecTitle.trim() || !newSecContent.trim()) return;
    setExtraSections((prev) => [
      ...prev,
      {
        title: newSecTitle.trim(),
        content: newSecContent.trim(),
        imageUrl: newSecImageUrl || undefined,
      },
    ]);
    setNewSecTitle('');
    setNewSecContent('');
    setNewSecImageUrl('');
  };

  const removeExtraSection = (idx: number) => {
    setExtraSections((prev) => prev.filter((_, i) => i !== idx));
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setTitle('');
    setBadgeText('SPECIAL DIAGNOSTIC CAMPAIGN');
    setOverview('Comprehensive health checkup designed with precision testing and doorstep sample collection.');
    setPrice(2499);
    setOriginalPrice(5999);
    setDiscount('58% OFF');
    setCtaText('Book Senior Health Package');
    setCtaLink('#campaign-enquiry-card');
    setHeroImageUrl('/senior-couple.webp');
    setSeoTitle('');
    setSeoDescription('');
    setIsActive(true);
    setHighlights([...DEFAULT_HIGHLIGHTS]);
    setIncludedHeading('72+ Tests for Complete Senior Health Assessment');
    setIncludedServices([...DEFAULT_INCLUDED_SERVICES]);
    setBenefits([...DEFAULT_BENEFITS]);
    setFaqs([...DEFAULT_FAQS]);
    setExtraSections([]);
    setActiveTab('basic');
    setIsFormOpen(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim()) {
      alert('Please fill in both the Campaign Internal Name and Public Headline.');
      setActiveTab('basic');
      return;
    }
    setSaving(true);

    try {
      // Serialize all structured data tabs into the description
      const serializedDescription = serializeCampaignContent({
        overview,
        badgeText,
        price: Number(price) || 0,
        originalPrice: originalPrice ? Number(originalPrice) : null,
        discount,
        highlights,
        includedHeading,
        includedServices,
        benefits,
        faqs,
      });

      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim() || undefined,
          title: title.trim(),
          subtitle: badgeText || undefined,
          description: serializedDescription,
          ctaText: ctaText || 'Book Senior Health Package',
          ctaLink: ctaLink || undefined,
          heroImageUrl: heroImageUrl || undefined,
          seoTitle: seoTitle || undefined,
          seoDescription: seoDescription || undefined,
          isActive,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const createdCampaign = json?.data;

        // If extra sections were added, post each one
        if (createdCampaign?.id && extraSections.length > 0) {
          for (const sec of extraSections) {
            await fetch(`/api/campaigns/${createdCampaign.id}/sections`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                title: sec.title,
                content: sec.content,
                imageUrl: sec.imageUrl || undefined,
              }),
            }).catch(() => {});
          }
        }

        await loadCampaigns();
        resetForm();
        alert('Campaign created successfully with all structured sections!');
      } else {
        const errJson = await res.json().catch(() => ({}));
        alert(errJson.message || 'Failed to create campaign. Please check inputs.');
      }
    } catch (err) {
      console.error('Campaign create failed:', err);
      alert('Connection error while creating campaign.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/campaigns/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setCampaigns((prev) =>
          prev.map((c) => (c.id === id ? { ...c, isActive: !currentStatus } : c))
        );
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this marketing campaign drive?')) {
      try {
        await fetch(`/api/campaigns/${id}`, { method: 'DELETE' });
        await loadCampaigns();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-sans">Campaign Drives CMS</h1>
            <p className="text-xs text-slate-500">
              Create &amp; manage promotional landing pages for Meta Ads and organic marketing.
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <Link
              href="/campaigns"
              target="_blank"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs flex items-center gap-2 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Public Campaigns Page
            </Link>
            <button
              onClick={() => {
                resetForm();
                setIsFormOpen(true);
              }}
              className="px-5 py-2.5 gold-gradient text-brand-900 font-bold text-xs rounded-xl shadow flex items-center gap-2 w-fit hover:scale-105 transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create New Campaign
            </button>
          </div>
        </div>

        {/* Modal / Multi-Tab Create Form */}
        {isFormOpen && (
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200 shadow-xl space-y-6 animate-in fade-in">
            {/* Top Bar with Title and Close Button */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block font-bold">
                  New Campaign Builder
                </span>
                <h2 className="text-lg font-bold text-slate-900">Create Marketing Campaign</h2>
              </div>
              <button
                type="button"
                onClick={resetForm}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB NAVIGATION BAR (Matching reference screenshot exactly) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'basic'
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Basic &amp; Hero Banner
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('highlights')}
                className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'highlights'
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CheckSquare className="w-3.5 h-3.5" /> Hero Highlights ({highlights.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('included')}
                className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'included'
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <FileCheck className="w-3.5 h-3.5" /> What&apos;s Included ({includedServices.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('benefits')}
                className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'benefits'
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Award className="w-3.5 h-3.5" /> Why Choose ({benefits.length} Benefits)
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('faqs')}
                className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'faqs'
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <HelpCircle className="w-3.5 h-3.5" /> FAQs ({faqs.length})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'seo'
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Globe className="w-3.5 h-3.5" /> SEO &amp; Status
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('sections')}
                className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  activeTab === 'sections'
                    ? 'bg-teal-700 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5" /> Extra Sections ({extraSections.length})
              </button>
            </div>

            {/* TAB CONTENTS */}
            <form onSubmit={handleCreate} className="space-y-6">
              {/* TAB 1: BASIC & HERO BANNER */}
              {activeTab === 'basic' && (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">Hero Section &amp; Pricing Setup</h3>
                    <p className="text-slate-500 text-[11px]">
                      Configure headline, package offer name, pricing, discount, and hero banner image.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Campaign Internal Identifier *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Senior Care Drive 2026"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Campaign Badge Pill (Top Hero)
                      </label>
                      <input
                        type="text"
                        value={badgeText}
                        placeholder="SPECIAL DIAGNOSTIC CAMPAIGN"
                        onChange={(e) => setBadgeText(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Public Landing Headline / Package Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Comprehensive Senior Health Checkup"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold focus:bg-white text-sm"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Short Hero Description / Overview
                    </label>
                    <textarea
                      rows={2}
                      value={overview}
                      placeholder="Stay healthy. Stay active. A complete health assessment designed for senior citizens..."
                      onChange={(e) => setOverview(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white"
                    />
                  </div>

                  {/* Pricing Grid */}
                  <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-100 grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-semibold text-teal-900 mb-1">Offer Price (₹) *</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg text-slate-900 font-bold"
                      />
                      <span className="text-[10px] text-teal-700 mt-0.5 block">Customer pays this amount</span>
                    </div>

                    <div>
                      <label className="block font-semibold text-teal-900 mb-1">Original Price / MRP (₹)</label>
                      <input
                        type="number"
                        value={originalPrice ?? ''}
                        onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : null)}
                        className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg text-slate-900"
                      />
                      <span className="text-[10px] text-teal-700 mt-0.5 block">Shown with strikethrough</span>
                    </div>

                    <div>
                      <label className="block font-semibold text-teal-900 mb-1">Discount Badge Text</label>
                      <input
                        type="text"
                        value={discount}
                        placeholder="58% OFF"
                        onChange={(e) => setDiscount(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg text-slate-900 font-bold text-amber-700"
                      />
                      <span className="text-[10px] text-teal-700 mt-0.5 block">e.g. 58% OFF or SAVE ₹3,500</span>
                    </div>
                  </div>

                  {/* CTA & Banner Image */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Main CTA Button Text</label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        CTA Action Anchor / Target
                      </label>
                      <input
                        type="text"
                        value={ctaLink}
                        placeholder="#campaign-enquiry-card"
                        onChange={(e) => setCtaLink(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Hero Banner Image (Cloudinary or default image)
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleHeroImageUpload}
                        className="text-xs text-slate-600"
                      />
                      {uploading && (
                        <span className="text-teal-700 font-bold flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                        </span>
                      )}
                      {heroImageUrl && (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5" /> Image Ready
                        </span>
                      )}
                    </div>
                    {heroImageUrl && (
                      <div className="mt-2 h-24 w-44 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                        <img src={heroImageUrl} alt="Hero preview" className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: HERO HIGHLIGHTS */}
              {activeTab === 'highlights' && (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">Hero Highlight Points</h3>
                    <p className="text-slate-500 text-[11px]">
                      Bullet points displayed below the headline on the left side of the hero (e.g. 72+ Important Tests).
                    </p>
                  </div>

                  {/* Highlights list */}
                  <div className="space-y-2">
                    {highlights.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs"
                      >
                        <span className="font-semibold text-slate-800 flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                          {item}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeHighlight(idx)}
                          className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add highlight input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 72+ Important Tests"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addHighlight();
                        }
                      }}
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="px-4 py-2 bg-teal-700 text-white font-bold text-xs rounded-xl hover:bg-teal-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Point
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 3: WHAT'S INCLUDED */}
              {activeTab === 'included' && (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">
                      What&apos;s Included (Diagnostic Tests &amp; Service Panels)
                    </h3>
                    <p className="text-slate-500 text-[11px]">
                      Compact white cards displaying diagnostic parameters and organ profiles.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Section Heading</label>
                    <input
                      type="text"
                      value={includedHeading}
                      placeholder="72+ Tests for Complete Senior Health Assessment"
                      onChange={(e) => setIncludedHeading(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white"
                    />
                  </div>

                  {/* Ingest from Diagnostic Catalog */}
                  {testCatalog.length > 0 && (
                    <div className="p-3.5 bg-teal-50/60 rounded-2xl border border-teal-100 flex flex-col sm:flex-row items-center gap-2.5">
                      <span className="text-xs font-bold text-teal-900 whitespace-nowrap">
                        Add From Diagnostic Catalog:
                      </span>
                      <select
                        value={selectedCatalogTestId}
                        onChange={(e) => setSelectedCatalogTestId(e.target.value)}
                        className="flex-1 px-3 py-2 bg-white border border-teal-200 rounded-xl text-xs text-slate-900"
                      >
                        <option value="">-- Choose existing test to insert --</option>
                        {testCatalog.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name} ({t.category} • ₹{t.price})
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={addFromCatalog}
                        disabled={!selectedCatalogTestId}
                        className="px-4 py-2 bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl hover:bg-teal-800 cursor-pointer"
                      >
                        Insert Test
                      </button>
                    </div>
                  )}

                  {/* Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {includedServices.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-start justify-between gap-3"
                      >
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 text-sm block">{item.title}</span>
                          {item.description && <p className="text-slate-600 text-xs">{item.description}</p>}
                          <span className="text-[10px] font-mono text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded">
                            Icon: {item.icon || 'droplet'}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeIncludedService(idx)}
                          className="p-1.5 text-red-500 hover:text-red-700 shrink-0 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Test Box */}
                  <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-800 block">Add Custom Included Test</span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Test Title (e.g. Complete Blood Count (CBC))"
                        value={newIncludedTitle}
                        onChange={(e) => setNewIncludedTitle(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                      />
                      <select
                        value={newIncludedIcon}
                        onChange={(e) => setNewIncludedIcon(e.target.value)}
                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                      >
                        <option value="droplet">Droplet (Blood / CBC)</option>
                        <option value="activity">Activity (Diabetes / Sugar)</option>
                        <option value="flask">Flask (Liver / LFT)</option>
                        <option value="shield">Shield (Kidney / KFT)</option>
                        <option value="heart">Heart (Lipid / Cholesterol)</option>
                        <option value="zap">Zap (Thyroid / Hormones)</option>
                        <option value="sun">Pill (Vitamins / D &amp; B12)</option>
                        <option value="cardiac">Cardiac Pulse (Heart Markers)</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Optional short description / subtext (e.g. Hemoglobin, Platelets...)"
                      value={newIncludedDesc}
                      onChange={(e) => setNewIncludedDesc(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={addIncludedService}
                      className="px-4 py-2 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Included Test
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 4: WHY CHOOSE BENEFITS */}
              {activeTab === 'benefits' && (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">
                      Why Choose This Campaign (4 Benefit Cards)
                    </h3>
                    <p className="text-slate-500 text-[11px]">
                      The 4 key value proposition cards featuring fixed mint medical icons.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {benefits.map((b, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3"
                      >
                        <div className="flex items-center gap-2 pb-1">
                          <div className="w-7 h-7 rounded-lg bg-[#e8f7f2] border border-teal-100 flex items-center justify-center shrink-0">
                            {idx === 0 && <Home className="w-3.5 h-3.5 text-teal-700" />}
                            {idx === 1 && <Shield className="w-3.5 h-3.5 text-teal-700" />}
                            {idx === 2 && <FileText className="w-3.5 h-3.5 text-teal-700" />}
                            {idx === 3 && <Users className="w-3.5 h-3.5 text-teal-700" />}
                          </div>
                          <span className="font-mono text-[10px] text-teal-700 font-bold uppercase bg-teal-100/60 px-2 py-0.5 rounded">
                            Benefit Card 0{idx + 1}
                          </span>
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Title</label>
                          <input
                            type="text"
                            value={b.title}
                            onChange={(e) => updateBenefit(idx, 'title', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 font-semibold"
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">Description</label>
                          <textarea
                            rows={3}
                            value={b.description}
                            onChange={(e) => updateBenefit(idx, 'description', e.target.value)}
                            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: FAQS */}
              {activeTab === 'faqs' && (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">Campaign Frequently Asked Questions</h3>
                    <p className="text-slate-500 text-[11px]">
                      Accordion Q&amp;A cards displayed dynamically on the landing page.
                    </p>
                  </div>

                  {/* Add New FAQ Box */}
                  <div className="p-4 bg-teal-50/60 rounded-2xl border border-teal-200/80 space-y-3">
                    <div className="flex items-center gap-2 font-bold text-teal-900">
                      <Plus className="w-4 h-4 text-teal-700" />
                      <span>Add New FAQ Question</span>
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Question Title *</label>
                      <input
                        type="text"
                        placeholder="e.g. Is home sample collection available?"
                        value={newFaqQ}
                        onChange={(e) => setNewFaqQ(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Answer Content *</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Yes, our certified phlebotomists collect blood and urine samples from your doorstep..."
                        value={newFaqA}
                        onChange={(e) => setNewFaqA(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addFaq}
                      className="px-4 py-2 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Question to List
                    </button>
                  </div>

                  {/* Existing FAQ items */}
                  <div className="space-y-3">
                    {faqs.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 relative"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[10px] text-teal-700 font-bold uppercase bg-teal-100/60 px-2 py-0.5 rounded">
                            FAQ #{idx + 1}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFaq(idx)}
                            className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <input
                          type="text"
                          value={f.question}
                          onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                        />
                        <textarea
                          rows={2}
                          value={f.answer}
                          onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-700"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: SEO & STATUS */}
              {activeTab === 'seo' && (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">SEO Meta Tags &amp; URL Settings</h3>
                    <p className="text-slate-500 text-[11px]">
                      Search engine optimization tags and public publishing visibility.
                    </p>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Custom URL Slug (optional)
                    </label>
                    <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl overflow-hidden">
                      <span className="px-3 text-slate-400 font-mono text-[11px] bg-slate-100 border-r border-slate-200 py-2">
                        /campaigns/
                      </span>
                      <input
                        type="text"
                        placeholder="e.g. senior-care-special"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'))}
                        className="w-full px-3 py-2 bg-transparent text-slate-900 font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">SEO Page Title</label>
                      <input
                        type="text"
                        placeholder="Custom browser tab title"
                        value={seoTitle}
                        onChange={(e) => setSeoTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">SEO Description</label>
                      <input
                        type="text"
                        placeholder="Search engine snippet preview"
                        value={seoDescription}
                        onChange={(e) => setSeoDescription(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-800">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 text-teal-700 rounded"
                      />
                      Publish Immediately (Visible on Public Campaigns directory and live landing URL)
                    </label>
                  </div>
                </div>
              )}

              {/* TAB 7: EXTRA SECTIONS */}
              {activeTab === 'sections' && (
                <div className="space-y-4 text-xs animate-in fade-in">
                  <div className="border-b border-slate-100 pb-2">
                    <h3 className="font-bold text-slate-900 text-sm">Additional Custom Content Blocks</h3>
                    <p className="text-slate-500 text-[11px]">
                      Add optional supplementary content blocks (guidelines, doctor notes, lab certificates).
                    </p>
                  </div>

                  {/* Add Section Box */}
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                    <span className="font-bold text-slate-800 block">Add New Extra Section</span>
                    <input
                      type="text"
                      placeholder="Section Title (e.g. Test Preparation Guidelines)"
                      value={newSecTitle}
                      onChange={(e) => setNewSecTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                    <textarea
                      rows={3}
                      placeholder="Detailed content, instructions, or bullet points..."
                      value={newSecContent}
                      onChange={(e) => setNewSecContent(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900"
                    />
                    <div className="flex items-center gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSectionImageUpload}
                        className="text-xs text-slate-600"
                      />
                      {uploadingSecImg && (
                        <span className="text-teal-700 font-bold flex items-center gap-1">
                          <Loader2 className="w-3 h-3 animate-spin" /> Uploading image...
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={addExtraSection}
                      className="px-4 py-2 bg-teal-700 text-white font-bold rounded-xl hover:bg-teal-800 flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Section
                    </button>
                  </div>

                  {/* Extra Sections List */}
                  {extraSections.length > 0 && (
                    <div className="space-y-3">
                      {extraSections.map((sec, idx) => (
                        <div
                          key={idx}
                          className="p-4 bg-white rounded-2xl border border-slate-200 flex items-start justify-between gap-3 shadow-xs"
                        >
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm">{sec.title}</h4>
                            <p className="text-slate-600 mt-1 line-clamp-2">{sec.content}</p>
                            {sec.imageUrl && (
                              <span className="text-[10px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded mt-2 inline-block">
                                Has Image
                              </span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => removeExtraSection(idx)}
                            className="p-1 text-red-500 hover:text-red-700 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ACTION BAR AT BOTTOM */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    All structured tabs are serialized and saved automatically.
                  </span>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-7 py-2.5 bg-brand-700 hover:bg-brand-800 text-yellow-400 font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer transition-transform hover:scale-102"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>{saving ? 'Creating Campaign...' : 'Create & Launch Campaign'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Existing Campaigns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-brand-700" /> Loading campaign drives...
            </div>
          ) : campaigns.length === 0 ? (
            <div className="col-span-2 bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
              No marketing campaigns created yet. Click &quot;Create New Campaign&quot; above to get started.
            </div>
          ) : (
            campaigns.map((c) => (
              <div
                key={c.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
                      <Megaphone className="w-3.5 h-3.5 text-amber-600" />
                      {c.name}
                    </span>
                    <button
                      onClick={() => handleToggleActive(c.id, c.isActive)}
                      disabled={togglingId === c.id}
                      className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors flex items-center gap-1 ${
                        c.isActive
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={c.isActive ? 'Click to unpublish' : 'Click to publish'}
                    >
                      {togglingId === c.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : c.isActive ? (
                        <>
                          <Eye className="w-3 h-3" /> Published
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-3 h-3" /> Unpublished
                        </>
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                  {c.subtitle && <p className="text-xs text-slate-500">{c.subtitle}</p>}

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 font-mono text-slate-600">
                    <div>
                      Direct URL: <strong className="text-brand-700">/campaigns/{c.slug}</strong>
                    </div>
                    <div>
                      Sections: <strong>{c.sections?.length || 0} content blocks</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <Link
                    href={`/campaigns/${c.slug}`}
                    target="_blank"
                    className="text-brand-700 font-bold hover:underline flex items-center gap-1"
                  >
                    View Landing Page <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/campaigns/${c.id}`}
                      className="px-3.5 py-1.5 bg-brand-700 text-yellow-400 font-bold rounded-lg hover:bg-brand-800 flex items-center gap-1.5"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Campaign Landing
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white cursor-pointer"
                      title="Delete Campaign"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
