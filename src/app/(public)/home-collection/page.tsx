'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle2, Upload, Loader2,
  Clock, MapPin, FlaskConical, CalendarDays,
  Syringe, Thermometer, FileText, Star,
  User, Phone, Home, TestTube, Calendar, ChevronDown,
} from 'lucide-react';

const benefits = [
  { icon: CheckCircle2, title: 'Zero Travel Hassle', desc: 'Skip the queue — stay home and relax.' },
  { icon: Syringe,      title: '100% Sterile Kits',  desc: 'Single-use vacuum tubes & needles.' },
  { icon: Thermometer,  title: 'Cold-Chain Transport', desc: 'Specimen stability guaranteed.' },
  { icon: FileText,     title: 'Digital Reports',     desc: 'WhatsApp & email in 6–24 hours.' },
];

const quickInfo = [
  { icon: Clock,        label: 'Daily', sub: '7 AM – 6 PM' },
  { icon: MapPin,       label: 'City-Wide', sub: 'All areas' },
  { icon: FlaskConical, label: '500+ Tests', sub: 'All categories' },
  { icon: CalendarDays, label: 'Easy Book', sub: '2 minutes' },
];

export default function HomeCollectionPage() {
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
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.success && data.data?.url) setPrescriptionUrl(data.data.url);
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
          fullName, phone, address,
          message: testRequired ? `Requested Test/Package: ${testRequired}` : 'Home Sample Collection Booking',
          preferredDate, preferredTime,
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
    <div className="min-h-screen flex flex-col bg-[#f0f4f8]">

      {/* ── Hero Banner ── */}
      <section className="relative w-full h-[340px] sm:h-[440px] overflow-hidden">
        <Image
          src="/Home Blood Draw in a Bright Living Room.png"
          alt="Home Sample Collection — AiCura Diagnostics"
          fill priority sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-900/85 via-brand-900/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-900/50 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 w-full">
            <div className="max-w-lg space-y-4">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest bg-yellow-400 text-brand-900 px-3.5 py-1.5 rounded-full shadow">
                <Star className="w-3 h-3 fill-brand-900" /> Doorstep Diagnostics
              </span>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight drop-shadow-lg">
                Home Sample<br />
                <span className="text-yellow-400">Collection</span>
              </h1>
              <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-md">
                Hassle-free blood &amp; clinical sample collection at your doorstep by certified phlebotomists.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Info Bar ── */}
      <div className="bg-brand-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-brand-700/60">
            {quickInfo.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 py-4 px-5">
                <div className="w-8 h-8 rounded-xl bg-brand-700/60 flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4 text-yellow-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-white">{label}</p>
                  <p className="text-[11px] text-slate-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-1 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* ── Booking Form ── */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden">

              {/* Form header */}
              <div className="relative bg-brand-800 px-6 pt-5 pb-8 overflow-hidden">
                <div className="absolute -right-10 -top-10 w-36 h-36 bg-brand-700/40 rounded-full blur-2xl" />
                <div className="absolute right-6 bottom-0 opacity-10">
                  <FlaskConical className="w-20 h-20 text-white" />
                </div>
                <div className="relative z-10">
                  <h2 className="text-lg font-extrabold text-white">Book Your Collection Slot</h2>
                  <p className="text-slate-300 text-xs mt-0.5">
                    Certified phlebotomist · Temperature-controlled kits · Your preferred time.
                  </p>
                </div>
              </div>

              {/* Form body — pulled up to overlap header */}
              <div className="px-5 pb-5 -mt-4">
                <div className="bg-white rounded-2xl shadow-md border border-slate-100 p-5">

                  {submitted ? (
                    <div className="text-center py-10 space-y-5">
                      <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                        <CheckCircle2 className="w-11 h-11" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h3>
                        <p className="text-sm text-slate-500 mt-1">
                          Thank you <span className="font-bold text-brand-700">{fullName}</span>. Your request has been received.
                        </p>
                      </div>
                      <div className="inline-block bg-brand-50 border border-brand-100 text-brand-800 text-xs font-mono font-bold px-5 py-3 rounded-xl">
                        Booking ID: {bookingId}
                      </div>
                      <p className="text-xs text-slate-400">
                        Our coordinator will call <span className="font-semibold text-slate-600">{phone}</span> to confirm.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3.5">

                      {/* Row 1 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                            <User className="w-3 h-3 text-brand-700" /> Full Name *
                          </label>
                          <input
                            type="text" required placeholder="e.g. Anjali Nair"
                            value={fullName} onChange={(e) => setFullName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent focus:bg-white transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-brand-700" /> Mobile Number *
                          </label>
                          <input
                            type="tel" required placeholder="10-digit mobile number"
                            value={phone} onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent focus:bg-white transition"
                          />
                        </div>
                      </div>

                      {/* Address */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Home className="w-3 h-3 text-brand-700" /> Complete Home Address *
                        </label>
                        <textarea
                          required rows={2}
                          placeholder="House/Flat, Floor, Street, Landmark"
                          value={address} onChange={(e) => setAddress(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent focus:bg-white transition resize-none"
                        />
                      </div>

                      {/* Row 2 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                            <TestTube className="w-3 h-3 text-brand-700" /> Test / Package
                          </label>
                          <input
                            type="text" placeholder="e.g. Full Body Checkup"
                            value={testRequired} onChange={(e) => setTestRequired(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent focus:bg-white transition"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-brand-700" /> Preferred Date
                          </label>
                          <input
                            type="date" value={preferredDate}
                            onChange={(e) => setPreferredDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent focus:bg-white transition"
                          />
                        </div>
                      </div>

                      {/* Time slot */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-brand-700" /> Preferred Time Slot
                        </label>
                        <div className="relative">
                          <select
                            value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700 focus:border-transparent focus:bg-white transition appearance-none"
                          >
                            <option value="07:00 AM - 09:00 AM">07:00 AM – 09:00 AM (Fasting Recommended)</option>
                            <option value="09:00 AM - 11:00 AM">09:00 AM – 11:00 AM</option>
                            <option value="11:00 AM - 01:00 PM">11:00 AM – 01:00 PM</option>
                            <option value="04:00 PM - 06:00 PM">04:00 PM – 06:00 PM</option>
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Prescription upload */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-500">Upload Prescription <span className="text-slate-400 font-normal">(Optional)</span></label>
                        <div className="relative border-2 border-dashed border-slate-200 rounded-lg px-4 py-3 bg-slate-50 hover:bg-brand-50 hover:border-brand-300 transition-all cursor-pointer group">
                          <input
                            type="file" accept="image/*,.pdf" onChange={handleFileUpload}
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                          />
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center shrink-0 group-hover:bg-brand-200 transition-colors">
                              <Upload className="w-3.5 h-3.5 text-brand-700" />
                            </div>
                            <p className="text-xs text-slate-600">
                              {uploading ? 'Uploading...' : prescriptionFile ? prescriptionFile.name : 'Click to upload Doctor Prescription (Image / PDF)'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        disabled={submitting || uploading}
                        className="w-full py-3 rounded-xl gold-gradient text-brand-900 font-bold text-sm shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:scale-100"
                      >
                        {submitting ? (
                          <><Loader2 className="w-4 h-4 animate-spin" /> Confirming Booking...</>
                        ) : (
                          'Confirm Home Collection Booking →'
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ── */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">

            {/* Why AiCura */}
            <div className="bg-brand-800 rounded-3xl shadow-xl overflow-hidden">
              <div className="px-7 pt-7 pb-4">
                <p className="text-yellow-400 text-[11px] font-bold uppercase tracking-wider">Why Choose Us</p>
                <h3 className="text-lg font-extrabold text-white mt-0.5">Why Book with AiCura?</h3>
              </div>
              <div className="px-4 pb-5 space-y-2">
                {benefits.map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="flex items-start gap-4 bg-brand-700/40 hover:bg-brand-700/60 rounded-2xl px-4 py-3.5 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-xl bg-brand-900/60 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">{title}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Rating card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 border border-yellow-100 flex items-center justify-center shrink-0">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Rated 4.9 / 5 by Patients</p>
                <p className="text-xs text-slate-500 mt-0.5">10,000+ verified bookings across Kerala</p>
              </div>
            </div>

            {/* NABL trust strip */}
            <div className="bg-brand-50 border border-brand-100 rounded-2xl px-5 py-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-brand-800">NABL Accredited Laboratory</p>
                <p className="text-[11px] text-brand-600 mt-0.5">99.8% accuracy · ISO certified · Trusted since 2018</p>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
