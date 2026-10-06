'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import Image from 'next/image';
import {
  Upload,
  Trash2,
  Loader2,
  CheckCircle,
  AlertTriangle,
  ImageIcon,
  Plus,
  X,
  Edit3,
  Save,
  GalleryHorizontal,
  Tag,
  AlignLeft,
  ArrowUpDown,
  Eye,
  EyeOff,
  RefreshCw,
} from 'lucide-react';

interface GalleryImage {
  id: string;
  imageUrl: string;
  publicId: string | null;
  title: string | null;
  description: string | null;
  category: string;
  altText: string | null;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

const CATEGORIES = ['general', 'lab', 'team', 'equipment', 'facility', 'events', 'certificates'];

type Toast = { type: 'success' | 'error'; message: string } | null;

function ToastNotification({ toast, onClose }: { toast: Toast; onClose: () => void }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div
      className={`fixed top-6 right-6 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all animate-fadeIn ${
        toast.type === 'success'
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-red-50 border-red-200 text-red-800'
      }`}
    >
      {toast.type === 'success' ? (
        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
      ) : (
        <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
      )}
      <span>{toast.message}</span>
      <button onClick={onClose} className="ml-2 opacity-60 hover:opacity-100">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

interface EditModalProps {
  image: GalleryImage;
  onClose: () => void;
  onSave: (updated: Partial<GalleryImage>) => Promise<void>;
}

function EditModal({ image, onClose, onSave }: EditModalProps) {
  const [form, setForm] = useState({
    title: image.title || '',
    description: image.description || '',
    altText: image.altText || '',
    category: image.category,
    displayOrder: image.displayOrder,
    isActive: image.isActive,
  });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave({ id: image.id, ...form });
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center">
              <Edit3 className="w-5 h-5 text-indigo-600" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Edit Image Details</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Preview */}
        <div className="px-6 pt-4">
          <div className="relative w-full h-40 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
            <Image src={image.imageUrl} alt={image.altText || 'gallery'} fill className="object-cover" />
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Lab Equipment 2024"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Short description (optional)"
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Display Order</label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) => setForm({ ...form, displayOrder: Number(e.target.value) })}
                min={0}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">Alt Text (Accessibility)</label>
              <input
                type="text"
                value={form.altText}
                onChange={(e) => setForm({ ...form, altText: e.target.value })}
                placeholder="Describe the image for screen readers"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
              />
            </div>
            <div className="col-span-2 flex items-center gap-3">
              <button
                onClick={() => setForm({ ...form, isActive: !form.isActive })}
                className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                />
              </button>
              <span className="text-sm font-medium text-slate-700">
                {form.isActive ? 'Visible on site' : 'Hidden from site'}
              </span>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-60"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GalleryAdminPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editImage, setEditImage] = useState<GalleryImage | null>(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [dragActive, setDragActive] = useState(false);

  // Upload form state
  const [uploadCategory, setUploadCategory] = useState('general');
  const [uploadTitle, setUploadTitle] = useState('');
  const [previewFiles, setPreviewFiles] = useState<{ file: File; preview: string }[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showToast = (type: 'success' | 'error', message: string) => setToast({ type, message });

  const fetchImages = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/gallery');
      const json = await res.json();
      if (json.success) setImages(json.data || []);
    } catch {
      showToast('error', 'Failed to load gallery images');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const newPreviews = Array.from(files).map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setPreviewFiles((prev) => [...prev, ...newPreviews]);
  };

  const removePreview = (index: number) => {
    setPreviewFiles((prev) => {
      URL.revokeObjectURL(prev[index].preview);
      return prev.filter((_, i) => i !== index);
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleUpload = async () => {
    if (previewFiles.length === 0) return;
    setUploading(true);

    let successCount = 0;
    let errorCount = 0;

    for (const { file } of previewFiles) {
      try {
        // Step 1: Upload to Cloudinary via the existing upload API
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', 'general');

        const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
        const uploadJson = await uploadRes.json();

        if (!uploadJson.success || !uploadJson.data?.url) {
          throw new Error(uploadJson.message || 'Upload to Cloudinary failed');
        }

        // Step 2: Save to gallery DB
        const saveRes = await fetch('/api/gallery', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: uploadJson.data.url,
            publicId: uploadJson.data.public_id,
            title: uploadTitle || null,
            category: uploadCategory,
            displayOrder: 0,
          }),
        });
        const saveJson = await saveRes.json();
        if (!saveJson.success) throw new Error(saveJson.message || 'Failed to save image to database');

        successCount++;
      } catch (err: any) {
        console.error('Upload error:', err);
        errorCount++;
      }
    }

    // Cleanup previews
    previewFiles.forEach(({ preview }) => URL.revokeObjectURL(preview));
    setPreviewFiles([]);
    setUploadTitle('');

    if (successCount > 0) {
      showToast('success', `${successCount} image${successCount > 1 ? 's' : ''} uploaded successfully!`);
      fetchImages();
    }
    if (errorCount > 0) {
      showToast('error', `${errorCount} image${errorCount > 1 ? 's' : ''} failed to upload.`);
    }

    setUploading(false);
  };

  const handleDelete = async (img: GalleryImage) => {
    if (!confirm(`Delete "${img.title || 'this image'}"? This cannot be undone.`)) return;
    setDeletingId(img.id);
    try {
      const res = await fetch(`/api/gallery?id=${img.id}`, { method: 'DELETE' });
      const json = await res.json();
      if (json.success) {
        setImages((prev) => prev.filter((i) => i.id !== img.id));
        showToast('success', 'Image deleted successfully');
      } else {
        showToast('error', json.message || 'Delete failed');
      }
    } catch {
      showToast('error', 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggleVisibility = async (img: GalleryImage) => {
    try {
      const res = await fetch('/api/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: img.id, isActive: !img.isActive }),
      });
      const json = await res.json();
      if (json.success) {
        setImages((prev) => prev.map((i) => (i.id === img.id ? { ...i, isActive: !i.isActive } : i)));
        showToast('success', `Image ${!img.isActive ? 'shown' : 'hidden'} successfully`);
      }
    } catch {
      showToast('error', 'Failed to update visibility');
    }
  };

  const handleEditSave = async (updated: Partial<GalleryImage>) => {
    try {
      const res = await fetch('/api/gallery', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const json = await res.json();
      if (json.success) {
        setImages((prev) => prev.map((i) => (i.id === updated.id ? { ...i, ...json.data } : i)));
        showToast('success', 'Image details updated');
      } else {
        showToast('error', json.message || 'Update failed');
      }
    } catch {
      showToast('error', 'Update failed');
    }
  };

  const filteredImages =
    filterCategory === 'all' ? images : images.filter((img) => img.category === filterCategory);

  const categoryBadgeColor = (cat: string) => {
    const colors: Record<string, string> = {
      general: 'bg-slate-100 text-slate-700',
      lab: 'bg-blue-100 text-blue-700',
      team: 'bg-purple-100 text-purple-700',
      equipment: 'bg-orange-100 text-orange-700',
      facility: 'bg-teal-100 text-teal-700',
      events: 'bg-pink-100 text-pink-700',
      certificates: 'bg-yellow-100 text-yellow-800',
    };
    return colors[cat] || 'bg-slate-100 text-slate-700';
  };

  return (
    <AdminLayout>
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.25s ease; }
      `}</style>

      <ToastNotification toast={toast} onClose={() => setToast(null)} />
      {editImage && (
        <EditModal image={editImage} onClose={() => setEditImage(null)} onSave={handleEditSave} />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
              <GalleryHorizontal className="w-5 h-5 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">Gallery Manager</h1>
          </div>
          <p className="text-sm text-slate-500 ml-12">
            Upload and manage photo gallery images displayed on the website.
          </p>
        </div>
        <button
          onClick={fetchImages}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm mb-8 overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <Plus className="w-4 h-4 text-emerald-600" />
            </div>
            <h2 className="text-base font-bold text-slate-900">Add Images</h2>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Upload meta */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <Tag className="inline w-3.5 h-3.5 mr-1" /> Category
              </label>
              <select
                value={uploadCategory}
                onChange={(e) => setUploadCategory(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                <AlignLeft className="inline w-3.5 h-3.5 mr-1" /> Title (optional)
              </label>
              <input
                type="text"
                value={uploadTitle}
                onChange={(e) => setUploadTitle(e.target.value)}
                placeholder="e.g. Lab Tour 2024"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-slate-50"
              />
            </div>
          </div>

          {/* Drop zone */}
          <div
            onDragEnter={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative flex flex-col items-center justify-center gap-3 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
              dragActive
                ? 'border-indigo-400 bg-indigo-50'
                : 'border-slate-200 bg-slate-50 hover:border-indigo-300 hover:bg-indigo-50/30'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-indigo-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-slate-800">Drag & drop images here</p>
              <p className="text-xs text-slate-500 mt-1">or click to browse — PNG, JPG, WebP supported</p>
            </div>
            {dragActive && (
              <div className="absolute inset-0 rounded-2xl bg-indigo-100/60 flex items-center justify-center pointer-events-none">
                <p className="text-indigo-700 font-bold">Drop to add images</p>
              </div>
            )}
          </div>

          {/* Preview selected files */}
          {previewFiles.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-3">
                {previewFiles.length} image{previewFiles.length > 1 ? 's' : ''} selected
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                {previewFiles.map((item, i) => (
                  <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <Image src={item.preview} alt="preview" fill className="object-cover" />
                    <button
                      onClick={(e) => { e.stopPropagation(); removePreview(i); }}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload button */}
          <div className="flex justify-end">
            <button
              onClick={handleUpload}
              disabled={previewFiles.length === 0 || uploading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Upload {previewFiles.length > 0 ? `${previewFiles.length} ` : ''}Image{previewFiles.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header + Filter */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
              <ImageIcon className="w-4 h-4 text-slate-600" />
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Gallery Images
              <span className="ml-2 text-xs font-normal text-slate-400">
                ({filteredImages.length} of {images.length})
              </span>
            </h2>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {['all', ...CATEGORIES].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                  filterCategory === cat
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm">Loading gallery...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center">
                <ImageIcon className="w-8 h-8 text-slate-300" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">No images yet</p>
                <p className="text-xs text-slate-400 mt-1">Upload images using the section above</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              {filteredImages.map((img) => (
                <div
                  key={img.id}
                  className={`group relative rounded-2xl overflow-hidden border bg-slate-100 transition-all hover:shadow-lg ${
                    img.isActive ? 'border-slate-200' : 'border-dashed border-slate-300 opacity-60'
                  }`}
                >
                  {/* Image */}
                  <div className="relative aspect-square">
                    <Image
                      src={img.imageUrl}
                      alt={img.altText || img.title || 'Gallery image'}
                      fill
                      className="object-cover"
                    />
                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <button
                        onClick={() => setEditImage(img)}
                        className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                        title="Edit details"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleToggleVisibility(img)}
                        className="w-8 h-8 rounded-lg bg-white/90 hover:bg-white text-slate-800 flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                        title={img.isActive ? 'Hide image' : 'Show image'}
                      >
                        {img.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => handleDelete(img)}
                        disabled={deletingId === img.id}
                        className="w-8 h-8 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-sm transition-transform hover:scale-110 disabled:opacity-70"
                        title="Delete image"
                      >
                        {deletingId === img.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-2.5">
                    {img.title && (
                      <p className="text-xs font-semibold text-slate-800 truncate mb-1">{img.title}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${categoryBadgeColor(img.category)}`}>
                        {img.category}
                      </span>
                      <div className="flex items-center gap-1 text-[10px] text-slate-400">
                        <ArrowUpDown className="w-2.5 h-2.5" />
                        {img.displayOrder}
                      </div>
                    </div>
                    {!img.isActive && (
                      <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                        <EyeOff className="w-2.5 h-2.5" /> Hidden
                      </p>
                    )}
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
