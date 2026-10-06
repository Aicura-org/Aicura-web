'use client';

import React from 'react';
import { Phone, MessageCircle } from 'lucide-react';
import AiCuraLogo from '@/components/ui/AiCuraLogo';

interface CampaignHeaderProps {
  phone?: string;
  whatsappNumber?: string;
  campaignTitle?: string;
}

export function CampaignHeader({
  phone = '98479 86333',
  whatsappNumber = '9847986333',
  campaignTitle,
}: CampaignHeaderProps) {
  const cleanPhone = phone.replace(/\s+/g, '');
  const cleanWhatsApp = whatsappNumber.replace(/[^0-9]/g, '');

  const whatsappMessage = campaignTitle
    ? `Hi AiCura, I would like to enquire about: ${campaignTitle}`
    : 'Hi AiCura, I would like to book a diagnostic checkup.';

  return (
    <header className="bg-white border-b border-slate-200/90 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-20 flex items-center justify-between gap-2">
        {/* AiCura Logo */}
        <div className="flex items-center shrink-0">
          <AiCuraLogo variant="dark" />
        </div>

        {/* Right Actions: Phone & WhatsApp */}
        <div className="flex items-center gap-2 sm:gap-5 shrink-0">
          {/* Call Information */}
          <a
            href={`tel:${cleanPhone}`}
            className="flex items-center gap-2 text-slate-700 hover:text-teal-800 transition-colors py-1 group"
            title={`Call AiCura at ${phone}`}
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 group-hover:bg-teal-50 text-slate-700 group-hover:text-teal-700 flex items-center justify-center shrink-0 transition-colors">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" />
            </div>
            <div className="text-left hidden md:block">
              <span className="text-[10px] font-semibold text-slate-500 block leading-none">
                Call Now
              </span>
              <span className="text-xs sm:text-sm font-black text-slate-900 tracking-tight leading-tight">
                {phone}
              </span>
            </div>
          </a>

          {/* WhatsApp Button */}
          <a
            href={`https://wa.me/${cleanWhatsApp}?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1da850] text-white px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all active:scale-95 shrink-0"
          >
            <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current shrink-0" />
            <span className="hidden sm:inline">WhatsApp Us</span>
            <span className="sm:hidden">WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}

export default CampaignHeader;
