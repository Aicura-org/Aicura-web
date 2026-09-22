'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Activity, Droplet, Heart, Shield, Sparkles, MoreHorizontal, Sun } from 'lucide-react';

export default function TestSearchSection() {
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/tests-services?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/tests-services');
    }
  };

  const categories = [
    { label: 'Blood Tests', icon: Droplet, cat: 'Blood Tests' },
    { label: 'Diabetes', icon: Activity, cat: 'Diabetes' },
    { label: 'Thyroid', icon: Sparkles, cat: 'Thyroid' },
    { label: 'Vitamins', icon: Sun, cat: 'Vitamins' },
    { label: 'Hormones', icon: Shield, cat: 'Hormones' },
    { label: 'Heart Health', icon: Heart, cat: 'Heart Health' },
    { label: "Women's Health", icon: Sparkles, cat: "Women's Health" },
    { label: 'More', icon: MoreHorizontal, cat: '' },
  ];

  return (
    <section className="py-14 bg-slate-50 border-y border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Search Bar Grid */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 mb-10">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
              Looking for a specific test?
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Search from 500+ diagnostic tests or browse by health category.
            </p>
          </div>

          {/* Search Bar Input */}
          <form onSubmit={handleSearch} className="w-full lg:max-w-xl flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search tests, conditions or biomarkers (e.g. CBC, Vitamin D, TSH)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-10 py-3.5 bg-white border border-slate-300 rounded-2xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700 shadow-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 bg-brand-700 hover:bg-brand-800 text-yellow-400 font-bold rounded-2xl shadow-md transition-transform hover:scale-105 flex items-center justify-center shrink-0"
              aria-label="Search diagnostic tests"
            >
              <Search className="w-5 h-5 text-yellow-400" />
            </button>
          </form>
        </div>

        {/* Category Pills Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {categories.map((item, idx) => {
            const IconComp = item.icon;
            return (
              <button
                key={idx}
                onClick={() => router.push(item.cat ? `/tests-services?cat=${encodeURIComponent(item.cat)}` : '/tests-services')}
                className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-brand-700 shadow-sm hover:shadow-md transition-all flex flex-col items-center text-center group"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-50 group-hover:bg-brand-700 text-brand-700 group-hover:text-yellow-400 flex items-center justify-center mb-2.5 transition-colors">
                  <IconComp className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-slate-800 group-hover:text-brand-700 transition-colors">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

      </div>
    </section>
  );
}
