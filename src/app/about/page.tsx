'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBtn from '@/components/layout/WhatsAppBtn';
import { ShieldCheck, Award, Heart, Users, Microchip } from 'lucide-react';

interface AboutData {
  badgeText: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  imageUrl: string;
  badge1Title: string;
  badge1Subtitle: string;
  badge2Title: string;
  badge2Subtitle: string;
  badge3Text: string;
}

const defaultAbout: AboutData = {
  badgeText: 'About AiCura Diagnostics',
  titlePrefix: 'Pioneering Clinical Precision &',
  titleHighlight: 'Trusted Healthcare.',
  description:
    'At AiCura Diagnostics, we believe accurate diagnostics are the cornerstone of effective healthcare. Combining state-of-the-art laboratory automation with seasoned medical pathologists, we deliver trustworthy, high-precision results for you and your family.',
  imageUrl:
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000',
  badge1Title: 'NABL Standard',
  badge1Subtitle: 'Quality Assured Testing',
  badge2Title: '99.8% Precision',
  badge2Subtitle: 'Double Verified Results',
  badge3Text: '10,000+ Happy Patients',
};

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData>(defaultAbout);

  useEffect(() => {
    async function loadAbout() {
      try {
        const res = await fetch('/api/about');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setAbout({
              badgeText: json.data.badgeText || defaultAbout.badgeText,
              titlePrefix: json.data.titlePrefix || defaultAbout.titlePrefix,
              titleHighlight: json.data.titleHighlight || defaultAbout.titleHighlight,
              description: json.data.description || defaultAbout.description,
              imageUrl: json.data.imageUrl || defaultAbout.imageUrl,
              badge1Title: json.data.badge1Title || defaultAbout.badge1Title,
              badge1Subtitle: json.data.badge1Subtitle || defaultAbout.badge1Subtitle,
              badge2Title: json.data.badge2Title || defaultAbout.badge2Title,
              badge2Subtitle: json.data.badge2Subtitle || defaultAbout.badge2Subtitle,
              badge3Text: json.data.badge3Text || defaultAbout.badge3Text,
            });
          }
        }
      } catch (err) {
        console.error('Failed fetching dynamic about info:', err);
      }
    }
    loadAbout();
  }, []);

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
              {about.titlePrefix} {about.titleHighlight}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {about.description}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              From routine blood screenings to specialized hormonal and genetic panels, every specimen undergoes rigorous multi-tier quality checks to ensure flawless clinical accuracy.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4 text-xs font-semibold text-slate-800">
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>{about.badge1Title}</span>
              </div>
              <div className="flex items-center gap-2 bg-white p-3 rounded-xl border border-slate-200 shadow-2xs">
                <Award className="w-5 h-5 text-yellow-500" />
                <span>{about.badge2Title}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-xl bg-slate-900">
              <Image
                src={about.imageUrl || defaultAbout.imageUrl}
                alt="AiCura Diagnostic Laboratory facility"
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
