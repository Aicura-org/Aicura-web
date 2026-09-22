'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, FileText, Package, ChevronRight } from 'lucide-react';
import EnquireModal from '../ui/EnquireModal';

export default function QuickActions() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'test' | 'prescription' | 'package'>('test');

  return (
    <>
      <section className="py-12 bg-emerald-50/60 border-y border-emerald-100/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                How can we help you today?
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Choose an option to get started. It's quick and easy.
              </p>
            </div>
            <span className="text-xs text-brand-700 font-semibold mt-2 md:mt-0 bg-emerald-100 px-3 py-1 rounded-full w-fit">
              Simple steps. Better health.
            </span>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Card 1: Specific Test */}
            <Link
              href="/tests-services"
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex items-start justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-brand-700 flex items-center justify-center shrink-0 group-hover:bg-brand-700 group-hover:text-yellow-400 transition-colors">
                  <Search className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                    I need a specific test
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Search and enquire about individual diagnostic lab tests.
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-brand-700 group-hover:bg-brand-700 group-hover:text-white transition-all shrink-0 ml-2">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

            {/* Card 2: Doctor Prescription */}
            <button
              onClick={() => {
                setModalType('prescription');
                setModalOpen(true);
              }}
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex items-start justify-between text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-brand-700 flex items-center justify-center shrink-0 group-hover:bg-brand-700 group-hover:text-yellow-400 transition-colors">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                    I have a doctor's prescription
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Upload your prescription and our medical team will assist you.
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-brand-700 group-hover:bg-brand-700 group-hover:text-white transition-all shrink-0 ml-2">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>

            {/* Card 3: Health Package */}
            <Link
              href="/packages"
              className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group flex items-start justify-between"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-brand-700 flex items-center justify-center shrink-0 group-hover:bg-brand-700 group-hover:text-yellow-400 transition-colors">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                    I want a health package
                  </h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">
                    Choose from our curated health packages for you and your family.
                  </p>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:border-brand-700 group-hover:bg-brand-700 group-hover:text-white transition-all shrink-0 ml-2">
                <ChevronRight className="w-4 h-4" />
              </div>
            </Link>

          </div>
        </div>
      </section>

      {/* Modal */}
      <EnquireModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultType={modalType}
      />
    </>
  );
}
