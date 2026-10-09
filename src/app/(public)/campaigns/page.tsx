import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, CheckCircle2, Megaphone, Sparkles, Tag, ShieldCheck, Clock } from 'lucide-react';
import { CampaignService } from '@/services/campaign.service';
import { parseCampaignContent } from '@/lib/campaign-helper';
import { syncCampaignAssets } from '@/lib/server-assets';

export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Active Health Campaigns & Offers | AiCura Diagnostics',
  description:
    'Discover limited-time diagnostic campaigns, preventive wellness drives, and health packages with doorstep sample collection.',
};

export default async function CampaignsListingPage() {
  syncCampaignAssets();

  const campaigns = await CampaignService.listCampaigns({ isActive: true }).catch(() => []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* 1. Page Header Banner matching website theme */}
      <section className="relative w-full h-[40vh] min-h-[260px] bg-white border-b border-slate-200 shadow-sm overflow-hidden flex items-center">
        <Image
          src="/campaigns-packages-banner.webp"
          alt="Active Health Campaigns - AiCura Diagnostics"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center w-full h-full"
        />
        {/* Dark overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/55 to-black/30 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl space-y-3 text-left">
              <span className="inline-flex items-center gap-1.5 text-slate-950 bg-[#f5b324] font-extrabold text-xs uppercase tracking-wider px-3.5 py-1 rounded-full shadow-sm">
                Special Promotional Drives
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
                Active Health Campaigns
              </h1>
              <p className="text-slate-200 text-sm sm:text-base font-normal max-w-xl leading-relaxed">
                Take charge of your wellness with our specialized diagnostic checkup campaigns. Expert certified testing, transparent reports, and doorstep sample collection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Main Campaigns Listing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex-1 w-full">
        {campaigns.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-sm space-y-4">
            <div className="w-14 h-14 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
              <Megaphone className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No Active Campaigns Right Now</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              We update our special diagnostic campaigns regularly. In the meantime, explore our full catalog of health checkup packages.
            </p>
            <Link
              href="/packages"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-brand-700 text-white font-bold text-xs rounded-xl hover:bg-brand-800 transition-colors"
            >
              <span>Explore Health Packages</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {campaigns.map((campaign) => {
              const parsed = parseCampaignContent(campaign);
              const cardImage =
                campaign.heroImageUrl && !campaign.heroImageUrl.includes('unsplash')
                  ? campaign.heroImageUrl
                  : '/senior-couple.webp';

              return (
                <div
                  key={campaign.id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:-translate-y-1"
                >
                  <div>
                    {/* Campaign Image */}
                    <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
                      <Image
                        src={cardImage}
                        alt={campaign.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                      {/* Badge */}
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 bg-white/95 backdrop-blur-xs text-teal-900 font-extrabold text-[11px] px-3 py-1 rounded-full shadow-sm">
                          <Tag className="w-3 h-3 text-teal-700" />
                          <span>{parsed.badgeText || campaign.name}</span>
                        </span>
                      </div>

                      {/* Discount Tag */}
                      {parsed.discount && (
                        <div className="absolute top-3 right-3">
                          <span className="bg-[#f5b324] text-slate-950 font-black text-xs px-2.5 py-1 rounded-lg shadow-sm">
                            {parsed.discount}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Content Body */}
                    <div className="p-6 space-y-3.5">
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug line-clamp-2">
                        {campaign.title}
                      </h3>

                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                        {parsed.overview || campaign.subtitle || 'Special diagnostic checkup with comprehensive testing and home collection.'}
                      </p>

                      {/* Highlights */}
                      {parsed.highlights.length > 0 && (
                        <div className="space-y-1.5 pt-1 border-t border-slate-100">
                          {parsed.highlights.slice(0, 3).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span className="truncate">{item}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer & CTA */}
                  <div className="p-6 pt-0 border-t border-slate-100 flex items-center justify-between gap-3 mt-auto">
                    {/* Price */}
                    <div>
                      {parsed.originalPrice && (
                        <span className="text-[11px] text-slate-400 line-through block">
                          ₹{parsed.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                      <span className="text-xl font-black text-slate-900">
                        ₹{parsed.price.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* View Campaign CTA */}
                    <Link
                      href={`/campaigns/${campaign.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-700 hover:bg-brand-800 active:bg-brand-900 text-yellow-400 font-extrabold text-xs rounded-xl shadow-xs transition-all group-hover:scale-102"
                    >
                      <span>View Offer</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
