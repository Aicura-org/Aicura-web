import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Laboratory & Facility Gallery | AiCura Diagnostics',
  description:
    'View photos of AiCura Diagnostics automated laboratory equipment, certified pathology facility, medical team, and health camp events.',
  openGraph: {
    title: 'Laboratory & Facility Gallery | AiCura Diagnostics',
    description:
      'Explore our modern diagnostic laboratory, automated analyzers, and healthcare team.',
    type: 'website',
  },
};

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

