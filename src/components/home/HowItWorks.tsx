'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useInView, useSpring } from 'framer-motion';
import { FileEdit, PhoneCall, Syringe, Microchip, FileCheck } from 'lucide-react';

type Step = {
  step: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
};

const steps: Step[] = [
  {
    step: '01',
    title: 'Submit Enquiry',
    desc: 'Fill in your details online or via WhatsApp',
    icon: FileEdit,
  },
  {
    step: '02',
    title: 'Our Team Contacts You',
    desc: 'We confirm your test & time slot',
    icon: PhoneCall,
  },
  {
    step: '03',
    title: 'Sample Collection',
    desc: 'At your home or lab location',
    icon: Syringe,
  },
  {
    step: '04',
    title: 'Testing at AiCura',
    desc: 'Accurate & reliable clinical testing',
    icon: Microchip,
  },
  {
    step: '05',
    title: 'Get Your Report',
    desc: 'Via Email / WhatsApp within hours',
    icon: FileCheck,
  },
];

function StepItem({ item, isLast }: { item: Step; isLast: boolean }) {
  const ref = useRef<HTMLLIElement>(null);
  const IconComp = item.icon;

  // Mobile: the line segment below this step fills as you scroll through the step
  // Both use the same 70% trigger line, so the line always reaches the next
  // icon exactly when that icon fills (also works at the end of the page).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 70%', 'end 70%'],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // Mobile: icon background fills (top to bottom) as the step scrolls from 85% to 70%
  const { scrollYProgress: iconProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'start 70%'],
  });
  const iconFill = useSpring(iconProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });

  // Mobile: icon fills once this step reaches ~70% of the viewport height
  const active = useInView(ref, { once: true, margin: '0px 0px -30% 0px' });

  return (
    <li
      ref={ref}
      className="group relative flex gap-4 pb-8 last:pb-0 md:flex-col md:items-center md:gap-0 md:pb-0 md:text-center"
    >
      {/* Mobile vertical connector: grey track + animated fill */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-7 top-14 w-0.5 -translate-x-1/2 overflow-hidden rounded-full bg-emerald-100 md:hidden"
        >
          <motion.div
            style={{ scaleY: fill }}
            className="h-full w-full origin-top bg-gradient-to-b from-brand-700 to-emerald-400"
          />
        </span>
      )}

      {/* Icon (fill animation only applies on mobile via max-md:) */}
      <div className="relative z-10 shrink-0 md:mb-5">
        <div
          className={`relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-emerald-200 bg-white text-brand-700 shadow-sm ring-4 ring-emerald-50 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:border-brand-700 group-hover:bg-brand-700 group-hover:text-yellow-400 group-hover:shadow-lg md:h-16 md:w-16 md:ring-8 ${
            active
              ? 'max-md:scale-105 max-md:border-brand-700 max-md:text-yellow-400'
              : ''
          }`}
        >
          {/* Mobile-only animated background fill (top to bottom) */}
          <motion.span
            aria-hidden="true"
            style={{ scaleY: iconFill }}
            className="absolute inset-0 origin-top bg-brand-700 md:hidden"
          />
          <IconComp className="relative z-10 h-6 w-6 md:h-7 md:w-7" />
        </div>
      </div>

      {/* Text (fades in on mobile when reached) */}
      <div
        className={`min-w-0 flex-1 pt-1 transition-all duration-500 md:flex-none md:translate-x-0 md:pt-0 md:opacity-100 ${
          active ? 'translate-x-0 opacity-100' : 'translate-x-1 opacity-50'
        }`}
      >
        <span className="mb-1 block text-[11px] font-bold uppercase tracking-widest text-brand-700/70">
          Step {item.step}
        </span>
        <h3 className="mb-1 text-[15px] font-bold leading-snug text-slate-900 transition-colors group-hover:text-brand-700 md:text-sm">
          {item.title}
        </h3>
        <p className="text-xs leading-relaxed text-slate-500 md:mx-auto md:max-w-[180px]">
          {item.desc}
        </p>
      </div>
    </li>
  );
}

export default function HowItWorks() {
  return (
    <section className="border-y border-emerald-100 bg-gradient-to-b from-emerald-50/70 to-white py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header: left aligned on mobile, centered from md up */}
        <div className="mb-10 max-w-2xl text-left md:mx-auto md:mb-16 md:text-center">
          <span className="mb-2 inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-brand-700">
   
            Simple & Transparent
          </span>
          <h2 className="mt-1 font-sans text-2xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How it works
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 sm:text-base">
            From enquiry to your report — a simple and hassle-free process.
          </p>
        </div>

        {/* Steps: vertical timeline on mobile, horizontal 5-column timeline on desktop */}
        <div className="relative">
          {/* Desktop horizontal connector line (behind icons) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-[10%] right-[10%] top-8 hidden h-px bg-gradient-to-r from-emerald-200 via-brand-700/40 to-emerald-200 md:block"
          />

          <ol className="grid grid-cols-1 gap-0 md:grid-cols-5 md:gap-6">
            {steps.map((item, idx) => (
              <StepItem key={idx} item={item} isLast={idx === steps.length - 1} />
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}