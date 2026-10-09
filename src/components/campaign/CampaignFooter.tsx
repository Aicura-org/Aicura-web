'use client';

import React from 'react';
import { MessageCircle } from 'lucide-react';
import AiCuraLogo from '@/components/ui/AiCuraLogo';

interface CampaignFooterProps {
  phone?: string;
  whatsappNumber?: string;
  campaignTitle?: string;
}

export function CampaignFooter({
  whatsappNumber = '9847986333',
  campaignTitle,
}: CampaignFooterProps) {
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  const whatsappMessage = campaignTitle
    ? `Hi AiCura, I am on the ${campaignTitle} campaign page and would like assistance.`
    : 'Hi AiCura, I would like assistance with diagnostic booking.';

  return (
    <>
      <footer className="bg-white border-t border-slate-200 py-5 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
            
            {/* Left: Brand Logo */}
            <div className="flex items-center">
              <AiCuraLogo variant="dark" />
            </div>

            {/* Center: Copyright & Ekodrix */}
            <div className="flex flex-col items-center sm:items-center text-center text-xs text-slate-500 gap-1">
              <p>© 2026 AiCura Diagnostics. All rights reserved.</p>
              <p className="text-[11px] text-slate-400">
                Crafted by <span className="font-semibold text-slate-600">Ekodrix</span> 💛
              </p>
            </div>

            {/* Spacer for symmetrical desktop alignment */}
            <div className="hidden sm:block w-24" />

          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Action Button (bottom right matching reference) */}
      <a
        href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-13 sm:h-13 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="w-6 h-6 sm:w-7 sm:h-7 fill-current" />
      </a>
    </>
  );
}

export default CampaignFooter;
