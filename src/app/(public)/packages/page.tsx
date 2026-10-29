import React from 'react';
import Image from 'next/image';
import { Sparkles } from 'lucide-react';
import { PackageService } from '@/services/package.service';
import PackagesClient from './PackagesClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function PackagesPage() {
  const packages = await PackageService.listPackages({ isPublished: true }).catch(() => []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Banner */}
      <section className="relative w-full h-[50vh] min-h-[250px] bg-white border-b border-slate-200 shadow-sm overflow-hidden flex items-center">
        <Image
          src="/campaigns-packages-banner.webp"
          alt="Comprehensive Health Packages - AiCura Diagnostics"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center w-full h-full"
        />
        {/* Heading Overlay on Top of Image - Left Aligned with Black Text */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl space-y-3 text-left">
              <span className="inline-flex items-center gap-1.5 text-black bg-yellow-400 font-bold text-xs uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-black" /> Preventative Diagnostic Care
              </span>
              <h1 className="text-3xl sm:text-5xl font-extrabold text-black tracking-tight">
                Comprehensive Health Packages
              </h1>
              <p className="text-slate-800 text-sm sm:text-base font-medium max-w-xl leading-relaxed">
                Choose from doctor-curated checkup packages designed for every age group and wellness need. Includes free home sample collection!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Packages Listing */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <PackagesClient initialPackages={packages} />
      </main>
    </div>
  );
}
