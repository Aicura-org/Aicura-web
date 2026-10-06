import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { CampaignService } from '@/services/campaign.service';
import { parseCampaignContent } from '@/lib/campaign-helper';
import CampaignLandingView from '@/components/campaign/CampaignLandingView';
import { syncCampaignAssets } from '@/lib/server-assets';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const campaign = await CampaignService.getCampaignBySlug(slug);

  if (!campaign || !campaign.isActive) {
    return { title: 'Campaign Not Found | AiCura Diagnostics' };
  }

  const parsed = parseCampaignContent(campaign);

  return {
    title: campaign.seoTitle || `${campaign.title} | AiCura Diagnostics`,
    description: campaign.seoDescription || parsed.overview || 'Book preventive health checkup packages with free doorstep sample collection.',
    openGraph: {
      title: campaign.seoTitle || campaign.title,
      description: campaign.seoDescription || parsed.overview || '',
      images: campaign.heroImageUrl ? [{ url: campaign.heroImageUrl }] : [],
    },
  };
}

export default async function CampaignPublicPage({ params }: Props) {
  syncCampaignAssets();
  const { slug } = await params;
  const campaign = await CampaignService.getCampaignBySlug(slug);

  if (!campaign || !campaign.isActive) {
    notFound();
  }

  return <CampaignLandingView campaign={campaign} />;
}
