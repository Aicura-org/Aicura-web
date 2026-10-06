'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import {
  FlaskConical,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  Droplet,
  AlertCircle,
  Loader2,
  CheckCircle,
  X,
  IndianRupee,
} from 'lucide-react';

interface DiagnosticTestItem {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  originalPrice?: number | null;
  sampleType: string;
  fastingRequired: boolean;
  reportTurnaround: string;
  description?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminTestsPage() {
  const [tests, setTests] = useState<DiagnosticTestItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTest, setEditingTest] = useState<DiagnosticTestItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Form Fields
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [sampleType, setSampleType] = useState('Blood');
  const [fastingRequired, setFastingRequired] = useState(false);
  const [reportTurnaround, setReportTurnaround] = useState('6 to 12 Hours');
  const [description, setDescription] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    loadTests();
  }, []);

  const loadTests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/tests?all=true&withCategories=true');
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (Array.isArray(json.data)) {
            setTests(json.data);
            const distinct = Array.from(new Set(json.data.map((t: DiagnosticTestItem) => t.category).filter(Boolean)));
            setCategories(['All', ...distinct as string[]]);
          } else {
            setTests(json.data.tests || []);
            setCategories(json.data.categories || ['All']);
          }
        }
      }
    } catch (err) {
      console.error('Failed to load diagnostic tests:', err);
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTest(null);
    setName('');
    setCode('');
    setCategory(categories.find((c) => c !== 'All') || 'Biochemistry');
    setCustomCategory('');
    setPrice('');
    setOriginalPrice('');
    setSampleType('Blood');
    setFastingRequired(false);
    setReportTurnaround('6 to 12 Hours');
    setDescription('');
    setIsActive(true);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (t: DiagnosticTestItem) => {
    setEditingTest(t);
    setName(t.name);
    setCode(t.code);
    setCategory(t.category);
    setCustomCategory('');
    setPrice(t.price);
    setOriginalPrice(t.originalPrice ?? '');
    setSampleType(t.sampleType);
    setFastingRequired(t.fastingRequired);
    setReportTurnaround(t.reportTurnaround);
    setDescription(t.description || '');
    setIsActive(t.isActive);
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTest(null);
    setError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const finalCategory = customCategory.trim() || category;
    if (!finalCategory) {
      setError('Please specify a category');
      return;
    }

    if (price === '' || Number(price) < 0) {
      setError('Valid price is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: name.trim(),
        code: code.trim().toUpperCase(),
        category: finalCategory,
        price: Number(price),
        originalPrice: originalPrice !== '' ? Number(originalPrice) : null,
        sampleType: sampleType.trim(),
        fastingRequired,
        reportTurnaround: reportTurnaround.trim(),
        description: description.trim() || null,
        isActive,
      };

      const url = editingTest ? `/api/tests/${editingTest.id}` : '/api/tests';
      const method = editingTest ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        closeModal();
        await loadTests();
      } else {
        setError(json.message || json.error?.message || 'Failed to save diagnostic test');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      const res = await fetch(`/api/tests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });
      if (res.ok) {
        setTests((prev) =>
          prev.map((t) => (t.id === id ? { ...t, isActive: !currentStatus } : t))
        );
      }
    } catch (err) {
      console.error('Failed to toggle test status:', err);
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently delete test "${name}"?`)) return;

    try {
      const res = await fetch(`/api/tests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setTests((prev) => prev.filter((t) => t.id !== id));
      }
    } catch (err) {
      console.error('Delete test error:', err);
    }
  };

  const filteredTests = tests.filter((t) => {
    const matchesCat =
      selectedCategory === 'All' ||
      t.category.toLowerCase() === selectedCategory.toLowerCase();
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      t.name.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-sans flex items-center gap-2">
              <FlaskConical className="w-6 h-6 text-brand-700" /> Tests &amp; Services CMS
            </h1>
            <p className="text-xs text-slate-500">
              Manage individual lab tests, clinical profiles, turnaround times, and pricing.
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-5 py-2.5 gold-gradient text-brand-900 font-bold text-xs rounded-xl shadow flex items-center gap-2 w-fit hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" /> Add Test / Service
          </button>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Category Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-brand-700" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-brand-700 text-yellow-400 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search tests by name, code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
        </div>

        {/* Tests Listing Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 text-brand-700 animate-spin" />
              <p className="text-xs font-semibold">Loading diagnostic tests &amp; services...</p>
            </div>
          ) : filteredTests.length === 0 ? (
            <div className="py-16 text-center text-slate-500 text-xs space-y-2">
              <p>No diagnostic tests found matching your criteria.</p>
              <button
                onClick={openCreateModal}
                className="text-brand-700 font-bold hover:underline"
              >
                + Create new test record
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Test Name &amp; Code</th>
                    <th className="px-4 py-3.5">Category</th>
                    <th className="px-4 py-3.5">Sample / Turnaround</th>
                    <th className="px-4 py-3.5">Price</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTests.map((test) => (
                    <tr key={test.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className="font-bold text-slate-900 text-sm">{test.name}</div>
                        <div className="text-[11px] font-mono text-slate-400">Code: {test.code}</div>
                        {test.description && (
                          <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                            {test.description}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="inline-block bg-slate-100 text-slate-700 font-semibold px-2.5 py-0.5 rounded-md text-[11px]">
                          {test.category}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-600 space-y-0.5">
                        <div className="flex items-center gap-1">
                          <Droplet className="w-3 h-3 text-red-500" />
                          <span>{test.sampleType}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-slate-500">
                          <Clock className="w-3 h-3 text-brand-700" />
                          <span>{test.reportTurnaround}</span>
                        </div>
                        {test.fastingRequired && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-medium">
                            <AlertCircle className="w-3 h-3 text-amber-600" /> Fasting
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <div className="font-extrabold text-slate-900 text-sm">₹{test.price}</div>
                        {test.originalPrice && (
                          <div className="text-[10px] text-slate-400 line-through">
                            ₹{test.originalPrice}
                          </div>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <button
                          onClick={() => handleToggleActive(test.id, test.isActive)}
                          disabled={togglingId === test.id}
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors flex items-center gap-1 ${
                            test.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                          title={test.isActive ? 'Click to deactivate' : 'Click to activate'}
                        >
                          {togglingId === test.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : test.isActive ? (
                            <>
                              <Eye className="w-3 h-3" /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Inactive
                            </>
                          )}
                        </button>
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditModal(test)}
                            className="p-1.5 text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Edit test"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(test.id, test.name)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete test"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Add / Edit Test Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
            <div
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative animate-in zoom-in-95"
              role="dialog"
              aria-modal="true"
            >
              {/* Header */}
              <div className="bg-brand-800 text-white p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-yellow-400 text-brand-900 flex items-center justify-center">
                    <FlaskConical className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">
                      {editingTest ? 'Edit Diagnostic Test' : 'Add New Diagnostic Test'}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Configure test name, parameters, turnaround &amp; pricing
                    </p>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form Content */}
              <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4 text-xs flex-1">
                {error && (
                  <div className="p-3 bg-red-50 text-red-700 rounded-xl border border-red-200 font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-600" /> {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Test Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Complete Blood Count (CBC)"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Test Code *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. CBC01"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Category *</label>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        if (e.target.value !== 'NEW') setCustomCategory('');
                      }}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    >
                      {categories
                        .filter((c) => c !== 'All')
                        .map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      <option value="NEW">+ Add New Category...</option>
                    </select>

                    {category === 'NEW' && (
                      <input
                        type="text"
                        placeholder="Enter new category name..."
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="w-full mt-2 px-3 py-1.5 bg-white border border-brand-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                        autoFocus
                      />
                    )}
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Sample Type *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Whole Blood, Serum, Urine"
                      value={sampleType}
                      onChange={(e) => setSampleType(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Price (₹ Test Fee) *
                    </label>
                    <input
                      type="number"
                      required
                      min={0}
                      placeholder="e.g. 350"
                      value={price}
                      onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Original Price (₹ Strike-through optional)
                    </label>
                    <input
                      type="number"
                      min={0}
                      placeholder="e.g. 500"
                      value={originalPrice}
                      onChange={(e) =>
                        setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Report Turnaround Time *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 6 to 12 Hours, Same Day"
                      value={reportTurnaround}
                      onChange={(e) => setReportTurnaround(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                    />
                  </div>

                  <div className="flex items-center pt-5">
                    <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                      <input
                        type="checkbox"
                        checked={fastingRequired}
                        onChange={(e) => setFastingRequired(e.target.checked)}
                        className="w-4 h-4 text-brand-700 rounded"
                      />
                      Fasting Required (10-12 hrs)
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Description / Details</label>
                  <textarea
                    rows={3}
                    placeholder="Clinical overview, parameters included, clinical significance..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 text-brand-700 rounded"
                    />
                    Test is Active &amp; Published Publicly
                  </label>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-6 py-2 bg-brand-700 text-yellow-400 font-bold rounded-xl shadow hover:bg-brand-800 flex items-center gap-2"
                    >
                      {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                      {saving ? 'Saving...' : editingTest ? 'Update Test' : 'Create Test'}
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
