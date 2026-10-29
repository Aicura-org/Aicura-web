import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comprehensive Health Checkup Packages | AiCura Diagnostics',
  description:
    'Explore affordable full body checkup packages, senior citizen care, diabetes, cardiac, thyroid, and vitamin screening panels with free doorstep blood sample collection.',
  openGraph: {
    title: 'Comprehensive Health Checkup Packages | AiCura Diagnostics',
    description:
      'Compare preventive health checkup packages with certified laboratory accuracy and doorstep sample collection.',
    images: [{ url: '/campaigns-packages-banner.webp', alt: 'AiCura Health Checkup Packages' }],
    type: 'website',
  },
};

export default function PackagesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

