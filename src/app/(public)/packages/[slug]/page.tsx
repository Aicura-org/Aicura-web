import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PackageService } from '@/services/package.service';
import { CompanyService } from '@/services/company.service';
import PackageDetailClient from './PackageDetailClient';

interface Props {
  params: Promise<{ slug: string }>;
}

async function getPackage(paramSlug: string) {
  let pkg = await PackageService.getPackageBySlug(paramSlug);
  if (!pkg) {
    pkg = await PackageService.getPackageById(paramSlug);
  }
  return pkg;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg || !pkg.isPublished) {
    return { title: 'Health Package Not Found | AiCura Diagnostics' };
  }

  const title = `${pkg.title} | Health Checkup Package | AiCura Diagnostics`;
  const description = `${pkg.description} Includes ${pkg.testCount}+ parameters with free doorstep sample collection across Kochi & Kerala. Doctor verified reports within 24 hours.`;
  const images = pkg.imageUrl ? [{ url: pkg.imageUrl, alt: pkg.title }] : [{ url: '/campaigns-packages-banner.webp' }];

  return {
    title,
    description,
    openGraph: {
      title: `${pkg.title} - ₹${pkg.discountedPrice.toLocaleString('en-IN')} | AiCura Diagnostics`,
      description,
      images,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${pkg.title} - ₹${pkg.discountedPrice.toLocaleString('en-IN')}`,
      description,
      images: pkg.imageUrl ? [pkg.imageUrl] : ['/campaigns-packages-banner.webp'],
    },
  };
}

export default async function PackageDetailPage({ params }: Props) {
  const { slug } = await params;
  const pkg = await getPackage(slug);

  if (!pkg || !pkg.isPublished) {
    notFound();
  }

  // Fetch related packages (excluding current)
  const allPackages = await PackageService.listPackages({ isPublished: true });
  const relatedPackages = allPackages
    .filter((p) => p.id !== pkg.id)
    .slice(0, 3);

  // Fetch primary company details for phone/WhatsApp
  let whatsappNumber = '9847986333';
  try {
    const company = await CompanyService.getPrimaryCompanyDetails();
    if (company?.whatsappNumber) {
      whatsappNumber = company.whatsappNumber;
    }
  } catch (err) {
    // Fallback to default
  }

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://aicuradiagnostics.com').replace(
    /\/+$/,
    ''
  );

  const packageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: pkg.title,
    description: pkg.description,
    image: pkg.imageUrl ? [pkg.imageUrl] : [`${siteUrl}/campaigns-packages-banner.webp`],
    brand: {
      '@type': 'Brand',
      name: 'AiCura Diagnostics',
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/packages/${pkg.slug}`,
      priceCurrency: 'INR',
      price: pkg.discountedPrice,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'AiCura Diagnostics',
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(packageJsonLd) }}
      />
      <PackageDetailClient
        pkg={pkg}
        relatedPackages={relatedPackages}
        whatsappNumber={whatsappNumber}
      />
    </>
  );
}
