import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import TestDetailClient from './TestDetailClient';
import {
  FlaskConical,
  Droplet,
  Clock,
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Share2,
} from 'lucide-react';

interface Props {
  params: Promise<{ id: string }>;
}

async function getTest(paramId: string) {
  let test = await prisma.diagnosticTest.findUnique({
    where: { id: paramId },
  });

  if (!test) {
    test = await prisma.diagnosticTest.findUnique({
      where: { code: paramId.toUpperCase() },
    });
  }

  return test;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const test = await getTest(id);

  if (!test || !test.isActive) {
    return { title: 'Test Not Found | AiCura Diagnostics' };
  }

  return {
    title: `${test.name} (${test.code}) | AiCura Diagnostics`,
    description:
      test.description ||
      `Book ${test.name} online with free home sample collection across Kochi & Kerala. Accurate certified lab reports.`,
  };
}

export default async function TestDetailPage({ params }: Props) {
  const { id } = await params;
  const test = await getTest(id);

  if (!test || !test.isActive) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-16">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-slate-200 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <nav className="flex items-center gap-2 text-xs text-slate-500">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <span>/</span>
            <Link href="/tests-services" className="hover:text-brand-700">Tests &amp; Services</Link>
            <span>/</span>
            <span className="font-semibold text-slate-800 truncate">{test.name}</span>
          </nav>

          <Link
            href="/tests-services"
            className="flex items-center gap-1 text-xs font-bold text-brand-700 hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Tests
          </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <TestDetailClient test={test} />
      </main>
    </div>
  );
}
