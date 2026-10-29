import React, { Suspense } from 'react';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import TestsServicesClient, { TestItem } from './TestsServicesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getDiagnosticTestsData(): Promise<{
  tests: TestItem[];
  categories: string[];
}> {
  try {
    const tests = await prisma.diagnosticTest.findMany({
      where: { isActive: true },
      orderBy: { name: 'asc' },
    });

    const distinctCategories = Array.from(
      new Set(tests.map((t) => t.category).filter(Boolean))
    );

    return {
      tests,
      categories: ['All', ...distinctCategories],
    };
  } catch (err) {
    console.error('Failed to fetch diagnostic tests server-side:', err);
    return { tests: [], categories: ['All'] };
  }
}

export default async function TestsServicesPage() {
  const { tests, categories } = await getDiagnosticTestsData();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* Banner — Always server-rendered for Googlebot */}
      <section className="relative w-full h-[45vh] min-h-[260px] bg-white border-b border-slate-200 shadow-sm overflow-hidden flex items-center">
        <Image
          src="/tests-services-banner.webp"
          alt="Diagnostic Tests & Services - AiCura Diagnostics"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center w-full h-full"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl space-y-3 text-left">
              <span className="inline-block text-brand-900 bg-yellow-400 font-extrabold text-xs uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Certified Diagnostic Testing
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                Diagnostic Tests &amp; Services
              </h1>
              <p className="text-slate-200 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
                Browse our catalogue of certified pathology and clinical lab tests with doorstep home sample collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Search & Filter */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tests.map((test) => (
                <div
                  key={test.id}
                  className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-2"
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                    {test.category}
                  </span>
                  <h3 className="text-lg font-bold text-slate-900">{test.name}</h3>
                  {test.description && (
                    <p className="text-slate-600 text-xs">{test.description}</p>
                  )}
                  <p className="text-base font-extrabold text-brand-700">₹{test.price}</p>
                </div>
              ))}
            </div>
          }
        >
          <TestsServicesClient initialTests={tests} initialCategories={categories} />
        </Suspense>
      </main>
    </div>
  );
}
