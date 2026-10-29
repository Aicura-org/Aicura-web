import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Clock } from 'lucide-react';
import { BlogService } from '@/services/blog.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  try {
    const blogs = await BlogService.listBlogs({ isPublished: true, limit: 3 });
    const latestTitles = blogs.map((b) => b.title).join(' | ');
    const description =
      blogs.length > 0
        ? `Explore health insights & medical guides from AiCura Diagnostics: ${latestTitles}`
        : 'Stay informed with articles written by doctors and medical experts on preventative health and diagnostic testing at AiCura Diagnostics.';

    return {
      title: 'Health Resources & Medical Blog | AiCura Diagnostics',
      description,
      openGraph: {
        title: 'Health Resources & Medical Blog | AiCura Diagnostics',
        description,
        images: blogs[0]?.coverImage ? [{ url: blogs[0].coverImage, alt: blogs[0].title }] : [],
        type: 'website',
      },
    };
  } catch {
    return {
      title: 'Health Resources & Medical Blog | AiCura Diagnostics',
      description:
        'Stay informed with articles written by doctors and medical experts on preventative health and diagnostic testing.',
    };
  }
}

export default async function BlogListPage() {
  const blogs = await BlogService.listBlogs({ isPublished: true }).catch(() => []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Banner */}
      <div className="hero-gradient text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
            Health Insights &amp; Educational Content
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans">
            AiCura Health Resources &amp; Blog
          </h1>
          <p className="text-slate-200 text-sm max-w-2xl mx-auto">
            Stay informed with articles written by doctors and medical experts on preventative health and diagnostic testing.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        {blogs.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs">
            No health articles available at the moment.
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
    </div>
  );
}
