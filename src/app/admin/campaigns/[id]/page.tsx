'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { CampaignItem, CampaignSectionItem } from '@/types';
import { ArrowLeft, Plus, Trash2, Save, ExternalLink, Loader2, Image as ImageIcon } from 'lucide-react';

export default function AdminCampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;

  const [campaign, setCampaign] = useState<CampaignItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [ctaText, setCtaText] = useState('Book Now');
  const [isActive, setIsActive] = useState(true);

  // New Section Fields
  const [sectionTitle, setSectionTitle] = useState('');
  const [sectionContent, setSectionContent] = useState('');
  const [addingSection, setAddingSection] = useState(false);

  useEffect(() => {
    if (campaignId) loadCampaign();
  }, [campaignId]);

  const loadCampaign = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data) {
          const c = data.data as CampaignItem;
          setCampaign(c);
          setTitle(c.title);
          setSubtitle(c.subtitle || '');
          setDescription(c.description || '');
          setCtaText(c.ctaText || 'Book Now');
          setIsActive(c.isActive);
        }
      }
    } catch (err) {
      console.error('Failed to load campaign detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          subtitle: subtitle || undefined,
          description: description || undefined,
          ctaText,
          isActive,
        }),
      });
      if (res.ok) {
        await loadCampaign();
      }
    } catch (err) {
      console.error('Save campaign error:', err);
    } finally {
      setSaving(false);
    }
  };

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
        }),
      });

      if (res.ok) {
        setSectionTitle('');
        setSectionContent('');
        await loadCampaign();
      }
    } catch (err) {
      console.error('Add section failed:', err);
    } finally {
      setAddingSection(false);
    }
  };

  const handleDeleteSection = async (sectionId: string) => {
    try {
      const res = await fetch(`/api/campaigns/${campaignId}/sections?sectionId=${sectionId}`, {
        method: 'DELETE',
      });
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
          <Loader2 className="w-5 h-5 animate-spin text-brand-700" /> Loading campaign details...
        </div>
      </AdminLayout>
    );
  }

  if (!campaign) {
    return (
      <AdminLayout>
        <div className="text-center py-12 space-y-3">
          <p className="text-sm font-bold text-slate-700">Campaign not found</p>
          <Link href="/admin/campaigns" className="text-xs text-brand-700 hover:underline">
            ← Back to Campaigns list
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin/campaigns"
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block">Editing Campaign</span>
              <h1 className="text-2xl font-bold text-slate-900 font-sans">{campaign.name}</h1>
            </div>
          </div>

          <Link
            href={`/campaign/${campaign.slug}`}
            target="_blank"
            className="px-4 py-2 bg-white border border-slate-200 text-brand-700 font-bold text-xs rounded-xl hover:bg-slate-50 flex items-center gap-1.5 w-fit"
          >
            Live Preview <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Edit Campaign Main Info */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Campaign Landing Settings</h2>

          <form onSubmit={handleUpdateCampaign} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Public Hero Headline</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Subtitle / Tagline</label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-brand-700 rounded"
                />
                Campaign is Active & Accessible Publicly
              </label>

              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 bg-brand-700 text-yellow-400 font-bold rounded-xl shadow hover:bg-brand-800 flex items-center gap-1.5"
              >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>

        {/* Manage Sections */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">Campaign Content Sections</h2>
            <p className="text-xs text-slate-500">Add info sections that display on the campaign landing page.</p>
          </div>

          {/* Existing Sections */}
          <div className="space-y-4">
            {campaign.sections?.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No content sections added to this campaign yet.</p>
            ) : (
              campaign.sections?.map((sec, idx) => (
                <div key={sec.id} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex items-start justify-between gap-4">
                  <div className="space-y-1 text-xs min-w-0">
                    <span className="text-[10px] font-bold text-brand-700 bg-emerald-100 px-2 py-0.5 rounded uppercase">
                      Section {idx + 1}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{sec.title}</h4>
                    <p className="text-slate-600 whitespace-pre-wrap">{sec.content}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSection(sec.id)}
                    className="p-1.5 text-red-600 hover:bg-red-100 rounded-lg shrink-0"
                    title="Delete Section"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add New Section Form */}
          <form onSubmit={handleAddSection} className="bg-slate-100/70 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
            <h3 className="font-bold text-slate-800 text-xs">Add New Content Section</h3>
            <div>
              <input
                type="text"
                required
                placeholder="Section Title (e.g. Why Take This Monsoon Checkup)"
                value={sectionTitle}
                onChange={(e) => setSectionTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <div>
              <textarea
                rows={3}
                required
                placeholder="Section Content (detailed text explaining benefits, test inclusions, guidelines)..."
                value={sectionContent}
                onChange={(e) => setSectionContent(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900"
              />
            </div>
            <button
              type="submit"
              disabled={addingSection}
              className="px-4 py-2 bg-brand-700 text-yellow-400 font-bold rounded-xl shadow hover:bg-brand-800 flex items-center gap-1.5"
            >
              {addingSection ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              {addingSection ? 'Adding...' : 'Add Section'}
            </button>
          </form>
        </div>

      </div>
    </AdminLayout>
  );
}
