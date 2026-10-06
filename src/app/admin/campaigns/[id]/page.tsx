'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { CampaignItem, CampaignSectionItem, DiagnosticTestItem } from '@/types';
import {
  parseCampaignContent,
  serializeCampaignContent,
  CampaignIncludedItem,
  CampaignBenefitItem,
  CampaignFaqItem,
} from '@/lib/campaign-helper';
import {
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  ExternalLink,
  Loader2,
  Image as ImageIcon,
  CheckCircle,
  Globe,
  Edit2,
  X,
  Layers,
  Sparkles,
  HelpCircle,
  CheckSquare,
  FileCheck,
  Award,
  Home,
  Shield,
  FileText,
  Users,
} from 'lucide-react';

export default function AdminCampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<CampaignItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'basic' | 'highlights' | 'included' | 'benefits' | 'faqs' | 'seo' | 'sections'>('basic');

  // Basic Campaign Fields
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [badgeText, setBadgeText] = useState('SPECIAL DIAGNOSTIC CAMPAIGN');
  const [overview, setOverview] = useState('');
  const [price, setPrice] = useState<number>(2499);
  const [originalPrice, setOriginalPrice] = useState<number | null>(5999);
  const [discount, setDiscount] = useState('58% OFF');
  const [ctaText, setCtaText] = useState('Book Senior Health Package');
  const [ctaLink, setCtaLink] = useState('#campaign-enquiry-card');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [uploadingHero, setUploadingHero] = useState(false);

  // Dynamic Landing Page Structured Data
  const [highlights, setHighlights] = useState<string[]>([]);
  const [newHighlight, setNewHighlight] = useState('');

  const [includedHeading, setIncludedHeading] = useState('72+ Tests for Complete Senior Health Assessment');
  const [includedServices, setIncludedServices] = useState<CampaignIncludedItem[]>([]);
  const [newIncludedTitle, setNewIncludedTitle] = useState('');
  const [newIncludedDesc, setNewIncludedDesc] = useState('');
  const [newIncludedIcon, setNewIncludedIcon] = useState('droplet');

  // Diagnostic Test Catalog for Quick Ingestion
  const [testCatalog, setTestCatalog] = useState<DiagnosticTestItem[]>([]);
  const [selectedCatalogTestId, setSelectedCatalogTestId] = useState('');

  const [benefits, setBenefits] = useState<CampaignBenefitItem[]>([]);
  const [faqs, setFaqs] = useState<CampaignFaqItem[]>([]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  // Legacy/Custom Content Sections
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionContent, setSectionContent] = useState('');
  const [sectionImageUrl, setSectionImageUrl] = useState('');
  const [addingSection, setAddingSection] = useState(false);
  const [uploadingSectionImg, setUploadingSectionImg] = useState(false);

  // Editing Section State
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [editSecTitle, setEditSecTitle] = useState('');
  const [editSecContent, setEditSecContent] = useState('');
  const [editSecImageUrl, setEditSecImageUrl] = useState('');
  const [updatingSection, setUpdatingSection] = useState(false);

  useEffect(() => {
    if (campaignId) {
      loadCampaign();
      loadTestCatalog();
    }
  }, [campaignId]);

  const loadTestCatalog = async () => {
    try {
      const res = await fetch('/api/tests');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setTestCatalog(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load test catalog:', err);
    }
  };

  const loadCampaign = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          const c = data.data as CampaignItem;
          setCampaign(c);
          setName(c.name);
          setTitle(c.title);
          setCtaText(c.ctaText || 'Book Senior Health Package');
          setCtaLink(c.ctaLink || '#campaign-enquiry-card');
          setHeroImageUrl(c.heroImageUrl || '');
          setSeoTitle(c.seoTitle || '');
          setSeoDescription(c.seoDescription || '');
          setIsActive(c.isActive);

          const parsed = parseCampaignContent(c);
          setBadgeText(parsed.badgeText || c.subtitle || 'SPECIAL DIAGNOSTIC CAMPAIGN');
          setOverview(parsed.overview || '');
          setPrice(parsed.price);
          setOriginalPrice(parsed.originalPrice);
          setDiscount(parsed.discount);
          setHighlights(parsed.highlights);
          setIncludedHeading(parsed.includedHeading || '72+ Tests for Complete Senior Health Assessment');
          setIncludedServices(parsed.includedServices);
          setBenefits(parsed.benefits);
          setFaqs(parsed.faqs);
        }
      }
    } catch (err) {
      console.error('Failed to load campaign detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingHero(true);

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
      console.error('Hero upload error:', err);
    } finally {
      setUploadingHero(false);
    }
  };

  const handleSectionImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit = false
  ) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setUploadingSectionImg(true);

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
        if (isEdit) {
          setEditSecImageUrl(data.data.url);
        } else {
          setSectionImageUrl(data.data.url);
        }
      }
    } catch (err) {
      console.error('Section image upload error:', err);
    } finally {
      setUploadingSectionImg(false);
    }
  };

  const handleUpdateCampaign = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      // Serialize structured campaign data into JSON description
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

      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          title,
          subtitle: badgeText || undefined,
          description: serializedDescription,
          heroImageUrl: heroImageUrl || undefined,
          ctaText,
          ctaLink: ctaLink || undefined,
          seoTitle: seoTitle || undefined,
          seoDescription: seoDescription || undefined,
          isActive,
        }),
      });
      if (res.ok) {
        await loadCampaign();
        alert('Campaign landing page updated successfully!');
      } else {
        alert('Failed to save campaign. Please check input.');
      }
    } catch (err) {
      console.error('Save campaign error:', err);
      alert('Error updating campaign.');
    } finally {
      setSaving(false);
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

  // Content Sections
  const handleAddSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sectionTitle || !sectionContent) return;
    setAddingSection(true);

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/sections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: sectionTitle,
          content: sectionContent,
          imageUrl: sectionImageUrl || undefined,
        }),
      });

      if (res.ok) {
        setSectionTitle('');
        setSectionContent('');
        setSectionImageUrl('');
        await loadCampaign();
      }
    } catch (err) {
      console.error('Add section failed:', err);
    } finally {
      setAddingSection(false);
    }
  };

  const startEditSection = (sec: CampaignSectionItem) => {
    setEditingSectionId(sec.id);
    setEditSecTitle(sec.title);
    setEditSecContent(sec.content);
    setEditSecImageUrl(sec.imageUrl || '');
  };

  const cancelEditSection = () => {
    setEditingSectionId(null);
    setEditSecTitle('');
    setEditSecContent('');
    setEditSecImageUrl('');
  };

  const handleUpdateSection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSectionId) return;
    setUpdatingSection(true);

    try {
      const res = await fetch(`/api/campaigns/${campaignId}/sections`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionId: editingSectionId,
          title: editSecTitle,
          content: editSecContent,
          imageUrl: editSecImageUrl || undefined,
        }),
      });

      if (res.ok) {
        cancelEditSection();
        await loadCampaign();
      }
    } catch (err) {
      console.error('Update section failed:', err);
    } finally {
      setUpdatingSection(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    if (!confirm('Are you sure you want to delete this section?')) return;
    try {
      const res = await fetch(
        `/api/campaigns/${campaignId}/sections?sectionId=${sectionId}`,
        {
          method: 'DELETE',
        }
      );
      if (res.ok) {
        await loadCampaign();
      }
    } catch (err) {
      console.error('Delete section failed:', err);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin text-teal-700" /> Loading campaign details...
        </div>
      </AdminLayout>
    );
  }

  if (!campaign) {
    return (
      <AdminLayout>
        <div className="text-center py-12 space-y-3">
          <p className="text-sm font-bold text-slate-700">Campaign not found</p>
          <Link href="/admin/campaigns" className="text-xs text-teal-700 hover:underline">
            ← Back to Campaigns list
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-6xl mx-auto pb-16">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/campaigns"
              className="p-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-100"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block font-semibold">
                Meta Ads Landing Page CMS
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{campaign.name}</h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href={`/campaigns/${campaign.slug}`}
              target="_blank"
              className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-teal-700 font-bold text-xs rounded-xl hover:bg-slate-100 flex items-center gap-1.5"
            >
              Live Campaign Landing Page <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-3.5 py-2 border font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer ${
                activeTab === 'faqs'
                  ? 'bg-teal-800 text-white border-teal-800'
                  : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Edit FAQs ({faqs.length})</span>
            </button>

            <button
              onClick={() => handleUpdateCampaign()}
              disabled={saving}
              className="px-5 py-2 bg-[#f5b324] hover:bg-[#e5a519] text-slate-950 font-extrabold rounded-xl shadow-xs flex items-center gap-1.5 text-xs transition-colors cursor-pointer"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? 'Saving...' : 'Save All Changes'}
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-semibold scrollbar-none">
          <button
            onClick={() => setActiveTab('basic')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'basic'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> Basic &amp; Hero Banner
          </button>
          <button
            onClick={() => setActiveTab('highlights')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'highlights'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" /> Hero Highlights ({highlights.length})
          </button>
          <button
            onClick={() => setActiveTab('included')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'included'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5" /> What&apos;s Included ({includedServices.length})
          </button>
          <button
            onClick={() => setActiveTab('benefits')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'benefits'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Why Choose (4 Benefits)
          </button>
          <button
            onClick={() => setActiveTab('faqs')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'faqs'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5" /> FAQs ({faqs.length})
          </button>
          <button
            onClick={() => setActiveTab('seo')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'seo'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> SEO &amp; Status
          </button>
          <button
            onClick={() => setActiveTab('sections')}
            className={`px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sections'
                ? 'bg-teal-700 text-white font-bold shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> Extra Sections
          </button>
        </div>

        {/* TAB 1: BASIC & HERO */}
        {activeTab === 'basic' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Hero Section &amp; Pricing Setup</h2>
              <p className="text-xs text-slate-500">
                Configure primary offer, headline, pricing, discount, and hero image seen on Meta Ads click.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Internal Campaign Identifier Name
                  </label>
                  <input
                    type="text"
                    required
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
                  Public Hero Headline / Package Name
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  placeholder="Comprehensive Senior Health Checkup"
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Short Hero Description / Subtitle
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
                  <label className="block font-semibold text-teal-900 mb-1">
                    Offer Price (₹) *
                  </label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg text-slate-900 font-bold"
                  />
                  <span className="text-[10px] text-teal-700 mt-0.5 block">Customer pays this amount</span>
                </div>

                <div>
                  <label className="block font-semibold text-teal-900 mb-1">
                    Original Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    value={originalPrice ?? ''}
                    onChange={(e) => setOriginalPrice(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 bg-white border border-teal-200 rounded-lg text-slate-900"
                  />
                  <span className="text-[10px] text-teal-700 mt-0.5 block">Shown with strikethrough</span>
                </div>

                <div>
                  <label className="block font-semibold text-teal-900 mb-1">
                    Discount Badge Text
                  </label>
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

              {/* CTA & Hero Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Main CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    CTA Action / Target Anchor
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
                  Hero Banner Image (Cloudinary)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleHeroImageUpload}
                    className="text-xs text-slate-600"
                  />
                  {uploadingHero && (
                    <span className="text-teal-700 font-bold flex items-center gap-1">
                      <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                    </span>
                  )}
                  {heroImageUrl && (
                    <span className="text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Banner Ready
                    </span>
                  )}
                </div>
                {heroImageUrl && (
                  <div className="mt-2 h-28 w-48 rounded-xl overflow-hidden border border-slate-200 shadow-xs">
                    <img
                      src={heroImageUrl}
                      alt="Hero preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HIGHLIGHTS */}
        {activeTab === 'highlights' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Hero Highlight Points</h2>
              <p className="text-xs text-slate-500">
                Bullet points displayed directly below the headline on the left side of the hero (e.g. 72+ Important Tests, Home Sample Collection).
              </p>
            </div>

            {/* List */}
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

            {/* Add new */}
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
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                What&apos;s Included (Diagnostic Tests &amp; Service Panels)
              </h2>
              <p className="text-xs text-slate-500">
                These compact cards show customers exactly which tests/organs are evaluated in this campaign.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1 text-xs">
                Section Heading
              </label>
              <input
                type="text"
                value={includedHeading}
                placeholder="72+ Tests for Complete Senior Health Assessment"
                onChange={(e) => setIncludedHeading(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold focus:bg-white"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Heading displayed above the test cards (e.g. 72+ Tests for Complete Senior Health Assessment).
              </span>
            </div>

            {/* Ingest from Diagnostic Catalog */}
            {testCatalog.length > 0 && (
              <div className="p-4 bg-teal-50/50 rounded-2xl border border-teal-100 flex flex-col sm:flex-row items-center gap-3">
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

            {/* List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {includedServices.map((item, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs flex items-start justify-between gap-3"
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

            {/* Manual Add Card */}
            <div className="p-4 bg-slate-100/80 rounded-2xl border border-slate-200 space-y-3 text-xs">
              <span className="font-bold text-slate-800 block">Add Custom Included Test/Service</span>
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

        {/* TAB 4: BENEFITS */}
        {activeTab === 'benefits' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                Why Choose This Campaign (4 Benefit Cards)
              </h2>
              <p className="text-xs text-slate-500">
                The visual icons remain fixed to the standard mint medical icons, while the Title and Description for each card can be managed below.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {benefits.map((b, idx) => (
                <div
                  key={idx}
                  className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs"
                >
                  <div className="flex items-center gap-2.5 pb-1">
                    <div className="w-8 h-8 rounded-lg bg-[#e8f7f2] border border-teal-100 flex items-center justify-center shrink-0">
                      {idx === 0 && <Home className="w-4 h-4 text-teal-700" />}
                      {idx === 1 && <Shield className="w-4 h-4 text-teal-700" />}
                      {idx === 2 && <FileText className="w-4 h-4 text-teal-700" />}
                      {idx === 3 && <Users className="w-4 h-4 text-teal-700" />}
                    </div>
                    <div>
                      <span className="font-mono text-[10px] text-teal-700 font-bold uppercase bg-teal-100/60 px-2 py-0.5 rounded">
                        Benefit Card 0{idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 ml-1.5 font-medium">
                        (Icon fixed per reference design)
                      </span>
                    </div>
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
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-900">Campaign Frequently Asked Questions (FAQs)</h2>
                <p className="text-xs text-slate-500">
                  Accordion questions &amp; answers displayed dynamically in 2 columns on the landing page.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/admin/faqs"
                  className="px-3 py-1.5 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs hover:bg-slate-100 flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" /> Full FAQs CMS
                </Link>
                <button
                  type="button"
                  onClick={() => handleUpdateCampaign()}
                  disabled={saving}
                  className="px-4 py-1.5 bg-[#f5b324] hover:bg-[#e5a519] text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save FAQs
                </button>
              </div>
            </div>

            {/* Add New FAQ Box at top */}
            <div className="p-5 bg-teal-50/60 rounded-2xl border border-teal-200/80 space-y-3 text-xs">
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
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-1 focus:ring-teal-700"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Answer Content *</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Yes, our certified phlebotomists collect blood and urine samples from your doorstep..."
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 focus:ring-1 focus:ring-teal-700"
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

            {/* List of FAQs */}
            <div className="space-y-3">
              <div className="font-bold text-slate-800 text-xs flex items-center justify-between">
                <span>Current Questions ({faqs.length})</span>
                <span className="text-[11px] text-slate-400 font-normal">Displayed in 2 columns</span>
              </div>

              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs hover:border-slate-300 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-500 flex items-center justify-center font-bold text-[11px] shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                      placeholder="Question"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold"
                    />
                    <button
                      type="button"
                      onClick={() => removeFaq(idx)}
                      className="p-1.5 text-red-400 hover:text-red-700 shrink-0 cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    value={faq.answer}
                    onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                    placeholder="Answer"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: SEO & STATUS */}
        {activeTab === 'seo' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Meta Ads &amp; Search Engine Optimization</h2>
              <p className="text-xs text-slate-500">
                Control the page meta title, description, and public activation status.
              </p>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Dedicated Campaign Slug (URL path)
                </label>
                <input
                  type="text"
                  disabled
                  value={campaign.slug}
                  className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Accessible directly via: /campaign/{campaign.slug}
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SEO Title Tag</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">SEO Meta Description</label>
                <textarea
                  rows={3}
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:bg-white"
                />
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-4 h-4 text-teal-700 rounded"
                  />
                  Campaign is Published &amp; Active (Accepting Meta Ads Traffic)
                </label>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: SECTIONS (Custom) */}
        {activeTab === 'sections' && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Custom Campaign Content Sections</h2>
              <p className="text-xs text-slate-500">
                Additional custom content sections for specific diagnostic campaign narratives.
              </p>
            </div>

            {/* Existing Sections */}
            <div className="space-y-4">
              {campaign.sections?.length === 0 ? (
                <p className="text-xs text-slate-400 italic">
                  No extra content sections added. The redesigned landing page already features structured Hero, What&apos;s Included, Benefits, How It Works, and FAQs.
                </p>
              ) : (
                campaign.sections?.map((sec, idx) => (
                  <div
                    key={sec.id}
                    className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3"
                  >
                    {editingSectionId === sec.id ? (
                      <form onSubmit={handleUpdateSection} className="space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-teal-700">Editing Section {idx + 1}</span>
                          <button
                            type="button"
                            onClick={cancelEditSection}
                            className="text-slate-400 hover:text-slate-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <input
                          type="text"
                          required
                          value={editSecTitle}
                          onChange={(e) => setEditSecTitle(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                        />
                        <textarea
                          rows={3}
                          required
                          value={editSecContent}
                          onChange={(e) => setEditSecContent(e.target.value)}
                          className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900"
                        />
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleSectionImageUpload(e, true)}
                              className="text-[11px] text-slate-500"
                            />
                            {editSecImageUrl && (
                              <span className="text-[11px] text-emerald-600 font-bold">✓ Image attached</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={cancelEditSection}
                              className="px-3 py-1 bg-slate-200 rounded-lg"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              disabled={updatingSection}
                              className="px-4 py-1 bg-teal-700 text-white font-bold rounded-lg"
                            >
                              {updatingSection ? 'Saving...' : 'Update Section'}
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1 text-xs min-w-0">
                          <span className="text-[10px] font-bold text-teal-700 bg-teal-100/60 px-2 py-0.5 rounded uppercase">
                            Section {idx + 1}
                          </span>
                          <h4 className="text-sm font-bold text-slate-900">{sec.title}</h4>
                          <p className="text-slate-600 whitespace-pre-wrap">{sec.content}</p>
                          {sec.imageUrl && (
                            <div className="pt-2">
                              <img
                                src={sec.imageUrl}
                                alt={sec.title}
                                className="h-20 w-32 object-cover rounded-lg border border-slate-200"
                              />
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            onClick={() => startEditSection(sec)}
                            className="p-1.5 text-teal-700 hover:bg-teal-50 rounded-lg"
                            title="Edit Section"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteSection(sec.id)}
                            className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg"
                            title="Delete Section"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>

            {/* Add New Section Form */}
            <form
              onSubmit={handleAddSection}
              className="bg-slate-100/70 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs"
            >
              <h3 className="font-bold text-slate-800 text-xs">Add New Content Section</h3>
              <div>
                <input
                  type="text"
                  required
                  placeholder="Section Title"
                  value={sectionTitle}
                  onChange={(e) => setSectionTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <textarea
                  rows={3}
                  required
                  placeholder="Section Content..."
                  value={sectionContent}
                  onChange={(e) => setSectionContent(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleSectionImageUpload(e, false)}
                  className="text-xs text-slate-500"
                />
                {uploadingSectionImg && (
                  <span className="text-teal-700 font-bold flex items-center gap-1">
                    <Loader2 className="w-3 h-3 animate-spin" /> Uploading...
                  </span>
                )}
                {sectionImageUrl && (
                  <span className="text-emerald-700 font-bold">✓ Section Image Ready</span>
                )}
              </div>
              <button
                type="submit"
                disabled={addingSection}
                className="px-4 py-2 bg-teal-700 text-white font-bold rounded-xl shadow-xs hover:bg-teal-800 flex items-center gap-1.5 cursor-pointer"
              >
                {addingSection ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
                {addingSection ? 'Adding...' : 'Add Section'}
              </button>
            </form>
          </div>
        )}

        {/* Floating Bottom Quick-Save Action */}
        <div className="sticky bottom-4 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-lg flex items-center justify-between gap-4">
          <div className="text-xs text-slate-600">
            <span className="font-bold text-slate-900">{campaign.name}</span> • All changes can be saved in one click
          </div>
          <button
            onClick={() => handleUpdateCampaign()}
            disabled={saving}
            className="px-6 py-2.5 bg-[#f5b324] hover:bg-[#e5a519] text-slate-950 font-extrabold rounded-xl shadow-xs flex items-center gap-2 text-xs transition-colors cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saving ? 'Saving...' : 'Save All Campaign Changes'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
