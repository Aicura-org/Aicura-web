'use client';

import React, { useState, useEffect } from 'react';
import { X, CheckCircle, FileText, MapPin, User, Phone, Mail } from 'lucide-react';
import { EnquiryType } from '@/types';

interface EnquireModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTestOrPackage?: string;
  defaultPackageId?: string;
  defaultType?: 'test' | 'package' | 'home_collection' | 'prescription' | 'contact';
}

export default function EnquireModal({
  isOpen,
  onClose,
  defaultTestOrPackage = '',
  defaultPackageId,
  defaultType = 'test',
}: EnquireModalProps) {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [selectedItem, setSelectedItem] = useState(defaultTestOrPackage);
  const [prescriptionNotes, setPrescriptionNotes] = useState('');
  const [address, setAddress] = useState('');
  const [pincode, setPincode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  // Lock background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mapEnquiryType = (t: string): EnquiryType => {
    if (t === 'package') return 'PACKAGE';
    if (t === 'contact') return 'CONTACT';
    return 'HOME_COLLECTION';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone) return;
    setSubmitting(true);

    try {
      const enquiryType = mapEnquiryType(defaultType);
      
      const messageParts: string[] = [];
      if (selectedItem) messageParts.push(`Requested Item: ${selectedItem}`);
      if (prescriptionNotes) messageParts.push(`Doctor's Advice / Notes: ${prescriptionNotes}`);

      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: enquiryType,
          fullName,
          phone,
          email: email || undefined,
          address: address || undefined,
          pincode: pincode || undefined,
          message: messageParts.length > 0 ? messageParts.join('\n') : undefined,
          ...(defaultPackageId && { packageId: defaultPackageId, packageQuantity: 1 }),
          ...(defaultTestOrPackage && !defaultPackageId && { tests: [defaultTestOrPackage] }),
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setIsSuccess(true);
        setBookingId(data.data?.id || `AIC-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch (err) {
      console.error('Enquiry submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const resetAndClose = () => {
    setIsSuccess(false);
    setFullName('');
    setPhone('');
    setEmail('');
    setAddress('');
    setPrescriptionNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/75 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100 relative animate-in fade-in zoom-in duration-200">
        
        {/* Header banner */}
        <div className="bg-brand-700 text-white p-6 relative">
          <button
            onClick={resetAndClose}
            className="absolute top-4 right-4 text-slate-300 hover:text-white bg-brand-800/60 p-1.5 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <span className="text-yellow-400 text-xs font-semibold uppercase tracking-wider block mb-1">
            AiCura Healthcare Support
          </span>
          <h2 className="text-xl font-bold font-sans">
            {defaultType === 'home_collection' ? 'Book Home Sample Collection' : 'Enquire for Diagnostic Test'}
          </h2>
          <p className="text-slate-200 text-xs mt-1">
            Fill out your details below. Our team will contact you within 15 minutes!
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {isSuccess ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">Enquiry Received!</h3>
              <p className="text-sm text-slate-600">
                Thank you <span className="font-semibold text-brand-700">{fullName}</span>. Your request has been logged in our system.
              </p>
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800">
                Reference ID: <span className="font-mono font-bold">{bookingId}</span>
              </div>
              <p className="text-xs text-slate-500">
                Our senior phlebotomist will reach out to <span className="font-medium">{phone}</span> to confirm your test slot.
              </p>
              <button
                onClick={resetAndClose}
                className="w-full py-3 bg-brand-700 hover:bg-brand-800 text-white rounded-xl font-semibold text-sm shadow transition-colors"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>

              {/* Phone & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone *</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Optional)</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="rahul@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>
                </div>
              </div>

              {/* Test / Package Selected */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Test or Package Required</label>
                <input
                  type="text"
                  placeholder="e.g. Full Body Checkup, CBC, Vitamin D"
                  value={selectedItem}
                  onChange={(e) => setSelectedItem(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                />
              </div>

              {/* Doctor's Advice / Prescription Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-brand-700" />
                    Doctor's Advice / Prescribed Tests (Optional)
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">Notes & Symptoms</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Doctor advised Fasting Sugar, CBC, Lipid Profile (or any symptoms)"
                  value={prescriptionNotes}
                  onChange={(e) => setPrescriptionNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700 placeholder:text-slate-400"
                />
              </div>

              {/* Address for Home Collection */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Address / Location</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    placeholder="House/Flat No., Street, City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-sm rounded-xl shadow-md transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-2"
              >
                {submitting ? 'Submitting Enquiry...' : 'Confirm Enquiry →'}
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
}
