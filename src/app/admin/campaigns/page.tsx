'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { CampaignItem } from '@/types';
import { Plus, Megaphone, Edit, Trash2, ExternalLink, Loader2, Eye, EyeOff, Calendar } from 'lucide-react';

export default function AdminCampaignsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [ctaText, setCtaText] = useState('Claim Discount Now');
  const [heroImageUrl, setHeroImageUrl] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadCampaigns();
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !title) return;
    setSaving(true);

    try {
      const res = await fetch('/api/campaigns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          title,
          subtitle: subtitle || undefined,
          description: description || undefined,
          ctaText,
          heroImageUrl: heroImageUrl || undefined,
          isActive,
        }),
      });

      if (res.ok) {
        await loadCampaigns();
        resetForm();
      }
    } catch (err) {
      console.error('Campaign create failed:', err);
    } finally {
      setSaving(false);
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

  const resetForm = () => {
    setName('');
    setTitle('');
    setSubtitle('');
    setDescription('');
    setCtaText('Claim Discount Now');
    setHeroImageUrl('');
    setIsActive(true);
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-sans">Campaign Drives CMS</h1>
            <p className="text-xs text-slate-500">Create promotional landing pages at /campaign/[slug] to track marketing enquiries.</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-5 py-2.5 gold-gradient text-brand-900 font-bold text-xs rounded-xl shadow flex items-center gap-2 w-fit hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" /> Create New Campaign
          </button>
        </div>

        {/* Modal / Inline Form */}
        {isFormOpen && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Create Marketing Campaign</h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-800">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Campaign Internal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Monsoon Health Drive 2026"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Public Landing Headline *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stay Safe This Monsoon — 60% OFF Checkups"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  placeholder="e.g. Protect your family from vector-borne diseases"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Overview text for campaign landing page..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">CTA Button Text</label>
                  <input
                    type="text"
                    value={ctaText}
                    onChange={(e) => setCtaText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hero Image (Cloudinary)</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs text-slate-600"
                    />
                    {uploading && <span className="text-emerald-600 font-bold flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading...</span>}
                    {heroImageUrl && <span className="text-emerald-700 font-bold">✓ Ready</span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-brand-700 text-yellow-400 font-bold rounded-xl shadow hover:bg-brand-800 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Creating...' : 'Create Campaign'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Campaigns List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="col-span-2 py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-brand-700" /> Loading campaign drives...
            </div>
          ) : campaigns.length === 0 ? (
            <div className="col-span-2 bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
              No marketing campaigns created yet. Click "Create New Campaign" above to get started.
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
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {c.isActive ? '● Active' : 'Inactive'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900">{c.title}</h3>
                  {c.subtitle && <p className="text-xs text-slate-500">{c.subtitle}</p>}

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs space-y-1 font-mono text-slate-600">
                    <div>Slug: <strong className="text-brand-700">/campaign/{c.slug}</strong></div>
                    <div>Sections: <strong>{c.sections?.length || 0} content blocks</strong></div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
                  <Link
                    href={`/campaign/${c.slug}`}
                    target="_blank"
                    className="text-brand-700 font-bold hover:underline flex items-center gap-1"
                  >
                    Preview Page <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/campaigns/${c.id}`}
                      className="px-3 py-1.5 bg-brand-700 text-yellow-400 font-bold rounded-lg hover:bg-brand-800 flex items-center gap-1"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Sections
                    </Link>
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white"
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
