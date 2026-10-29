'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { TestimonialItem } from '@/types';
import {
  Quote,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MapPin,
  Loader2,
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'HIDDEN'>('ALL');

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [patientName, setPatientName] = useState('');
  const [location, setLocation] = useState('');
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isFeatured, setIsFeatured] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadTestimonials();
  }, []);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 4000);
  };

  const loadTestimonials = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/testimonials?all=true', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setTestimonials(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load patient reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setPatientName('');
    setLocation('');
    setComment('');
    setRating(5);
    setAvatarUrl('');
    setIsFeatured(true);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (item: TestimonialItem) => {
    setEditingItem(item);
    setPatientName(item.patientName);
    setLocation(item.location);
    setComment(item.comment);
    setRating(item.rating || 5);
    setAvatarUrl(item.avatarUrl || '');
    setIsFeatured(item.isFeatured);
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setError('');
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'general');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success && json.data?.url) {
        setAvatarUrl(json.data.url);
      } else {
        setError(json.message || 'Failed to upload avatar image');
      }
    } catch (err: any) {
      setError(err?.message || 'Error uploading image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!patientName.trim() || !location.trim() || !comment.trim()) {
      setError('Patient name, location, and review comment are required.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        patientName: patientName.trim(),
        location: location.trim(),
        comment: comment.trim(),
        rating: Number(rating) || 5,
        avatarUrl: avatarUrl.trim() || null,
        isFeatured,
      };

      const url = editingItem ? `/api/testimonials/${editingItem.id}` : '/api/testimonials';
      const method = editingItem ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        closeModal();
        await loadTestimonials();
        showNotice(
          'success',
          editingItem
            ? 'Patient review updated successfully!'
            : 'New patient review added successfully!'
        );
      } else {
        setError(json.message || 'Failed to save patient review');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleFeatured = async (item: TestimonialItem) => {
    setTogglingId(item.id);
    try {
      const res = await fetch(`/api/testimonials/${item.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggleFeatured' }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setTestimonials((prev) =>
            prev.map((t) => (t.id === item.id ? json.data : t))
          );
          showNotice(
            'success',
            json.data.isFeatured
              ? `Review by ${item.patientName} is now published on the homepage.`
              : `Review by ${item.patientName} is now hidden from the homepage.`
          );
        }
      }
    } catch (err) {
      console.error('Failed to toggle review status:', err);
      showNotice('error', 'Failed to update review visibility');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (item: TestimonialItem) => {
    if (!confirm(`Are you sure you want to delete the patient review from "${item.patientName}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/testimonials/${item.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setTestimonials((prev) => prev.filter((t) => t.id !== item.id));
        showNotice('success', `Deleted patient review from ${item.patientName}`);
      } else {
        showNotice('error', 'Failed to delete patient review');
      }
    } catch (err) {
      console.error('Delete patient review error:', err);
      showNotice('error', 'Failed to delete patient review');
    }
  };

  const filteredTestimonials = testimonials.filter((t) => {
    if (statusFilter === 'PUBLISHED' && !t.isFeatured) return false;
    if (statusFilter === 'HIDDEN' && t.isFeatured) return false;

    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      t.patientName.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.comment.toLowerCase().includes(q)
    );
  });

  const publishedCount = testimonials.filter((t) => t.isFeatured).length;
  const hiddenCount = testimonials.length - publishedCount;
  const avgRating =
    testimonials.length > 0
      ? (testimonials.reduce((acc, t) => acc + (t.rating || 5), 0) / testimonials.length).toFixed(1)
      : '0.0';

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <Quote className="w-3.5 h-3.5" /> Patient Reviews CMS
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-sans">
              Trusted By Our Patients
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Real experiences. Real trust. Manage patient reviews and testimonials shown on the website.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/#patient-reviews"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Live Section
            </a>

            <button
              type="button"
              onClick={openCreateModal}
              className="px-5 py-2.5 gold-gradient text-brand-900 font-bold text-xs rounded-xl shadow flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Patient Review
            </button>
          </div>
        </div>

        {/* Toast Notice */}
        {notice && (
          <div
            className={`p-4 rounded-2xl flex items-center justify-between gap-3 text-xs font-semibold shadow-sm ${
              notice.type === 'success'
                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                : 'bg-red-50 text-red-900 border border-red-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {notice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span>{notice.message}</span>
            </div>
            <button onClick={() => setNotice(null)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Reviews</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{testimonials.length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Published on Site</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{publishedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Hidden Reviews</span>
            <p className="text-2xl font-extrabold text-slate-600 mt-1">{hiddenCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-amber-600 uppercase">Average Rating</span>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="text-2xl font-extrabold text-slate-900">{avgRating}</span>
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-brand-700" /> Status:
            </span>
            {(
              [
                { key: 'ALL', label: `All (${testimonials.length})` },
                { key: 'PUBLISHED', label: `Published (${publishedCount})` },
                { key: 'HIDDEN', label: `Hidden (${hiddenCount})` },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  statusFilter === tab.key
                    ? 'bg-brand-700 text-yellow-400 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by patient name, city, or review..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
        </div>

        {/* Reviews Cards Grid */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-brand-700 animate-spin" />
            <p className="text-xs font-semibold">Loading patient reviews from database...</p>
          </div>
        ) : filteredTestimonials.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Quote className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No patient reviews found</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Add a new patient review to display in the &ldquo;Trusted By Our Patients&rdquo; section.
            </p>
            <div className="flex items-center justify-center pt-2">
              <button
                type="button"
                onClick={openCreateModal}
                className="px-4 py-2 bg-brand-700 text-yellow-400 font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                + Add Patient Review
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredTestimonials.map((item) => (
              <div
                key={item.id}
                className={`bg-white p-6 rounded-2xl border shadow-sm transition-all flex flex-col justify-between relative group ${
                  item.isFeatured
                    ? 'border-slate-200/90 hover:shadow-md'
                    : 'border-dashed border-slate-300 bg-slate-50/60 opacity-80'
                }`}
              >
                <Quote className="w-8 h-8 text-emerald-200/60 absolute top-4 right-4 pointer-events-none" />

                <div className="space-y-3.5">
                  {/* Top Row: Stars & Visibility Badge */}
                  <div className="flex items-center justify-between gap-2 pr-8">
                    <div className="flex items-center gap-1 text-yellow-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${
                            i < (item.rating || 5)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-200 fill-slate-200'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(item)}
                      disabled={togglingId === item.id}
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        item.isFeatured
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                      }`}
                      title={item.isFeatured ? 'Click to hide from homepage' : 'Click to publish on homepage'}
                    >
                      {togglingId === item.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : item.isFeatured ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                      {item.isFeatured ? 'Published' : 'Hidden'}
                    </button>
                  </div>

                  {/* Comment */}
                  <p className="text-slate-700 text-sm italic leading-relaxed">
                    &ldquo;{item.comment}&rdquo;
                  </p>
                </div>

                {/* Footer: Patient Info & Actions */}
                <div className="flex items-center justify-between gap-3 pt-5 border-t border-slate-100 mt-5">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden bg-brand-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {item.avatarUrl ? (
                        <Image
                          src={item.avatarUrl}
                          alt={item.patientName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        item.patientName.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {item.patientName}
                      </h3>
                      <span className="text-xs text-slate-500 flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-brand-700 shrink-0" />
                        {item.location}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => openEditModal(item)}
                      className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-brand-700 hover:text-white transition-colors cursor-pointer"
                      title="Edit Review"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add / Edit Patient Review Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
            <div
              className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative animate-in zoom-in-95"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Header */}
              <div className="bg-brand-800 text-white p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-yellow-400 text-brand-900 flex items-center justify-center">
                    <Quote className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">
                      {editingItem ? 'Edit Patient Review' : 'Add New Patient Review'}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Displayed in the &ldquo;Trusted By Our Patients&rdquo; homepage section
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" /> {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Patient Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter patient name"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Location / City *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Enter city / location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>
                </div>

                {/* Star Rating Selector */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">
                    Star Rating ({rating} / 5)
                  </label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className={`p-2 rounded-xl border transition-all flex items-center gap-1 cursor-pointer ${
                          rating >= star
                            ? 'bg-yellow-50 border-yellow-300 text-yellow-500'
                            : 'bg-slate-50 border-slate-200 text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        <Star
                          className={`w-5 h-5 ${
                            rating >= star ? 'fill-yellow-400 text-yellow-400' : 'text-slate-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Comment */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Patient Review / Feedback *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Share the patient's experience with AiCura Diagnostics..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>

                {/* Optional Avatar Upload or URL */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">
                    Patient Photo / Avatar (Optional)
                  </label>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-brand-700 text-white flex items-center justify-center font-bold text-base shrink-0 border border-slate-200">
                      {avatarUrl ? (
                        <Image
                          src={avatarUrl}
                          alt={patientName || 'Patient'}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        (patientName ? patientName.charAt(0) : 'P').toUpperCase()
                      )}
                    </div>

                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        placeholder="Paste image URL or upload photo below (leave empty for initial badge)"
                        value={avatarUrl}
                        onChange={(e) => setAvatarUrl(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                      <div className="flex items-center gap-2">
                        <label className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                          {uploading ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-700" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-brand-700" />
                          )}
                          <span>{uploading ? 'Uploading...' : 'Upload Photo'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleAvatarUpload}
                            className="hidden"
                          />
                        </label>
                        {avatarUrl && (
                          <button
                            type="button"
                            onClick={() => setAvatarUrl('')}
                            className="px-2.5 py-1.5 text-red-600 hover:bg-red-50 rounded-lg font-semibold cursor-pointer"
                          >
                            Remove Photo
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Published Toggle & Submit */}
                <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="w-4 h-4 text-brand-700 rounded"
                    />
                    Publish on Website
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-brand-700 text-yellow-400 font-bold rounded-xl shadow hover:bg-brand-800 flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                      {saving
                        ? 'Saving...'
                        : editingItem
                        ? 'Update Review'
                        : 'Save Review'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
