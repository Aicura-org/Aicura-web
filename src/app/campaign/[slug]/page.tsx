import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBtn from '@/components/layout/WhatsAppBtn';
import { CampaignService } from '@/services/campaign.service';
import CampaignEnquiryForm from '@/components/campaign/CampaignEnquiryForm';
import { ShieldCheck, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await CampaignService.getCampaignBySlug(slug);

  if (!campaign || !campaign.isActive) {
    return { title: 'Campaign Not Found | AiCura Diagnostics' };
  }

  return {
    title: campaign.seoTitle || `${campaign.title} | AiCura Diagnostics`,
    description: campaign.seoDescription || campaign.description || 'Book diagnostic packages with free home sample collection.',
  };
}

export default async function CampaignPublicPage({ params }: Props) {
  const { slug } = await params;
  const campaign = await CampaignService.getCampaignBySlug(slug);

  if (!campaign || !campaign.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 flex flex-col justify-between">
      <Header />

      <main className="flex-1 pb-16 space-y-12">
        {/* Campaign Hero Banner */}
        <section className="bg-brand-900 text-white relative overflow-hidden py-12 md:py-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-700/40 rounded-full blur-3xl pointer-events-none" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Headline & Info */}
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-yellow-400 text-brand-900 uppercase tracking-wide">
                  <Sparkles className="w-3.5 h-3.5" /> Special Diagnostic Drive
                </span>

                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight font-sans">
                  {campaign.title}
                </h1>

                {campaign.subtitle && (
                  <p className="text-lg text-emerald-300 font-medium">{campaign.subtitle}</p>
                )}

                {campaign.description && (
                  <p className="text-sm text-slate-200 leading-relaxed max-w-2xl">{campaign.description}</p>
                )}

                <div className="pt-4 flex flex-wrap gap-4 text-xs font-semibold text-slate-200">
                  <div className="flex items-center gap-2 bg-brand-800/80 px-3.5 py-2 rounded-xl border border-brand-700">
                    <CheckCircle2 className="w-4 h-4 text-yellow-400" /> Free Home Sample Collection
                  </div>
                  <div className="flex items-center gap-2 bg-brand-800/80 px-3.5 py-2 rounded-xl border border-brand-700">
                    <Clock className="w-4 h-4 text-yellow-400" /> Reports in 24 Hours
                  </div>
                  <div className="flex items-center gap-2 bg-brand-800/80 px-3.5 py-2 rounded-xl border border-brand-700">
                    <ShieldCheck className="w-4 h-4 text-yellow-400" /> NABL Accredited Accuracy
                  </div>
                </div>
              </div>

              {/* Inline Booking Form Card */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 text-slate-900 space-y-4">
                  <div className="border-b border-slate-100 pb-3">
                    <h3 className="text-xl font-bold text-slate-900">Claim Campaign Offer</h3>
                    <p className="text-xs text-slate-500">Fill in your details for instant callback & home collection scheduling.</p>
                  </div>

                  <CampaignEnquiryForm campaignId={campaign.id} campaignSlug={campaign.slug} ctaText={campaign.ctaText} />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Campaign Content Sections */}
        {campaign.sections && campaign.sections.length > 0 && (
          <section className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">
            <h2 className="text-2xl font-bold text-slate-900 text-center font-sans">Drive Information & Benefits</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {campaign.sections.map((sec, idx) => (
                <div key={sec.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-brand-700 font-bold flex items-center justify-center text-xs">
                    0{idx + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{sec.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">{sec.content}</p>
                </div>
              ))}
            </div>
          </section>
        )}

      </main>

      <Footer />
      <WhatsAppBtn />
    </div>
  );
}
