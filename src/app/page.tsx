import React from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBtn from '@/components/layout/WhatsAppBtn';
import HeroSection from '@/components/home/HeroSection';
import QuickActions from '@/components/home/QuickActions';
import PopularPackages from '@/components/home/PopularPackages';
import DoorstepCare from '@/components/home/DoorstepCare';
import HomeCollectionBanner from '@/components/home/HomeCollectionBanner';
import HowItWorks from '@/components/home/HowItWorks';
import WhyAiCura from '@/components/home/WhyAiCura';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogSection from '@/components/home/BlogSection';
import FAQSection from '@/components/home/FAQSection';
import CTABanner from '@/components/home/CTABanner';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'AiCura Diagnostics | Reliable Lab Testing & Home Sample Collection',
  description: 'Book diagnostic lab tests and health packages online with doorstep home sample collection across Kochi & Kerala. NABL compliant accredited lab reports.',
};

async function getHeroBanners() {
  try {
    const banners = await prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        imageUrl: true,
        mobileImageUrl: true,
        buttonLink: true,
        title: true,
      },
    });
    return banners;
  } catch (error) {
    console.error('Failed fetching hero banners server-side:', error);
    return [];
  }
}

async function getHomeCollectionBanner() {
  try {
    const banner = await prisma.homeCollectionBanner.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
    return banner;
  } catch (error) {
    console.error('Failed fetching home collection banner server-side:', error);
    return null;
  }
}

async function getAboutSection() {
  try {
    const about = await prisma.aboutSection.findFirst({
      where: { isActive: true },
      orderBy: { updatedAt: 'desc' },
    });
    return about;
  } catch (error) {
    console.error('Failed fetching about section server-side:', error);
    return null;
  }
}

export default async function HomePage() {
  const [heroBanners, homeCollectionBanner, aboutSection] = await Promise.all([
    getHeroBanners(),
    getHomeCollectionBanner(),
    getAboutSection(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-yellow-400 selection:text-brand-900">
      <Header />
      <main className="flex-1">
        <HeroSection initialBanners={heroBanners} />
        <QuickActions />
        <PopularPackages />
        <DoorstepCare initialData={aboutSection} />
        <HomeCollectionBanner initialData={homeCollectionBanner} />
        <HowItWorks />
        <WhyAiCura />
        <TestimonialsSection />
        <BlogSection />
        <FAQSection />
        <CTABanner />
      </main>
      <Footer />
      <WhatsAppBtn />
    </div>
  );
}



