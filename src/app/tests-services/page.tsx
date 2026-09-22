'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBtn from '@/components/layout/WhatsAppBtn';
import EnquireModal from '@/components/ui/EnquireModal';
import { Search, Filter, Droplet, Clock, AlertCircle, Loader2 } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedTest, setSelectedTest] = useState<TestItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadTests() {
      try {
        const res = await fetch('/api/tests');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.data) {
            setTests(data.data);
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

  const categories = ['All', 'Hematology', 'Biochemistry', 'Endocrinology', 'Diabetology', 'Vitamins'];

  const filteredTests = tests.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category.toLowerCase().includes(selectedCategory.toLowerCase());
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
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />
      
      {/* Banner */}
      <div className="hero-gradient text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
            Accurate Diagnostic Testing
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans">
            Diagnostic Tests & Services
          </h1>
          <p className="text-slate-200 text-sm max-w-2xl mx-auto">
            Browse our catalogue of NABL accredited pathology and clinical lab tests with doorstep home sample collection.
          </p>
        </div>
      </div>

      {/* Main Search & Filter */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        
        {/* Controls Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8 space-y-4">
          
          {/* Search Box */}
          <div className="relative">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search tests by name, code or category (e.g., CBC, TSH, Lipid)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <span className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5 text-brand-700" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
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
          <div className="py-20 text-center text-slate-500 text-xs">
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

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                    {test.name}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-2">
                    {test.description}
                  </p>

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
                      <span>Fasting Required</span>
                    </div>
                  )}
                </div>

                {/* Price & Action */}
                <div className="pt-5 border-t border-slate-100 mt-5 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Test Fee</span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl font-extrabold text-brand-700">₹{test.price}</span>
                      {test.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">₹{test.originalPrice}</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleEnquireTest(test)}
                    className="px-4 py-2.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-xs rounded-xl shadow transition-transform hover:scale-105"
                  >
                    Book Test →
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </main>

      <Footer />
      <WhatsAppBtn />

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
