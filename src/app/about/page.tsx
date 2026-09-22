'use client';

import React from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBtn from '@/components/layout/WhatsAppBtn';
import { ShieldCheck, Award, Heart, CheckCircle2, Users, Microchip, Building } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Banner */}
      <div className="hero-gradient text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
            Accredited Diagnostic Laboratory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans">
            About AiCura Diagnostics
          </h1>
          <p className="text-slate-200 text-sm max-w-2xl mx-auto">
            Delivering gold-standard clinical pathology, advanced diagnostic precision, and compassionate healthcare services.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 flex-1 w-full space-y-16">
        
        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-brand-700 uppercase bg-emerald-50 px-3 py-1 rounded-full">
              Our Journey & Mission
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 font-sans leading-tight">
              Pioneering Clinical Precision for a Healthier Community
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Founded with the vision to make advanced, accredited diagnostic testing accessible and seamless for everyone, AiCura Diagnostics combines automated laboratory analyzers with seasoned medical expertise.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              From routine blood screenings to specialized hormonal and genetic panels, every specimen undergoes rigorous multi-tier quality checks to ensure flawless clinical accuracy.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold text-slate-800">
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>NABL Accredited Standard</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>ISO 9001:2015 Certified</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl">
              <Image
                src="https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=800"
                alt="AiCura Diagnostic Laboratory equipment"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        {/* Pillars of Quality */}
        <div className="bg-brand-700 text-white rounded-3xl p-10 border border-emerald-600 shadow-2xl">
          <div className="text-center max-w-xl mx-auto mb-10">
            <h3 className="text-2xl font-bold font-sans">Our Core Values</h3>
            <p className="text-slate-200 text-xs mt-1">The foundation behind our clinical excellence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-brand-800/80 p-6 rounded-2xl border border-emerald-600/40 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-yellow-400 flex items-center justify-center mx-auto">
                <Microchip className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold">Cutting-Edge Tech</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Fully automated hematology and biochemistry analyzers to eliminate human error.
              </p>
            </div>

            <div className="bg-brand-800/80 p-6 rounded-2xl border border-emerald-600/40 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-yellow-400 flex items-center justify-center mx-auto">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold">Expert Pathologists</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Supervised by veteran senior pathologists and certified lab technologists.
              </p>
            </div>

            <div className="bg-brand-800/80 p-6 rounded-2xl border border-emerald-600/40 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-yellow-400 flex items-center justify-center mx-auto">
                <Heart className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold">Patient-Centric Care</h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Fast report turnarounds and compassionate doorstep collection services.
              </p>
            </div>
          </div>
        </div>

      </main>

      <Footer />
      <WhatsAppBtn />
    </div>
  );
}
