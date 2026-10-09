'use client';

import React, { useState } from 'react';
import EnquireModal from '@/components/ui/EnquireModal';
import {
    FlaskConical,
    Droplet,
    Clock,
    AlertCircle,
    ShieldCheck,
    CheckCircle2,
    Phone,
    MessageCircle,
} from 'lucide-react';

interface DiagnosticTestRecord {
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

export default function TestDetailClient({ test }: { test: DiagnosticTestRecord }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const savings =
        test.originalPrice && test.originalPrice > test.price
            ? test.originalPrice - test.price
            : 0;

    return (
        <div className="space-y-8">
            {/* Hero Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-brand-50 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-4 max-w-2xl">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                                {test.category}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                                Code: {test.code}
                            </span>
                            {savings > 0 && (
                                <span className="text-xs font-extrabold text-amber-900 bg-amber-100 px-3 py-1 rounded-full">
                                    Save ₹{savings}
                                </span>
                            )}
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                            {test.name}
                        </h1>

                        {test.description ? (
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                                {test.description}
                            </p>
                        ) : (
                            <p className="text-sm text-slate-500 leading-relaxed">
                                Accurate, pathology-verified clinical test with certified precision equipment and same-day digital reporting.
                            </p>
                        )}
                    </div>

                    {/* Pricing & CTA Card */}
                    <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 shrink-0 w-full lg:w-80 space-y-4">
                        <div>
                            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1">
                                Test Price
                            </span>
                            <div className="flex items-baseline gap-2">
                                <span className="text-3xl font-extrabold text-brand-800">₹{test.price}</span>
                                {test.originalPrice && (
                                    <span className="text-sm text-slate-400 line-through">
                                        ₹{test.originalPrice}
                                    </span>
                                )}
                            </div>
                            <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                                ✓ Includes Free Digital Report via WhatsApp
                            </span>
                        </div>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="w-full py-3 gold-gradient text-brand-900 font-bold text-sm rounded-xl shadow hover:scale-[1.02] transition-transform text-center flex items-center justify-center gap-2"
                        >
                            Book Home Collection
                        </button>

                        <a
                            href={`https://wa.me/919946284615?text=${encodeURIComponent(
                                `Hi AiCura, I would like to book the test: ${test.name} (${test.code})`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-2 transition-colors"
                        >
                            <MessageCircle className="w-4 h-4" /> Book via WhatsApp
                        </a>
                    </div>
                </div>
            </div>

            {/* Test Parameters & Prerequisites Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                        <Droplet className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Sample Type</h4>
                        <p className="text-base font-bold text-slate-800 mt-0.5">{test.sampleType}</p>
                        <p className="text-xs text-slate-500 mt-1">Collected safely with sterile disposable vacutainers.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-brand-700 flex items-center justify-center shrink-0">
                        <Clock className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Report Turnaround</h4>
                        <p className="text-base font-bold text-slate-800 mt-0.5">{test.reportTurnaround}</p>
                        <p className="text-xs text-slate-500 mt-1">Verified by senior MD Pathologists before delivery.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wide">Fasting Required</h4>
                        <p className="text-base font-bold text-slate-800 mt-0.5">
                            {test.fastingRequired ? 'Yes (10-12 Hours)' : 'No Fasting Required'}
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                            {test.fastingRequired
                                ? 'Only plain water may be consumed before sample collection.'
                                : 'Sample can be collected at any convenient time.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quality & Assurance Strip */}
            <div className="bg-brand-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="space-y-1 text-center md:text-left">
                    <div className="flex items-center gap-2 justify-center md:justify-start text-yellow-400 font-bold text-xs uppercase tracking-wider">
                        <ShieldCheck className="w-4 h-4" /> Certified Diagnostic Standards
                    </div>
                    <h3 className="text-xl font-bold">Why AiCura Diagnostics?</h3>
                    <p className="text-xs text-slate-300 max-w-xl">
                        State-of-the-art robotic clinical analyzers, certified phlebotomists, and 100% temperature-controlled cold-chain sample transport.
                    </p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-3 gold-gradient text-brand-900 font-bold text-xs rounded-xl shadow hover:scale-105 transition-transform shrink-0"
                >
                    Schedule Doorstep Collection →
                </button>
            </div>

            <EnquireModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                defaultTestOrPackage={test.name}
                defaultType="test"
            />
        </div>
    );
}
