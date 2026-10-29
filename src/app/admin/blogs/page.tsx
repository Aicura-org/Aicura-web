'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import AdminLayout from '@/components/admin/AdminLayout';
import { BlogItem } from '@/types';
import { htmlToPlainText, plainTextToHtml } from '@/lib/blog-content';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Clock,
  User,
  Calendar,
  Loader2,
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
} from 'lucide-react';

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PUBLISHED' | 'DRAFT'>('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Modal & Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogItem | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [coverImagePublicId, setCoverImagePublicId] = useState<string | null>(null);
  const [readTime, setReadTime] = useState('5 min read');
  const [author, setAuthor] = useState('AiCura Medical Team');
  const [isPublished, setIsPublished] = useState(true);

  const [uploading, setUploading] = useState(false);
  const [clearingImage, setClearingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    loadBlogs();
  }, []);

  const showNotice = (type: 'success' | 'error', message: string) => {
    setNotice({ type, message });
    setTimeout(() => setNotice(null), 4000);
  };

  const loadBlogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blogs?all=true', { cache: 'no-store' });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setBlogs(json.data);
        }
      }
    } catch (err) {
      console.error('Failed to load blogs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = (blogSlug: string, id: string) => {
    const fullUrl = `${window.location.origin}/blog/${blogSlug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const deleteCloudinaryAsset = async (urlOrPublicId?: string | null, publicId?: string | null) => {
    const target = publicId || urlOrPublicId;
    if (!target) return;
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlOrPublicId, publicId }),
      });
    } catch (err) {
      console.warn('Cloudinary cleanup warning:', err);
    }
  };

  const openCreateModal = () => {
    setEditingBlog(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCoverImage('');
    setCoverImagePublicId(null);
    setReadTime('5 min read');
    setAuthor('AiCura Medical Team');
    setIsPublished(true);
    setError('');
    setIsModalOpen(true);
  };

  const openEditModal = (blog: BlogItem) => {
    setEditingBlog(blog);
    setTitle(blog.title);
    setSlug(blog.slug);
    setExcerpt(blog.excerpt);
    // Always display clean plain text in the editor (strip/convert HTML tags)
    setContent(htmlToPlainText(blog.content));
    setCoverImage(blog.coverImage);
    setCoverImagePublicId(null);
    setReadTime(blog.readTime || '5 min read');
    setAuthor(blog.author || 'AiCura Medical Team');
    setIsPublished(blog.isPublished);
    setError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    // If a new image was uploaded during this modal session and the user cancels without saving, delete it from Cloudinary
    if (coverImagePublicId) {
      deleteCloudinaryAsset(coverImage, coverImagePublicId);
    }
    setIsModalOpen(false);
    setEditingBlog(null);
    setCoverImagePublicId(null);
    setError('');
  };

  const handleClearCoverImage = async () => {
    if (!coverImage) return;
    setClearingImage(true);
    setError('');
    try {
      // Delete from Cloudinary when clearing a newly uploaded image or existing Cloudinary image
      const isSameAsSavedBlogImage = editingBlog && editingBlog.coverImage === coverImage && !coverImagePublicId;
      if (!isSameAsSavedBlogImage) {
        await deleteCloudinaryAsset(coverImage, coverImagePublicId);
      } else {
        // Also delete from Cloudinary if user explicitly clears the existing blog cover image
        await deleteCloudinaryAsset(coverImage, null);
      }
      setCoverImage('');
      setCoverImagePublicId(null);
    } finally {
      setClearingImage(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');
    try {
      // If user already uploaded a temporary image in this modal session, delete it before uploading the new one
      if (coverImagePublicId) {
        await deleteCloudinaryAsset(coverImage, coverImagePublicId);
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'general');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const json = await res.json();
      if (res.ok && json.success && json.data?.url) {
        setCoverImage(json.data.url);
        setCoverImagePublicId(json.data.public_id || null);
      } else {
        setError(json.message || 'Failed to upload cover image');
      }
    } catch (err: any) {
      setError(err?.message || 'Error uploading cover image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !excerpt.trim() || !content.trim() || !coverImage.trim()) {
      setError('Title, excerpt, cover image, and article content are required.');
      return;
    }

    // Automatically convert plain text into structured HTML behind the scenes
    const formattedContent = plainTextToHtml(content);

    setSaving(true);
    try {
      const payload = {
        title: title.trim(),
        slug: slug.trim() || undefined,
        excerpt: excerpt.trim(),
        content: formattedContent,
        coverImage: coverImage.trim(),
        readTime: readTime.trim() || '5 min read',
        author: author.trim() || 'AiCura Medical Team',
        isPublished,
      };

      const url = editingBlog ? `/api/blogs/${editingBlog.id}` : '/api/blogs';
      const method = editingBlog ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success) {
        // Clear coverImagePublicId before closing modal so the newly saved image is NOT deleted on close
        setCoverImagePublicId(null);
        setIsModalOpen(false);
        setEditingBlog(null);
        setError('');
        await loadBlogs();
        showNotice(
          'success',
          editingBlog ? 'Blog article updated successfully!' : 'New blog article published!'
        );
      } else {
        setError(json.message || 'Failed to save blog article');
      }
    } catch (err: any) {
      setError(err?.message || 'An unexpected error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async (blog: BlogItem) => {
    setTogglingId(blog.id);
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'togglePublish' }),
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          setBlogs((prev) => prev.map((b) => (b.id === blog.id ? json.data : b)));
          showNotice(
            'success',
            json.data.isPublished
              ? `"${blog.title}" is now published on the website.`
              : `"${blog.title}" has been moved to drafts/hidden.`
          );
        }
      }
    } catch (err) {
      console.error('Failed to toggle blog status:', err);
      showNotice('error', 'Failed to update publish status');
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (blog: BlogItem) => {
    if (!confirm(`Are you sure you want to permanently delete the article "${blog.title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setBlogs((prev) => prev.filter((b) => b.id !== blog.id));
        showNotice('success', `Deleted blog article "${blog.title}"`);
      } else {
        showNotice('error', 'Failed to delete blog article');
      }
    } catch (err) {
      console.error('Delete blog error:', err);
      showNotice('error', 'Failed to delete blog article');
    }
  };

  const filteredBlogs = blogs.filter((b) => {
    if (statusFilter === 'PUBLISHED' && !b.isPublished) return false;
    if (statusFilter === 'DRAFT' && b.isPublished) return false;

    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      b.title.toLowerCase().includes(q) ||
      b.excerpt.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.slug.toLowerCase().includes(q)
    );
  });

  const publishedCount = blogs.filter((b) => b.isPublished).length;
  const draftCount = blogs.length - publishedCount;

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5" /> Health Articles &amp; Blog CMS
            </div>
            <h1 className="text-2xl font-bold text-slate-900 font-sans">
              Understand Your Health — Blog CMS
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Create, edit, upload cover images, and publish health articles with dynamic SEO meta titles &amp; descriptions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <a
              href="/blog"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" /> View Blog Page
            </a>

            <button
              type="button"
              onClick={openCreateModal}
              className="px-5 py-2.5 gold-gradient text-brand-900 font-bold text-xs rounded-xl shadow flex items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Write New Article
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
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Total Articles</span>
            <p className="text-2xl font-extrabold text-slate-900 mt-1">{blogs.length}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-700 uppercase">Published Articles</span>
            <p className="text-2xl font-extrabold text-emerald-700 mt-1">{publishedCount}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Draft / Hidden</span>
            <p className="text-2xl font-extrabold text-slate-600 mt-1">{draftCount}</p>
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
                { key: 'ALL', label: `All (${blogs.length})` },
                { key: 'PUBLISHED', label: `Published (${publishedCount})` },
                { key: 'DRAFT', label: `Hidden (${draftCount})` },
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
              placeholder="Search articles by title, author..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700"
            />
          </div>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-brand-700 animate-spin" />
            <p className="text-xs font-semibold">Loading blog articles from database...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <FileText className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-800">No blog articles found</p>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Publish health articles and diagnostic guides to educate patients and improve SEO.
            </p>
            <div className="flex items-center justify-center pt-2">
              <button
                type="button"
                onClick={openCreateModal}
                className="px-4 py-2 bg-brand-700 text-yellow-400 font-bold text-xs rounded-xl shadow cursor-pointer"
              >
                + Write First Article
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBlogs.map((blog) => (
              <div
                key={blog.id}
                className={`bg-white rounded-3xl overflow-hidden border shadow-sm transition-all flex flex-col justify-between group ${
                  blog.isPublished
                    ? 'border-slate-200 hover:shadow-lg'
                    : 'border-dashed border-slate-300 opacity-75'
                }`}
              >
                <div>
                  {/* Cover Image */}
                  <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3">
                      <button
                        type="button"
                        onClick={() => handleTogglePublish(blog)}
                        disabled={togglingId === blog.id}
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 shadow cursor-pointer ${
                          blog.isPublished
                            ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                            : 'bg-slate-800/80 text-white hover:bg-slate-900'
                        }`}
                        title={blog.isPublished ? 'Click to unpublish' : 'Click to publish'}
                      >
                        {togglingId === blog.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : blog.isPublished ? (
                          <Eye className="w-3 h-3" />
                        ) : (
                          <EyeOff className="w-3 h-3" />
                        )}
                        {blog.isPublished ? 'Published' : 'Hidden'}
                      </button>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-2.5">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-brand-700" />
                        {new Date(blog.publishedAt).toLocaleDateString()}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-brand-700" />
                        {blog.readTime}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900 leading-snug line-clamp-2">
                      {blog.title}
                    </h2>

                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {blog.excerpt}
                    </p>

                    <div className="pt-1 flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[200px]">
                        /blog/{blog.slug}
                      </span>
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] text-brand-700 hover:underline font-bold inline-flex items-center gap-0.5 shrink-0"
                      >
                        Live <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                    <span className="truncate">{blog.author}</span>
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleCopyLink(blog.slug, blog.id)}
                      className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors cursor-pointer"
                      title="Copy Article URL"
                    >
                      {copiedId === blog.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditModal(blog)}
                      className="p-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-brand-700 hover:text-white transition-colors cursor-pointer"
                      title="Edit Article"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(blog)}
                      className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                      title="Delete Article"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create / Edit Blog Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
            <div
              className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden relative animate-in zoom-in-95"
              role="dialog"
              aria-modal="true"
            >
              {/* Modal Header */}
              <div className="bg-brand-800 text-white p-5 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-yellow-400 text-brand-900 flex items-center justify-center">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold">
                      {editingBlog ? 'Edit Blog Article' : 'Create New Blog Article'}
                    </h3>
                    <p className="text-[11px] text-slate-300">
                      Title &amp; Excerpt automatically power dynamic SEO meta title and meta description
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
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">
                      Article Title (Also used as SEO Meta Title) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Understanding Your Full Body Checkup Report: A Step-by-Step Guide"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Author Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Ananya Sharma / AiCura Medical Team"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Read Time
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 5 min read"
                        value={readTime}
                        onChange={(e) => setReadTime(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Custom URL Slug (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="Auto-generated from title"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                    </div>
                  </div>
                </div>

                {/* Cover Image Upload & URL */}
                <div className="space-y-2">
                  <label className="block font-bold text-slate-700">
                    Cover Image (Cloudinary Upload or Image URL) *
                  </label>
                  <div className="flex flex-col sm:flex-row items-start gap-4">
                    {coverImage && (
                      <div className="relative w-36 h-24 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <Image
                          src={coverImage}
                          alt="Cover preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        required
                        placeholder="Paste cover image URL or upload image below..."
                        value={coverImage}
                        onChange={(e) => setCoverImage(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                      />
                      <div className="flex items-center gap-2">
                        <label className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl cursor-pointer inline-flex items-center gap-1.5 transition-colors">
                          {uploading ? (
                            <Loader2 className="w-4 h-4 animate-spin text-brand-700" />
                          ) : (
                            <Upload className="w-4 h-4 text-brand-700" />
                          )}
                          <span>{uploading ? 'Uploading to Cloudinary...' : 'Upload Cover Image'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleCoverUpload}
                            className="hidden"
                          />
                        </label>
                        {coverImage && (
                          <button
                            type="button"
                            disabled={clearingImage}
                            onClick={handleClearCoverImage}
                            className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl font-semibold cursor-pointer inline-flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {clearingImage && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                            {clearingImage ? 'Removing...' : 'Clear Image'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Excerpt / Meta Description */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Short Summary / Excerpt (Also used as SEO Meta Description) *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief 1-2 sentence summary shown on blog cards and search engine meta description..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>

                {/* Full Article Content (Plain Text) */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-bold text-slate-700">
                      Full Article Content *
                    </label>
                    <span className="text-[11px] text-slate-400">
                      Just type or paste normal text — paragraphs, headings &amp; bullet points format automatically
                    </span>
                  </div>
                  <textarea
                    rows={8}
                    required
                    placeholder="Simply type or paste your article content here in plain text..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>

                {/* Publish Toggle & Submit */}
                <div className="pt-3 flex items-center justify-between border-t border-slate-100">
                  <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="w-4 h-4 text-brand-700 rounded"
                    />
                    Publish Article on Website
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
                        : editingBlog
                        ? 'Update Article'
                        : 'Publish Article'}
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
