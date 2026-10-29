'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import EnquireModal from '@/components/ui/EnquireModal';
import { Filter, Droplet, Clock, AlertCircle, Search } from 'lucide-react';

export interface TestItem {
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

interface TestsServicesClientProps {
  initialTests: TestItem[];
  initialCategories: string[];
}

export default function TestsServicesClient({
  initialTests,
  initialCategories,
}: TestsServicesClientProps) {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'All';
  const initialQuery = searchParams.get('q') || '';

  const [tests] = useState<TestItem[]>(initialTests);
  const [categories] = useState<string[]>(
    initialCategories.length > 0 ? initialCategories : ['All']
  );
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
      {/* Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
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

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search test by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700"
          />
        </div>
      </div>

      {/* Tests Grid */}
      {filteredTests.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Need a Custom Diagnostic Test or Prescription Checkup?
          </h2>
          <p className="text-slate-600 text-xs max-w-lg mx-auto leading-relaxed">
            We offer 500+ specialized biochemistry, hormone, hematology, allergy, and clinical pathology investigations with doorstep sample collection.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {(selectedCategory !== 'All' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
              >
                Show All Tests
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setSelectedTest(null);
                setIsModalOpen(true);
              }}
              className="px-5 py-2.5 gold-gradient text-brand-900 font-bold text-xs rounded-xl shadow hover:scale-105 transition-transform"
            >
              Enquire or Upload Prescription →
            </button>
          </div>
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
                    <span>
                      Sample: <strong className="text-slate-700">{test.sampleType}</strong>
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-lg">
                    <Clock className="w-3.5 h-3.5 text-brand-700 shrink-0" />
                    <span>
                      Report: <strong className="text-slate-700">{test.reportTurnaround}</strong>
                    </span>
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
                        <span className="text-xs text-slate-400 line-through">
                          ₹{test.originalPrice}
                        </span>
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

      <EnquireModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultTestOrPackage={selectedTest ? selectedTest.name : ''}
        defaultType="test"
      />
    </>
  );
}

