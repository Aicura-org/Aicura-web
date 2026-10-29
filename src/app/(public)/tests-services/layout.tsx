import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Diagnostic Lab Tests & Pathology Services | AiCura Diagnostics',
  description:
    'Search 500+ diagnostic blood tests, biochemistry, hematology, thyroid, hormone, and pathology lab services with fast digital reports and home sample collection.',
  openGraph: {
    title: 'Diagnostic Lab Tests & Pathology Services | AiCura Diagnostics',
    description:
      'Book individual blood tests and pathology investigations online with accurate, certified reports.',
    type: 'website',
  },
};

export default function TestsServicesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

