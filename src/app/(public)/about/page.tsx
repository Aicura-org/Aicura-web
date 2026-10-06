'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { ShieldCheck, Award, Heart, Users, Microchip, Star, BadgeCheck, TrendingUp } from 'lucide-react';

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
  badge1Title: 'Certified Standard',
  badge1Subtitle: 'Quality Assured Testing',
  badge2Title: '99.8% Precision',
  badge2Subtitle: 'Double Verified Results',
  badge3Text: '10,000+ Happy Patients',
};

const stats = [
  { value: '10,000+', label: 'Happy Patients' },
  { value: '99.8%', label: 'Report Accuracy' },
  { value: '500+', label: 'Tests Available' },
  { value: '6–24h', label: 'Report Delivery' },
];

const values = [
  {
    icon: Microchip,
    title: 'Cutting-Edge Technology',
    desc: 'Fully automated hematology and biochemistry analyzers to eliminate human error and deliver consistent results.',
  },
  {
    icon: Users,
    title: 'Expert Pathologists',
    desc: 'Supervised by veteran senior pathologists and certified lab technologists with decades of experience.',
  },
  {
    icon: Heart,
    title: 'Patient-Centric Care',
    desc: 'Fast report turnarounds and compassionate doorstep collection services — healthcare on your terms.',
  },
];

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
    <div className="min-h-screen flex flex-col bg-[#f8faf9]">

      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[340px] sm:h-[440px] overflow-hidden">
        <Image
          src="/Modern Clinic about us page.png"
          alt="AiCura Diagnostics — doctor consulting patient"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* layered scrims for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 via-brand-900/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 via-transparent to-transparent" />

        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <div className="max-w-lg space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest bg-yellow-400 text-brand-900 px-3 py-1.5 rounded-full shadow">
                <BadgeCheck className="w-3.5 h-3.5" /> Accredited Diagnostic Laboratory
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
                About AiCura<br />
                <span className="text-yellow-400">Diagnostics</span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Delivering gold-standard clinical pathology, advanced diagnostic precision, and compassionate healthcare.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <div className="bg-brand-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-brand-700">
            {stats.map((s) => (
              <div key={s.label} className="py-5 px-6 text-center">
                <p className="text-2xl font-extrabold text-yellow-400">{s.value}</p>
                <p className="text-xs text-slate-300 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex-1 w-full space-y-20">

        {/* ── Our Story ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          {/* Text */}
          <div className="space-y-5">
            <span className="inline-block text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
              Our Journey &amp; Mission
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
              {about.titlePrefix}{' '}
              <span className="text-brand-700">{about.titleHighlight}</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {about.description}
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              From routine blood screenings to specialized hormonal and genetic panels, every specimen undergoes rigorous multi-tier quality checks to ensure flawless clinical accuracy.
            </p>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{about.badge1Title}</p>
                  <p className="text-[11px] text-slate-500">{about.badge1Subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-9 h-9 rounded-xl bg-yellow-100 flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">{about.badge2Title}</p>
                  <p className="text-[11px] text-slate-500">{about.badge2Subtitle}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative h-[420px] w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-100">
              <Image
                src={about.imageUrl || defaultAbout.imageUrl}
                alt="AiCura Diagnostic Laboratory facility"
                fill
                className="object-cover"
              />
              {/* floating rating card */}
              <div className="absolute bottom-5 left-5 bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-xl border border-slate-100 flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Star className="w-4 h-4 text-yellow-500 fill-yellow-400" />
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">4.9 / 5 Rating</p>
                  <p className="text-[11px] text-slate-500">10,000+ verified reviews</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Core Values ── */}
        <div>
          <div className="text-center mb-10 space-y-2">
            <span className="inline-block text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
              What Drives Us
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">Our Core Values</h2>
            <p className="text-slate-500 text-sm max-w-md mx-auto">The principles behind every report we deliver.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300 p-8 space-y-4 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center group-hover:bg-brand-700 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-brand-700 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-base font-bold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Trust Banner ── */}
        <div className="relative bg-brand-800 rounded-3xl overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-brand-700/50 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-10">
            <div className="space-y-2 text-center sm:text-left">
              <p className="text-yellow-400 text-xs font-bold uppercase tracking-widest">Certified Laboratory</p>
              <h3 className="text-2xl font-extrabold text-white">Trusted by Thousands of Families</h3>
              <p className="text-slate-300 text-sm max-w-md">
                Our lab operates under the highest national quality standards — so you and your family always get results you can count on.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <TrendingUp className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-bold text-sm whitespace-nowrap">99.8% Accuracy Rate</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
