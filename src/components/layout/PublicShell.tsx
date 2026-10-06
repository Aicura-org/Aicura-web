'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBtn from '@/components/layout/WhatsAppBtn';

export default function PublicShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isCampaignLanding =
    pathname.startsWith('/campaign/') ||
    pathname.startsWith('/campaigns/');

  if (isCampaignLanding) {
    return <div className="min-h-screen flex flex-col">{children}</div>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppBtn />
    </>
  );
}
