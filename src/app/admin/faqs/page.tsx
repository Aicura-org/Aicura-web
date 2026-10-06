'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { CampaignItem } from '@/types';
import {
  parseCampaignContent,
  serializeCampaignContent,
  CampaignFaqItem,
} from '@/lib/campaign-helper';
import {
  HelpCircle,
  Plus,
  Trash2,
  Save,
  Loader2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';

export default function AdminFaqsPage() {
  const [campaigns, setCampaigns] = useState<CampaignItem[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('');
  const [currentCampaign, setCurrentCampaign] = useState<CampaignItem | null>(null);
  const [faqs, setFaqs] = useState<CampaignFaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New FAQ input state
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          setCampaigns(json.data);
          // Prefer senior-care-special or the first campaign
          const senior = json.data.find((c: CampaignItem) => c.slug.includes('senior'));
          const chosen = senior || json.data[0];
          setSelectedCampaignId(chosen.id);
          selectCampaign(chosen);
        }
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectCampaign = (c: CampaignItem) => {
    setCurrentCampaign(c);
    setSelectedCampaignId(c.id);
    const parsed = parseCampaignContent(c);
    setFaqs(parsed.faqs || []);
  };

  const handleCampaignChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value;
    setSelectedCampaignId(id);
    const found = campaigns.find((c) => c.id === id);
    if (found) {
      selectCampaign(found);
    }
  };

  const updateFaq = (idx: number, field: 'question' | 'answer', val: string) => {
    setFaqs((prev) => {
      const copy = [...prev];
      copy[idx] = { ...copy[idx], [field]: val };
      return copy;
    });
    setSavedSuccess(false);
  };

  const removeFaq = (idx: number) => {
    setFaqs((prev) => prev.filter((_, i) => i !== idx));
    setSavedSuccess(false);
  };

  const moveFaq = (idx: number, direction: 'up' | 'down') => {
    setFaqs((prev) => {
      const copy = [...prev];
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= copy.length) return prev;
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
    setSavedSuccess(false);
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion.trim() || !newAnswer.trim()) return;

    setFaqs((prev) => [
      ...prev,
      { question: newQuestion.trim(), answer: newAnswer.trim() },
    ]);
    setNewQuestion('');
    setNewAnswer('');
    setSavedSuccess(false);
  };

  const handleSave = async () => {
    if (!currentCampaign) return;
    setSaving(true);
    setSavedSuccess(false);

    try {
      const parsed = parseCampaignContent(currentCampaign);
      const updatedDescription = serializeCampaignContent({
        ...parsed,
        faqs,
      });

      const res = await fetch(`/api/campaigns/${currentCampaign.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description: updatedDescription,
        }),
      });

      if (res.ok) {
        setSavedSuccess(true);
        // Refresh campaign in local state
        const updatedCamp = { ...currentCampaign, description: updatedDescription };
        setCurrentCampaign(updatedCamp);
        setCampaigns((prev) =>
          prev.map((c) => (c.id === updatedCamp.id ? updatedCamp : c))
        );
      } else {
        alert('Failed to save FAQs. Please check network.');
      }
    } catch (err) {
      console.error('Error saving FAQs:', err);
      alert('Error saving FAQs.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-5xl mx-auto pb-16">
        
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center text-teal-800 shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block font-semibold">
                Content Management
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
                Campaign FAQs CMS
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentCampaign && (
              <Link
                href={`/campaign/${currentCampaign.slug}#faqs`}
                target="_blank"
                className="px-3.5 py-2 bg-slate-50 border border-slate-200 text-teal-700 font-bold text-xs rounded-xl hover:bg-slate-100 flex items-center gap-1.5"
              >
                <span>View on Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              onClick={handleSave}
              disabled={saving || !currentCampaign}
              className="px-5 py-2 bg-[#f5b324] hover:bg-[#e5a519] active:bg-[#d49610] text-slate-950 font-extrabold rounded-xl shadow-xs flex items-center gap-1.5 text-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              <span>{saving ? 'Saving...' : 'Save All FAQs'}</span>
            </button>
          </div>
        </div>

        {/* Campaign Selector Banner */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-800 block">Select Campaign to Manage FAQs:</label>
            <p className="text-slate-500 text-[11px]">
              FAQs are displayed dynamically in 2-column accordions on the chosen landing page.
            </p>
          </div>

          <div className="w-full sm:w-72">
            <select
              value={selectedCampaignId}
              onChange={handleCampaignChange}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:bg-white"
            >
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.slug})
                </option>
              ))}
            </select>
          </div>
        </div>

        {savedSuccess && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl flex items-center gap-2.5 text-xs font-bold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>FAQs successfully updated and published to the live campaign page!</span>
          </div>
        )}

        {/* Add New FAQ Form */}
        <div className="bg-white p-6 rounded-2xl border border-teal-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              +
            </div>
            <h2 className="text-sm font-bold text-slate-900">Add New FAQ Question</h2>
          </div>

          <form onSubmit={handleAddFaq} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Question *</label>
              <input
                type="text"
                required
                placeholder="e.g. Is home sample collection available?"
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Answer *</label>
              <textarea
                required
                rows={3}
                placeholder="e.g. Yes, our certified phlebotomists collect blood and urine samples directly from your doorstep..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-700"
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-teal-800 hover:bg-teal-900 text-white font-bold rounded-xl flex items-center gap-2 cursor-pointer shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add Question to List</span>
            </button>
          </form>
        </div>

        {/* Existing FAQs List */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Active FAQ Questions ({faqs.length})
              </h2>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Edit question and answer inline. Click Save All FAQs when done.
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 bg-[#f5b324] hover:bg-[#e5a519] text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>

          {loading ? (
            <div className="py-12 flex justify-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : faqs.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">
              No FAQs added yet. Use the form above to add your first question.
            </div>
          ) : (
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-xl border border-slate-200/90 space-y-2.5 text-xs hover:border-slate-300 transition-colors"
                >
                  {/* Question header row */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1">
                      <span className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-500 flex items-center justify-center font-bold text-[11px] shrink-0">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={faq.question}
                        onChange={(e) => updateFaq(idx, 'question', e.target.value)}
                        placeholder="Question title"
                        className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-slate-900 font-bold text-xs focus:ring-1 focus:ring-teal-700"
                      />
                    </div>

                    {/* Actions: Move Up, Move Down, Delete */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => moveFaq(idx, 'up')}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === faqs.length - 1}
                        onClick={() => moveFaq(idx, 'down')}
                        className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-20 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFaq(idx)}
                        className="p-1.5 text-red-400 hover:text-red-700 cursor-pointer ml-1"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Answer textarea */}
                  <div>
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => updateFaq(idx, 'answer', e.target.value)}
                      placeholder="Answer content..."
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 leading-relaxed text-xs focus:ring-1 focus:ring-teal-700"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
