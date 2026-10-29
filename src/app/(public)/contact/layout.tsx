import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact Us & Lab Locations | AiCura Diagnostics',
  description:
    'Get in touch with AiCura Diagnostics for lab test bookings, home sample collection enquiries, report assistance, and branch address & working hours.',
  openGraph: {
    title: 'Contact Us & Lab Locations | AiCura Diagnostics',
    description:
      'Call, WhatsApp, or visit AiCura Diagnostics for diagnostic testing and home sample collection.',
    type: 'website',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

