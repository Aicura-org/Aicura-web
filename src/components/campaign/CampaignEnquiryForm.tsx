'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

interface Props {
  campaignId: string;
  campaignSlug: string;
  ctaText?: string;
}

export default function CampaignEnquiryForm({ campaignId, campaignSlug, ctaText = 'Book Now' }: Props) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'HOME_COLLECTION',
          fullName,
          phone,
          city: city || undefined,
          campaignId,
          campaignSlug,
          message: `Campaign Special Offer Request (${campaignSlug})`,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
      } else {
        setError(data.message || 'Submission failed. Please check your phone number.');
      }
    } catch {
      setError('Connection error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
        <h4 className="text-base font-bold text-emerald-900">Request Received!</h4>
        <p className="text-xs text-emerald-700">
          Our senior diagnostic coordinator will call you within 15 minutes to confirm sample collection.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs">
      {error && (
        <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl border border-red-200 font-semibold">
          {error}
        </div>
      )}

      <div>
        <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
        <input
          type="text"
          required
          placeholder="Enter your full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs"
        />
      </div>

      <div>
        <label className="block font-bold text-slate-700 mb-1">Mobile Phone Number *</label>
        <input
          type="tel"
          required
          placeholder="10-digit mobile number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs"
        />
      </div>

      <div>
        <label className="block font-bold text-slate-700 mb-1">City / Location</label>
        <input
          type="text"
          placeholder="e.g. Hyderabad / Bengaluru"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700 text-xs"
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-extrabold text-xs rounded-xl shadow-md transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Submitting Request...
          </>
        ) : (
          <>
            {ctaText} <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>
    </form>
  );
}
