'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppBtn() {
  const [whatsappNumber, setWhatsappNumber] = useState('919946284615');
  const defaultText = encodeURIComponent('Hello AiCura Diagnostics, I would like to enquire about a diagnostic test/package.');

  useEffect(() => {
    fetch('/api/company-details?primary=true')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && json.data?.whatsappNumber) {
          const sanitized = json.data.whatsappNumber.replace(/\D/g, '');
          if (sanitized) setWhatsappNumber(sanitized);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=${defaultText}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center shadow-2xl whatsapp-pulse transition-transform hover:scale-110 group"
    >
      <MessageCircle className="w-8 h-8 fill-current text-white" />
      <span className="absolute right-16 top-2 bg-slate-900 text-white text-xs px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-medium shadow-md">
        Need assistance? Chat with us!
      </span>
    </a>
  );
}
