'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock } from 'lucide-react';

interface BlogItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  readTime: string;
  publishedAt: string;
}

export default function BlogSection() {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setBlogs(data.data.slice(0, 3));
          }
        }
      } catch (err) {
        console.error('Failed to load blogs:', err);
      }
    }
    fetchBlogs();
  }, []);

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <span className="text-brand-700 text-xs font-bold uppercase tracking-wider block mb-1">
              HEALTH ARTICLES & BLOGS
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-sans tracking-tight">
              Understand Your Health
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Stay informed with the latest diagnostic and healthcare insights.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-brand-700 hover:text-brand-800 font-bold text-sm mt-4 md:mt-0 group"
          >
            View All Articles
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Blogs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {blogs.map((blog) => (
            <Link
              key={blog.id}
              href={`/blog/${blog.slug}`}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
            >
              {/* Image */}
              <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span>{new Date(blog.publishedAt).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {blog.readTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-xs font-bold text-brand-700 flex items-center gap-1 group-hover:text-yellow-600">
                  Read Full Article →
                </div>
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
