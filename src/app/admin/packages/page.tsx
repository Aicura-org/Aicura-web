'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { PackageItem } from '@/types';
import { Plus, Trash2, Edit, X, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function AdminPackagesPage() {
  const [packages, setPackages] = useState<PackageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Form State
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Full Body Checkup');
  const [testCount, setTestCount] = useState(50);
  const [originalPrice, setOriginalPrice] = useState(3000);
  const [discountedPrice, setDiscountedPrice] = useState(1999);
  const [description, setDescription] = useState('');
  const [includedTestsText, setIncludedTestsText] = useState('');
  const [benefitsText, setBenefitsText] = useState('');
  const [preparation, setPreparation] = useState('');
  const [badgeText, setBadgeText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [isPublished, setIsPublished] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPackages();
  }, []);

  const loadPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/packages');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setPackages(data.data);
        }
      }
    } catch (err) {
      console.error('Failed to load packages:', err);
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
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setImageUrl(data.data.url);
      }
    } catch (err) {
      console.error('Image upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    setSaving(true);

    const includedTests = includedTestsText
      .split('\n')
      .map((t) => t.trim())
      .filter(Boolean);

    const benefits = benefitsText
      .split('\n')
      .map((b) => b.trim())
      .filter(Boolean);

    const payload = {
      title,
      category,
      testCount: Number(testCount) || includedTests.length || 1,
      originalPrice: Number(originalPrice),
      discountedPrice: Number(discountedPrice),
      description,
      includedTests,
      benefits,
      preparation: preparation || undefined,
      imageUrl: imageUrl || undefined,
      badgeText: badgeText || undefined,
      isPopular,
      isPublished,
    };

    try {
      const url = editingId ? `/api/packages/${editingId}` : '/api/packages';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        await loadPackages();
        resetForm();
      }
    } catch (err) {
      console.error('Package save failed:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (pkg: PackageItem) => {
    try {
      const res = await fetch(`/api/packages/${pkg.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'togglePublish' }),
      });
      if (res.ok) {
        await loadPackages();
      }
    } catch (err) {
      console.error('Toggle publish failed:', err);
    }
  };

  const handleEdit = (pkg: PackageItem) => {
    setEditingId(pkg.id);
    setTitle(pkg.title);
    setCategory(pkg.category);
    setTestCount(pkg.testCount);
    setOriginalPrice(pkg.originalPrice);
    setDiscountedPrice(pkg.discountedPrice);
    setDescription(pkg.description);
    setIncludedTestsText(pkg.includedTests.join('\n'));
    setBenefitsText(pkg.benefits ? pkg.benefits.join('\n') : '');
    setPreparation(pkg.preparation || '');
    setBadgeText(pkg.badgeText || '');
    setImageUrl(pkg.imageUrl || '');
    setIsPopular(pkg.isPopular);
    setIsPublished(pkg.isPublished);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this health package?')) {
      try {
        await fetch(`/api/packages/${id}`, { method: 'DELETE' });
        await loadPackages();
      } catch (err) {
        console.error('Delete failed:', err);
      }
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setCategory('Full Body Checkup');
    setTestCount(50);
    setOriginalPrice(3000);
    setDiscountedPrice(1999);
    setDescription('');
    setIncludedTestsText('');
    setBenefitsText('');
    setPreparation('');
    setBadgeText('');
    setImageUrl('');
    setIsPopular(false);
    setIsPublished(true);
    setIsFormOpen(false);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-sans">Health Packages CMS</h1>
            <p className="text-xs text-slate-500">Create, edit, and publish health checkup packages powered by PostgreSQL & Prisma.</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsFormOpen(true);
            }}
            className="px-5 py-2.5 gold-gradient text-brand-900 font-bold text-xs rounded-xl shadow flex items-center gap-2 w-fit hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" /> Add New Package
          </button>
        </div>

        {/* Add/Edit Modal Form */}
        {isFormOpen && (
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">
                {editingId ? 'Edit Health Package' : 'Add New Health Package'}
              </h2>
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Package Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Master Executive Checkup"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  >
                    <option value="Full Body Checkup">Full Body Checkup</option>
                    <option value="Senior Care">Senior Care</option>
                    <option value="Women Care">Women Care</option>
                    <option value="Specialized Care">Specialized Care</option>
                    <option value="Vitamins & Hormones">Vitamins & Hormones</option>
                    <option value="Cardiac Care">Cardiac Care</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Total Tests</label>
                  <input
                    type="number"
                    value={testCount}
                    onChange={(e) => setTestCount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Offer Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={discountedPrice}
                    onChange={(e) => setDiscountedPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short summary of what this health package covers..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Included Tests (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="Complete Blood Count (CBC)&#10;Lipid Profile Complete&#10;Liver Function Test"
                    value={includedTestsText}
                    onChange={(e) => setIncludedTestsText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Benefits (One per line)</label>
                  <textarea
                    rows={4}
                    placeholder="Free Home Sample Collection&#10;Reports within 24 Hours&#10;Free Doctor Consultation"
                    value={benefitsText}
                    onChange={(e) => setBenefitsText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preparation Instructions</label>
                  <input
                    type="text"
                    placeholder="e.g. Fasting required for 10-12 hours prior to collection"
                    value={preparation}
                    onChange={(e) => setPreparation(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Badge Text (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. BEST SELLER (60% OFF)"
                    value={badgeText}
                    onChange={(e) => setBadgeText(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              {/* Toggles & Image */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Cloudinary Package Image</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xs text-slate-600"
                    />
                    {uploading && <span className="text-emerald-600 font-bold flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> Uploading...</span>}
                    {imageUrl && <span className="text-emerald-700 font-bold">✓ Uploaded</span>}
                  </div>
                </div>

                <div className="flex items-center gap-6 pt-4">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isPopular}
                      onChange={(e) => setIsPopular(e.target.checked)}
                      className="w-4 h-4 text-brand-700 rounded"
                    />
                    Mark as Popular / Featured
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 text-brand-700 rounded"
                    />
                    Published on Site
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 bg-brand-700 text-yellow-400 font-bold rounded-xl shadow hover:bg-brand-800 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {saving ? 'Saving...' : 'Save Package'}
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

        {/* Packages Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-brand-700" /> Loading packages from database...
            </div>
          ) : packages.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs">No health packages found in database.</div>
          ) : (
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="p-4">Package</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Tests</th>
                  <th className="p-4">Offer Price</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {packages.map((pkg) => (
                  <tr key={pkg.id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <div className="font-bold text-slate-900">{pkg.title}</div>
                      {pkg.isPopular && (
                        <span className="text-[10px] text-amber-600 font-semibold">★ Popular</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold">
                        {pkg.category}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{pkg.testCount} Tests</td>
                    <td className="p-4">
                      <span className="font-extrabold text-brand-700">₹{pkg.discountedPrice}</span>
                      <span className="text-slate-400 line-through ml-1 text-[11px]">₹{pkg.originalPrice}</span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => handleTogglePublish(pkg)}
                        className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          pkg.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {pkg.isPublished ? <Eye className="w-3 h-3"/> : <EyeOff className="w-3 h-3"/>}
                        {pkg.isPublished ? 'Published' : 'Hidden'}
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-brand-700 hover:text-white transition-colors"
                        title="Edit Package"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(pkg.id)}
                        className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors"
                        title="Delete Package"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
