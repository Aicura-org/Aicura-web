'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import WhatsAppBtn from '@/components/layout/WhatsAppBtn';
import { CheckCircle2, Upload, Loader2 } from 'lucide-react';

export default function HomeCollectionPage() {
  // Form fields
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [testRequired, setTestRequired] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('07:00 AM - 09:00 AM');
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [prescriptionUrl, setPrescriptionUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setPrescriptionFile(file);
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('category', 'prescription');
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.data?.url) {
        setPrescriptionUrl(data.data.url);
      }
    } catch (err) {
      console.error('Prescription upload failed:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) return;
    setSubmitting(true);

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'HOME_COLLECTION',
          fullName,
          phone,
          address,
          message: testRequired ? `Requested Test/Package: ${testRequired}` : 'Home Sample Collection Booking',
          preferredDate,
          preferredTime,
          prescriptionUrl: prescriptionUrl || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        setBookingId(data.data?.id || `HC-${Math.floor(100000 + Math.random() * 900000)}`);
      }
    } catch (err) {
      console.error('Booking submission failed:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header />

      {/* Banner */}
      <div className="hero-gradient text-white py-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-yellow-400 text-xs font-bold uppercase tracking-widest">
            Doorstep Diagnostics
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-sans">
            Home Sample Collection Service
          </h1>
          <p className="text-slate-200 text-sm max-w-2xl mx-auto">
            Hassle-free blood and clinical sample collection right from the comfort of your home by certified phlebotomists.
          </p>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full space-y-12">
        {/* Main Booking Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Form */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200 shadow-lg">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Book Your Collection Slot</h2>
            <p className="text-xs text-slate-500 mb-6">Our phlebotomist will arrive at your specified time with temperature-controlled sample kits.</p>

            {submitted ? (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Booking Request Received!</h3>
                <p className="text-sm text-slate-600">
                  Thank you <span className="font-bold text-brand-700">{fullName}</span>. Your sample collection request has been logged in PostgreSQL.
                </p>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs text-emerald-800 font-semibold max-w-sm mx-auto">
                  Booking Reference ID: <span className="font-mono text-brand-900">{bookingId}</span>
                </div>
                <p className="text-xs text-slate-500">
                  Our senior coordinator will call <span className="font-semibold">{phone}</span> to confirm details.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Anjali Nair"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Complete Home Address *</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="House/Flat Name, Floor, Street, Landmark"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Test or Package Required</label>
                    <input
                      type="text"
                      placeholder="e.g. Full Body Checkup, Thyroid"
                      value={testRequired}
                      onChange={(e) => setTestRequired(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Collection Date</label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Preferred Time Slot</label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
                  >
                    <option value="07:00 AM - 09:00 AM">07:00 AM - 09:00 AM (Fasting Recommended)</option>
                    <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                    <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                    <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Upload Prescription (Optional)</label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <div className="flex items-center justify-center gap-2 text-slate-600 text-xs font-medium">
                      <Upload className="w-4 h-4 text-brand-700" />
                      {uploading ? 'Uploading prescription...' : prescriptionFile ? prescriptionFile.name : 'Upload Doctor Prescription Image/PDF'}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="w-full py-4 gold-gradient hover:gold-gradient-hover text-brand-900 font-bold text-sm rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" /> Confirming Booking...
                    </>
                  ) : (
                    'Confirm Home Collection Booking →'
                  )}
                </button>

              </form>
            )}
          </div>

          {/* Right Info Box */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-brand-700 text-white p-8 rounded-3xl space-y-4 shadow-xl border border-emerald-600">
              <h3 className="text-xl font-bold font-sans">Why Book Home Collection with AiCura?</h3>
              <ul className="space-y-3 text-xs text-slate-200">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span><strong>Zero Travel Hassle:</strong> Save time and avoid lab waiting rooms.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span><strong>100% Sterile Kits:</strong> Single-use vacuum tubes and needles for safety.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span><strong>Temperature Controlled:</strong> Cold-chain transport guarantees specimen stability.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                  <span><strong>Digital Reports:</strong> Received directly on WhatsApp and email within 6-24 hours.</span>
                </li>
              </ul>
            </div>
          </div>

        </div>
      </main>

      <Footer />
      <WhatsAppBtn />
    </div>
  );
}
