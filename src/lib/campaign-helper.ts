import { CampaignItem } from '@/types';

export interface CampaignIncludedItem {
  title: string;
  description?: string;
  icon?: string;
}

export interface CampaignBenefitItem {
  title: string;
  description: string;
  icon?: string;
}

export interface CampaignFaqItem {
  question: string;
  answer: string;
}

export interface ParsedCampaignData {
  badgeText: string;
  price: number;
  originalPrice: number | null;
  discount: string;
  highlights: string[];
  includedHeading?: string;
  includedServices: CampaignIncludedItem[];
  benefits: CampaignBenefitItem[];
  faqs: CampaignFaqItem[];
  overview: string;
}

export const DEFAULT_HIGHLIGHTS = [
  '72+ Important Tests',
  'Home Sample Collection',
  'Fast Reports in 24 Hours',
  'Senior-Focused Package',
];

export const DEFAULT_INCLUDED_SERVICES: CampaignIncludedItem[] = [
  {
    title: 'Complete Blood Count (CBC)',
    description: 'Hemoglobin, RBC, WBC & Platelets',
    icon: 'droplet',
  },
  {
    title: 'Diabetes Screening',
    description: 'Fasting Blood Sugar & HbA1c',
    icon: 'activity',
  },
  {
    title: 'Liver Function Test (LFT)',
    description: 'SGPT, SGOT, Bilirubin & Proteins',
    icon: 'flask',
  },
  {
    title: 'Kidney Function Test (KFT)',
    description: 'Creatinine, Blood Urea & Uric Acid',
    icon: 'shield',
  },
  {
    title: 'Lipid Profile (Cholesterol)',
    description: 'Total Cholesterol, HDL & LDL',
    icon: 'heart',
  },
  {
    title: 'Thyroid Profile (TSH, T3, T4)',
    description: 'Metabolic & Hormonal Screening',
    icon: 'zap',
  },
  {
    title: 'Vitamin Levels (B12, D)',
    description: 'Bone & Nerve Vitality',
    icon: 'sun',
  },
  {
    title: 'Cardiac Risk Markers',
    description: 'Cardiovascular Risk Assessment',
    icon: 'cardiac',
  },
];

export const DEFAULT_BENEFITS: CampaignBenefitItem[] = [
  {
    title: 'Convenient Home Collection',
    description: 'Our trained staff will collect the sample from your home at your preferred time.',
    icon: 'home',
  },
  {
    title: 'Senior-Focused Tests',
    description: 'Tests selected based on common age-related health concerns.',
    icon: 'shield',
  },
  {
    title: 'Fast & Digital Reports',
    description: 'Get your reports within 24 hours in digital format.',
    icon: 'file',
  },
  {
    title: 'Trusted by Families',
    description: 'Accurate reports and professional support from our expert team.',
    icon: 'users',
  },
];

export const DEFAULT_FAQS: CampaignFaqItem[] = [
  {
    question: 'Is home sample collection available?',
    answer:
      'Yes, our certified phlebotomists collect blood and urine samples from your doorstep at your preferred time slot.',
  },
  {
    question: 'How soon will I get the reports?',
    answer:
      'Your verified digital reports are delivered directly on WhatsApp and Email within 24 hours of sample collection.',
  },
  {
    question: 'Do I need to fast for these tests?',
    answer:
      'Yes, 10 to 12 hours of overnight fasting is recommended for accurate Blood Sugar and Lipid profile evaluations. Plain water is permitted.',
  },
  {
    question: 'What areas do you cover?',
    answer:
      'We provide doorstep sample collection across Kozhikode, Malappuram, and major districts in Kerala.',
  },
  {
    question: 'How do I book this package?',
    answer:
      'Simply submit your details on this page or message us on WhatsApp. Our team will call you within 15 minutes to confirm.',
  },
  {
    question: 'Can I reschedule my appointment?',
    answer:
      'Yes, you can easily reschedule your home collection slot at any time by contacting our helpline or WhatsApp.',
  },
];

export function parseCampaignContent(campaign: CampaignItem): ParsedCampaignData {
  let parsedJson: any = null;

  if (campaign.description && campaign.description.trim().startsWith('{')) {
    try {
      parsedJson = JSON.parse(campaign.description);
    } catch {
      parsedJson = null;
    }
  }

  const badgeText =
    parsedJson?.badgeText ||
    campaign.subtitle ||
    'SPECIAL DIAGNOSTIC CAMPAIGN';

  const price = typeof parsedJson?.price === 'number' ? parsedJson.price : 2499;
  const originalPrice =
    typeof parsedJson?.originalPrice === 'number' ? parsedJson.originalPrice : 5999;

  let discount = parsedJson?.discount;
  if (!discount && originalPrice && originalPrice > price) {
    const pct = Math.round(((originalPrice - price) / originalPrice) * 100);
    discount = `${pct}% OFF`;
  } else if (!discount) {
    discount = '58% OFF';
  }

  const highlights =
    Array.isArray(parsedJson?.highlights) && parsedJson.highlights.length > 0
      ? parsedJson.highlights
      : DEFAULT_HIGHLIGHTS;

  const includedHeading =
    parsedJson?.includedHeading || '72+ Tests for Complete Senior Health Assessment';

  const includedServices =
    Array.isArray(parsedJson?.includedServices) && parsedJson.includedServices.length > 0
      ? parsedJson.includedServices
      : DEFAULT_INCLUDED_SERVICES;

  const benefits =
    Array.isArray(parsedJson?.benefits) && parsedJson.benefits.length > 0
      ? parsedJson.benefits
      : DEFAULT_BENEFITS;

  const faqs =
    Array.isArray(parsedJson?.faqs) && parsedJson.faqs.length > 0
      ? parsedJson.faqs
      : DEFAULT_FAQS;

  const overview =
    parsedJson?.overview ||
    (parsedJson ? '' : campaign.description) ||
    'Stay healthy. Stay active. A complete health assessment designed for senior citizens.';

  return {
    badgeText,
    price,
    originalPrice,
    discount,
    highlights,
    includedHeading,
    includedServices,
    benefits,
    faqs,
    overview,
  };
}

export function serializeCampaignContent(data: {
  overview: string;
  badgeText: string;
  price: number;
  originalPrice?: number | null;
  discount: string;
  highlights: string[];
  includedHeading?: string;
  includedServices: CampaignIncludedItem[];
  benefits: CampaignBenefitItem[];
  faqs: CampaignFaqItem[];
}): string {
  return JSON.stringify({
    overview: data.overview,
    badgeText: data.badgeText,
    price: data.price,
    originalPrice: data.originalPrice,
    discount: data.discount,
    highlights: data.highlights,
    includedHeading: data.includedHeading,
    includedServices: data.includedServices,
    benefits: data.benefits,
    faqs: data.faqs,
  });
}
