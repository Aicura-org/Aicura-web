import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowLeft, Calendar, User } from 'lucide-react';
import { BlogService } from '@/services/blog.service';
import { plainTextToHtml } from '@/lib/blog-content';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

async function getBlog(paramSlug: string) {
  let blog = await BlogService.getBlogBySlug(paramSlug);
  if (!blog) {
    blog = await BlogService.getBlogById(paramSlug);
  }
  return blog;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || !blog.isPublished) {
    return {
      title: 'Article Not Found | AiCura Diagnostics',
    };
  }

  const title = `${blog.title} | AiCura Diagnostics Blog`;
  const description = blog.excerpt;

  return {
    title,
    description,
    authors: [{ name: blog.author }],
    openGraph: {
      title,
      description,
      images: blog.coverImage ? [{ url: blog.coverImage, alt: blog.title }] : [],
      type: 'article',
      publishedTime: new Date(blog.publishedAt).toISOString(),
      authors: [blog.author],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: blog.coverImage ? [blog.coverImage] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const blog = await getBlog(slug);

  if (!blog || !blog.isPublished) {
    notFound();
  }

  const renderedHtml = plainTextToHtml(blog.content);

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
      <Link
        href="/blog"
        className="inline-flex items-center gap-2 text-xs font-bold text-brand-700 hover:text-brand-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Articles
      </Link>

      {/* Title Block */}
      <div className="space-y-4">
        <span className="text-xs font-bold text-brand-700 uppercase tracking-widest block">
          Health &amp; Diagnostics Guide
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
          priority
          className="object-cover"
        />
      </div>

      {/* Content Body */}
      <article className="prose prose-emerald max-w-none text-slate-700 text-sm leading-relaxed space-y-6 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
        <p className="text-base font-semibold text-slate-900 leading-relaxed border-l-4 border-brand-700 pl-4 bg-emerald-50/50 py-2 rounded-r-lg">
          {blog.excerpt}
        </p>

        <div className="space-y-4 pt-2 font-sans" dangerouslySetInnerHTML={{ __html: renderedHtml }} />
      </article>
    </main>
  );
}
