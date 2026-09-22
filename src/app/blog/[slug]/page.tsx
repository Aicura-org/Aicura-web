'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBtn from '@/components/layout/WhatsAppBtn';
import { Clock, ArrowLeft, Calendar, User, Loader2 } from 'lucide-react';

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  readTime: string;
  author: string;
  publishedAt: string;
}

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = use(params);
  const [blog, setBlog] = useState<BlogItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const res = await fetch(`/api/blogs?slug=${resolvedParams.slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setBlog(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load blog detail:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [resolvedParams.slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />
        <div className="py-20 flex flex-col items-center justify-center gap-2 text-slate-400">
          <Loader2 className="w-8 h-8 animate-spin text-brand-700" />
          <p className="text-xs font-semibold">Loading article...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
        <Header />
        <div className="py-20 text-center text-slate-700 font-semibold space-y-3">
          <p className="text-lg">Article Not Found</p>
          <Link href="/blog" className="text-xs text-brand-700 hover:underline">
            ← Back to Articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Articles
        </Link>

        {/* Title Block */}
        <div className="space-y-4">
          <span className="text-xs font-bold text-brand-700 uppercase tracking-widest block">
            Health & Diagnostics Guide
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 font-sans leading-tight">
            {blog.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-2 border-b border-slate-200 pb-4">
            <span className="flex items-center gap-1.5 font-medium text-slate-700">
              <User className="w-4 h-4 text-brand-700" /> {blog.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-700" /> {new Date(blog.publishedAt).toLocaleDateString()}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-brand-700" /> {blog.readTime}
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-lg">
          <Image
            src={blog.coverImage}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Content Body */}
        <article className="prose prose-emerald max-w-none text-slate-700 text-sm leading-relaxed space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-base font-semibold text-slate-900 leading-relaxed border-l-4 border-brand-700 pl-4 bg-emerald-50/50 py-2 rounded-r-lg">
            {blog.excerpt}
          </p>

          <div className="space-y-4 pt-2 font-sans" dangerouslySetInnerHTML={{ __html: blog.content }} />
        </article>
      </main>

      <Footer />
      <WhatsAppBtn />
    </div>
  );
}
