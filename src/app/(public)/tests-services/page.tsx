'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import EnquireModal from '@/components/ui/EnquireModal';
import { Filter, Droplet, Clock, AlertCircle, Loader2, ArrowRight, ExternalLink } from 'lucide-react';

interface TestItem {
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
}

function TestsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [tests, setTests] = useState<TestItem[]>([]);
  const [categories, setCategories] = useState<string[]>(['All']);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadTests() {
      try {
        const res = await fetch('/api/tests?withCategories=true');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            if (Array.isArray(data.data)) {
              setTests(data.data);
              const distinct = Array.from(new Set(data.data.map((t: TestItem) => t.category).filter(Boolean)));
              setCategories(['All', ...distinct as string[]]);
            } else {
              setTests(data.data.tests || []);
              if (data.data.categories?.length) {
                setCategories(data.data.categories);
              }
            }
          }
        }
      } catch (err) {
        console.error('Failed to fetch tests:', err);
      } finally {
        setLoading(false);
      }
    }
    loadTests();
  }, []);

  const filteredTests = tests.filter((t) => {
    const matchesCat =
      selectedCategory === 'All' ||
      t.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleEnquireTest = (test: TestItem) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">      
      {/* Banner */}
      <section className="relative w-full h-[45vh] min-h-[260px] bg-white border-b border-slate-200 shadow-sm overflow-hidden flex items-center">
        <Image
          src="/Modern Diagnostic Testing Banner.png"
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
        
        {/* Controls Bar */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8">
          {/* Category Filter Pills (Database-Driven) */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-brand-700" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory.toLowerCase() === cat.toLowerCase()
                    ? 'bg-brand-700 text-yellow-400 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Tests Grid */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 text-brand-700 animate-spin" />
            <p className="text-xs font-semibold">Loading diagnostic tests...</p>
          </div>
        ) : filteredTests.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs bg-white rounded-3xl border border-slate-200 p-8">
            No diagnostic tests match your search criteria.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTests.map((test) => (
              <div
                key={test.id}
                className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                      {test.category}
                    </span>
                    <span className="text-xs font-mono font-medium text-slate-400">
                      Code: {test.code}
                    </span>
                  </div>

                  <Link href={`/tests-services/${test.code.toLowerCase()}`}>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                      {test.name}
                    </h3>
                  </Link>

                  {test.description && (
                    <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                      {test.description}
                    </p>
                  )}

                  {/* Details Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
                      <Droplet className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>Sample: <strong className="text-slate-700">{test.sampleType}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                      <span>Report: <strong className="text-slate-700">{test.reportTurnaround}</strong></span>
                    </div>
                  </div>

                  {test.fastingRequired && (
                    <div className="flex items-center gap-1.5 text-[11px] text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200/60 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" />
                      <span>Fasting Required (10-12 hrs)</span>
                    </div>
                  )}
                </div>

                {/* Price & Actions */}
                <div className="pt-5 border-t border-slate-100 mt-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block">Test Fee</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl font-extrabold text-brand-700">₹{test.price}</span>
                        {test.originalPrice && (
                          <span className="text-xs text-slate-400 line-through">₹{test.originalPrice}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/tests-services/${test.code.toLowerCase()}`}
                        className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-brand-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                      >
                        Details
                      </Link>
                      <button
                        onClick={() => handleEnquireTest(test)}
                        className="px-4 py-2 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-xs rounded-xl shadow transition-transform hover:scale-105"
                      >
                        Book Test →
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>
      <EnquireModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTestOrPackage={selectedTest ? selectedTest.name : ''}
        defaultType="test"
      />
    </div>
  );
}

export default function TestsServicesPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center text-slate-600">Loading Diagnostic Tests...</div>}>
      <TestsContent />
    </Suspense>
  );
}
