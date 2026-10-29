import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Home Blood Sample Collection | AiCura Diagnostics',
  description:
    'Schedule doorstep blood and urine sample collection at home with trained phlebotomists, 100% sterile single-use kits, and WhatsApp digital reports within 6–24 hours.',
  openGraph: {
    title: 'Book Home Blood Sample Collection | AiCura Diagnostics',
    description:
      'Skip the queue — book safe, hygienic home sample collection from AiCura Diagnostics.',
    type: 'website',
  },
};

export default function HomeCollectionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

