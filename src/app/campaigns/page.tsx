import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBtn from '@/components/layout/WhatsAppBtn';
import { CampaignService } from '@/services/campaign.service';
import {
  Megaphone,
  Calendar,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  Package,
  Activity,
  Award,
} from 'lucide-react';

export const revalidate = 60; // Revalidate every minute

export const metadata: Metadata = {
  title: 'Special Health Campaigns & Drives | AiCura Diagnostics',
  description:
    'Explore our special diagnostic campaigns, seasonal health checkup drives, and limited-time wellness packages at AiCura Diagnostics.',
};

export default async function CampaignsPage() {
  const campaigns = await CampaignService.listCampaigns({ isActive: true }).catch(() => []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <Header />

      <main className="flex-1 pb-16">
        {/* Hero Banner Section */}
        <section className="bg-brand-900 text-white relative overflow-hidden py-14 md:py-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-700/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-yellow-400/20 text-yellow-300 border border-yellow-400/30">
                <Megaphone className="w-3.5 h-3.5" /> Exclusive Diagnostic Initiatives
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Health & Diagnostic <span className="text-yellow-400">Campaigns</span>
              </h1>

              <p className="text-slate-200 text-sm sm:text-base leading-relaxed">
                Take proactive control of your wellness with seasonal screening drives, special diagnostic
                packages, and community health initiatives designed for your family.
              </p>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          {campaigns.length > 0 ? (
            /* Active Campaigns Grid */
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-xs font-bold text-slate-700 flex items-center gap-2">
                  <Megaphone className="w-4 h-4 text-yellow-500" />
                  Showing <span className="text-brand-700 font-extrabold">{campaigns.length}</span> active campaign{campaigns.length > 1 ? 's' : ''}
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  ● Live Offers
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
                  >
                    {/* Card Header / Image */}
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
                        <div className="h-32 bg-gradient-to-br from-brand-800 to-brand-900 p-6 flex items-center justify-between text-white relative overflow-hidden">
                          <div className="absolute right-0 bottom-0 opacity-10 translate-x-4 translate-y-4">
                            <Megaphone className="w-32 h-32" />
                          </div>
                          <div className="space-y-1 z-10">
                            <span className="text-[10px] font-bold tracking-widest uppercase text-yellow-400 bg-brand-950/60 px-2.5 py-1 rounded-full">
                              Special Drive
                            </span>
                            <h3 className="text-base font-bold text-white line-clamp-1">{camp.name}</h3>
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 right-3">
                        <span className="text-[10px] font-bold bg-emerald-500 text-white px-2.5 py-1 rounded-full shadow-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> Active
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md inline-block">
                          {camp.name}
                        </span>
                        <h2 className="text-lg font-bold text-slate-900 group-hover:text-brand-700 transition-colors line-clamp-2">
                          {camp.title}
                        </h2>
                        {camp.subtitle && (
                          <p className="text-xs font-medium text-emerald-700 line-clamp-2">
                            {camp.subtitle}
                          </p>
                        )}
                        {camp.description && (
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {camp.description}
                          </p>
                        )}
                      </div>

                      {/* Benefits & Action */}
                      <div className="space-y-3 pt-3 border-t border-slate-100">
                        <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 font-medium">
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
            /* Modern Empty State (When no campaigns are active) */
            <div className="space-y-12">
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-14 text-center max-w-3xl mx-auto space-y-6 relative overflow-hidden">
                {/* Ambient background decoration */}
                <div className="absolute -top-16 -right-16 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-brand-700/10 rounded-full blur-2xl pointer-events-none" />

                {/* Icon Badge */}
                <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-brand-900 to-brand-700 text-yellow-400 flex items-center justify-center shadow-xl shadow-brand-900/10 border-2 border-yellow-400/40 relative">
                  <Megaphone className="w-10 h-10 sm:w-12 sm:h-12 text-yellow-400" />
                  <span className="absolute -top-1 -right-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-yellow-500"></span>
                  </span>
                </div>

                {/* Texts */}
                <div className="space-y-2.5 max-w-lg mx-auto">
                  <div className="inline-block px-3 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wider">
                    Upcoming Seasonal Drives
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-sans tracking-tight">
                    No Active Campaigns Right Now
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    We regularly launch specialized health screening drives, seasonal wellness initiatives, and family diagnostic discount campaigns. Our next drive will be announced here shortly!
                  </p>
                </div>

                {/* Action CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <Link
                    href="/packages"
                    className="w-full sm:w-auto px-6 py-3 rounded-full gold-gradient text-brand-900 font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    <Package className="w-4 h-4" /> Explore Health Packages
                  </Link>

                  <Link
                    href="/home-collection"
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-brand-800 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow transition-colors flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-4 h-4 text-yellow-400" /> Book Home Collection
                  </Link>
                </div>

                {/* Helpline info */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
                  <span>Need custom health checkup inquiries?</span>
                  <a
                    href="tel:+919946284615"
                    className="font-bold text-brand-700 hover:text-brand-900 flex items-center gap-1"
                  >
                    <Phone className="w-3.5 h-3.5 text-yellow-500" /> +91 99462 84615
                  </a>
                </div>
              </div>

              {/* Value proposition cards */}
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="text-center space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 font-sans">
                    Available Diagnostic Services All Year Round
                  </h3>
                  <p className="text-xs text-slate-500">
                    Even when special drives are not active, you always enjoy our top-tier diagnostic services:
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">NABL Accredited Accuracy</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Advanced lab equipment ensuring 99.9% accurate and reliable test parameters.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-yellow-100 text-brand-900 flex items-center justify-center font-bold">
                      <Activity className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Doorstep Home Collection</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Certified phlebotomists collect samples safely at your preferred date & time.
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 text-center">
                    <div className="w-10 h-10 mx-auto rounded-xl bg-brand-100 text-brand-900 flex items-center justify-center font-bold">
                      <Award className="w-5 h-5" />
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">Same-Day Digital Reports</h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Receive verified digital reports directly on your WhatsApp and email within 24 hours.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
      <WhatsAppBtn />
    </div>
  );
}
