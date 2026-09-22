'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBtn from '@/components/layout/WhatsAppBtn';
import { Clock, Loader2 } from 'lucide-react';

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  readTime: string;
  author: string;
  publishedAt: string;
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setBlogs(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Header />

      {/* Banner */}
      <div className="hero-gradient text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
            Health Insights & Educational Content
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans">
            AiCura Health Resources & Blog
          </h1>
          <p className="text-slate-200 text-sm max-w-2xl mx-auto">
            Stay informed with articles written by doctors and medical experts on preventative health and diagnostic testing.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-brand-700 animate-spin" />
            <p className="text-xs font-semibold">Loading health articles...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blog/${blog.slug}`}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="relative h-48 w-full bg-slate-200 overflow-hidden">
                    <Image
                      src={blog.coverImage}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {blog.readTime}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                      {blog.title}
                    </h2>

                    <p className="text-slate-600 text-xs line-clamp-3 leading-relaxed">
                      {blog.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0 flex items-center justify-between border-t border-slate-100 mt-4 text-xs font-semibold text-brand-700">
                  <span>By {blog.author}</span>
                  <span className="group-hover:text-yellow-600">Read Article →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppBtn />
    </div>
  );
}
