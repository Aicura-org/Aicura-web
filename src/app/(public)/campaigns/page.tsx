import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { CampaignService } from '@/services/campaign.service';
import {
  Megaphone, Calendar, ArrowRight,
  ShieldCheck, CheckCircle2, Clock,
  Phone, Package, Activity, Award, BadgeCheck,
} from 'lucide-react';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Special Health Campaigns & Drives | AiCura Diagnostics',
  description:
    'Explore our special diagnostic campaigns, seasonal health checkup drives, and limited-time wellness packages at AiCura Diagnostics.',
};

const alwaysOnServices = [
  {
    icon: ShieldCheck,
    color: 'bg-emerald-100 text-emerald-700',
    title: 'NABL Accredited Accuracy',
    desc: 'Advanced lab equipment ensuring 99.9% accurate and reliable test parameters.',
  },
  {
    icon: Activity,
    color: 'bg-yellow-100 text-yellow-700',
    title: 'Doorstep Home Collection',
    desc: 'Certified phlebotomists collect samples safely at your preferred date & time.',
  },
  {
    icon: Award,
    color: 'bg-brand-100 text-brand-700',
    title: 'Same-Day Digital Reports',
    desc: 'Receive verified digital reports directly on your WhatsApp and email within 24 hours.',
  },
];

export default async function CampaignsPage() {
  const campaigns = await CampaignService.listCampaigns({ isActive: true }).catch(() => []);

  return (
    <div className="min-h-screen bg-[#f8faf9] font-sans text-slate-800 flex flex-col">
      <main className="flex-1 pb-16">

        {/* ── Hero Banner ── */}
        <section className="relative w-full h-[340px] sm:h-[440px] overflow-hidden">
          <Image
            src="/Modern Healthcare campaign page.png"
            alt="AiCura Health Campaigns & Diagnostic Drives"
            fill priority sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-900/80 via-brand-900/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/40 via-transparent to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
              <div className="max-w-lg space-y-4">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest bg-yellow-400 text-brand-900 px-3 py-1.5 rounded-full shadow">
                  <Megaphone className="w-3.5 h-3.5" /> Exclusive Diagnostic Initiatives
                </span>
                <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
                  Health &amp; Diagnostic<br />
                  <span className="text-yellow-400">Campaigns</span>
                </h1>
                <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                  Take proactive control of your wellness with seasonal screening drives, special diagnostic packages, and community health initiatives.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {campaigns.length > 0 ? (
            /* ── Active Campaigns Grid ── */
            <div className="space-y-8">
              {/* toolbar */}
              <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-100 shadow-sm">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-yellow-500" />
                  Showing <span className="text-brand-700 font-extrabold">{campaigns.length}</span> active campaign{campaigns.length > 1 ? 's' : ''}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Live Offers
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group hover:-translate-y-1"
                  >
                    {/* image or fallback */}
                    <div className="relative">
                      {camp.heroImageUrl ? (
                        <div className="h-48 w-full overflow-hidden bg-slate-100">
                          <img
                            src={camp.heroImageUrl}
                            alt={camp.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      ) : (
                        <div className="h-36 bg-brand-800 flex items-end p-5 relative overflow-hidden">
                          <div className="absolute right-4 bottom-2 opacity-10">
                            <Megaphone className="w-28 h-28" />
                          </div>
                          <span className="text-[10px] font-bold tracking-widest uppercase text-yellow-400 bg-brand-900/60 px-2.5 py-1 rounded-full z-10">
                            Special Drive
                          </span>
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Active
                        </span>
                      </div>
                    </div>

                    {/* body */}
                    <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-md inline-block">
                          {camp.name}
                        </span>
                        <h2 className="text-base font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2">
                          {camp.title}
                        </h2>
                        {camp.subtitle && (
                          <p className="text-xs font-medium text-emerald-700 line-clamp-2">{camp.subtitle}</p>
                        )}
                        {camp.description && (
                          <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{camp.description}</p>
                        )}
                      </div>

                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 font-medium">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Home Collection</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                            <span>Fast Reports</span>
                          </div>
                        </div>
                        <Link
                          href={`/campaign/${camp.slug}`}
                          className="w-full py-2.5 px-4 rounded-xl gold-gradient text-brand-900 font-bold text-xs shadow hover:shadow-md flex items-center justify-center gap-2 group-hover:scale-[1.02] transition-transform"
                        >
                          <span>{camp.ctaText || 'View Campaign & Claim'}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* ── Empty State ── */
            <div className="space-y-14">

              {/* empty card */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10 sm:p-16 text-center max-w-2xl mx-auto space-y-7 relative overflow-hidden">
                <div className="absolute -top-20 -right-20 w-56 h-56 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-brand-700/10 rounded-full blur-3xl pointer-events-none" />

                {/* icon */}
                <div className="w-20 h-20 mx-auto rounded-3xl bg-brand-800 flex items-center justify-center shadow-xl border-2 border-yellow-400/40 relative">
                  <Megaphone className="w-10 h-10 text-yellow-400" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500" />
                  </span>
                </div>

                <div className="space-y-2 max-w-md mx-auto">
                  <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                    Upcoming Seasonal Drives
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    No Active Campaigns Right Now
                  </h2>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    We regularly launch specialized health screening drives, seasonal wellness initiatives, and family diagnostic packages. Our next drive will be announced here shortly!
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/packages"
                    className="w-full sm:w-auto px-6 py-3 rounded-full gold-gradient text-brand-900 font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" /> Explore Health Packages
                  </Link>
                  <Link
                    href="/home-collection"
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-800 hover:bg-brand-700 text-white font-bold text-sm shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-yellow-400" /> Book Home Collection
                  </Link>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <span>Need custom health checkup inquiries?</span>
                  <a href="tel:+919946284615" className="font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-yellow-500" /> +91 99462 84615
                  </a>
                </div>
              </div>

              {/* always-on services */}
              <div>
                <div className="text-center mb-8 space-y-2">
                  <span className="inline-block text-xs font-bold text-brand-700 uppercase tracking-wider bg-brand-50 border border-brand-100 px-3 py-1 rounded-full">
                    Always Available
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900">Diagnostic Services All Year Round</h3>
                  <p className="text-sm text-slate-500">Even when special drives are inactive, you get our top-tier services.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {alwaysOnServices.map(({ icon: Icon, color, title, desc }) => (
                    <div
                      key={title}
                      className="bg-white p-7 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all duration-300 space-y-3 text-center group hover:-translate-y-1"
                    >
                      <div className={`w-12 h-12 mx-auto rounded-2xl ${color} flex items-center justify-center`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <h4 className="text-sm font-bold text-slate-900">{title}</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* helpline banner */}
              <div className="relative bg-brand-800 rounded-3xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-brand-700/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-10 py-8">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="text-yellow-400 text-[11px] font-bold uppercase tracking-widest">NABL Accredited Lab</p>
                    <h3 className="text-xl font-extrabold text-white">Questions? We&apos;re Here to Help</h3>
                    <p className="text-slate-300 text-sm">Talk to our health experts about the right tests for your family.</p>
                  </div>
                  <a
                    href="tel:+919946284615"
                    className="shrink-0 flex items-center gap-2.5 bg-yellow-400 hover:bg-yellow-300 text-brand-900 font-bold text-sm px-6 py-3 rounded-full shadow-lg transition-all hover:scale-105"
                  >
                    <Phone className="w-4 h-4" /> +91 99462 84615
                  </a>
                </div>
              </div>

            </div>
          )}
        </section>
      </main>
    </div>
  );
}
