'use client';

import React from 'react';
import { CampaignItem } from '@/types';
import { parseCampaignContent } from '@/lib/campaign-helper';
import { CampaignHeader } from './CampaignHeader';
import { CampaignLandingHero } from './CampaignLandingHero';
import { CampaignIncludedServices } from './CampaignIncludedServices';
import { CampaignWhyChoose } from './CampaignWhyChoose';
import { CampaignHowItWorks } from './CampaignHowItWorks';
import { CampaignFaqSection } from './CampaignFaqSection';
import { CampaignFinalCta } from './CampaignFinalCta';
import { CampaignFooter } from './CampaignFooter';

interface CampaignLandingViewProps {
  campaign?: CampaignItem | null;
}

const FALLBACK_CAMPAIGN: CampaignItem = {
  id: 'senior-health-checkup',
  name: 'Senior Health Campaign',
  slug: 'senior-care-special',
  title: 'Comprehensive Senior Health Checkup',
  subtitle: 'Stay healthy. Stay active. A complete health assessment designed for senior citizens.',
  description: '',
  heroImageUrl: '/senior-couple.jpg',
  ctaText: 'Book Senior Health Package',
  ctaLink: '#campaign-enquiry-card',
  seoTitle: 'Comprehensive Senior Health Checkup | AiCura Diagnostics',
  seoDescription: '72+ tests for complete senior health assessment with free home sample collection.',
  isActive: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

export function CampaignLandingView({ campaign }: CampaignLandingViewProps) {
  const effectiveCampaign = campaign || FALLBACK_CAMPAIGN;
  const parsedData = parseCampaignContent(effectiveCampaign);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900 overflow-x-hidden">
      {/* 1. Dedicated Minimal Campaign Header */}
      <CampaignHeader
        phone="98479 86333"
        whatsappNumber="9847986333"
        campaignTitle={effectiveCampaign.title}
      />

      <main>
        {/* 2. Hero / Campaign Banner with Embedded Direct Enquiry Card */}
        <CampaignLandingHero campaign={effectiveCampaign} data={parsedData} />

        {/* 3. What's Included: Compact Diagnostic Cards Grid */}
        <CampaignIncludedServices
          items={parsedData.includedServices}
          campaignTitle={effectiveCampaign.title}
          sectionTitle={parsedData.includedHeading}
        />

        {/* 4. Why Choose This Campaign: 4 Benefit Cards with Hardcoded Mint Icons */}
        <CampaignWhyChoose benefits={parsedData.benefits} />

        {/* 5. How It Works: 4-Step Process (Hardcoded) */}
        <CampaignHowItWorks />

        {/* 6. Dynamic Campaign FAQs Accordion */}
        <CampaignFaqSection faqs={parsedData.faqs} />

        {/* 7. Final High-Impact CTA Banner */}
        <CampaignFinalCta title={effectiveCampaign.title} data={parsedData} />
      </main>

      {/* 8. Dedicated Minimal Campaign Footer */}
      <CampaignFooter
        phone="98479 86333"
        whatsappNumber="9847986333"
        campaignTitle={effectiveCampaign.title}
      />
    </div>
  );
}

export default CampaignLandingView;
