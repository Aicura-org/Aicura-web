'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, User, Phone, MapPin, Lock } from 'lucide-react';

interface Props {
  campaignId: string;
  campaignSlug: string;
  ctaText?: string;
}

export function CampaignEnquiryForm({ campaignId, campaignSlug, ctaText = 'Get My Offer →' }: Props) {
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
          message: `Campaign Booking Request (${campaignSlug})`,
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
        <h4 className="text-base font-bold text-emerald-900">Offer Claimed Successfully!</h4>
        <p className="text-xs text-emerald-700">
          Our senior diagnostic coordinator will call you within 15 minutes to confirm your doorstep collection slot.
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

      {/* Full Name */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
          Full Name *
        </label>
        <div className="flex items-center bg-white border border-slate-200/90 rounded-xl overflow-hidden focus-within:border-teal-700 focus-within:ring-1 focus-within:ring-teal-700 shadow-2xs">
          <div className="w-10 h-10 bg-slate-50 flex items-center justify-center shrink-0 border-r border-slate-100 text-slate-400">
            <User className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="text"
            required
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 text-base sm:text-xs text-slate-900 bg-transparent placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Mobile Phone Number */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
          Mobile Phone Number *
        </label>
        <div className="flex items-center bg-white border border-slate-200/90 rounded-xl overflow-hidden focus-within:border-teal-700 focus-within:ring-1 focus-within:ring-teal-700 shadow-2xs">
          <div className="w-10 h-10 bg-slate-50 flex items-center justify-center shrink-0 border-r border-slate-100 text-slate-400">
            <Phone className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="tel"
            required
            placeholder="10-digit mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 text-base sm:text-xs text-slate-900 bg-transparent placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* City / Location */}
      <div>
        <label className="block font-semibold text-slate-700 mb-1 text-[11px]">
          City / Location *
        </label>
        <div className="flex items-center bg-white border border-slate-200/90 rounded-xl overflow-hidden focus-within:border-teal-700 focus-within:ring-1 focus-within:ring-teal-700 shadow-2xs">
          <div className="w-10 h-10 bg-slate-50 flex items-center justify-center shrink-0 border-r border-slate-100 text-slate-400">
            <MapPin className="w-4 h-4 text-slate-500" />
          </div>
          <input
            type="text"
            required
            placeholder="e.g. Kozhikode, Malappuram"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="w-full px-3.5 py-2.5 text-base sm:text-xs text-slate-900 bg-transparent placeholder:text-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={submitting}
        className="w-full py-3.5 sm:py-3 bg-[#f5b324] hover:bg-[#e5a519] active:bg-[#d49610] text-slate-950 font-black text-sm rounded-lg shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {submitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> Claiming Offer...
          </>
        ) : (
          <>
            <span>{ctaText || 'Get My Offer'}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </>
        )}
      </button>

      {/* Security Reassurance */}
      <div className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-slate-500">
        <Lock className="w-3.5 h-3.5 text-slate-400" />
        <span>Your information is secure and confidential.</span>
      </div>
    </form>
  );
}

export default CampaignEnquiryForm;
