'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { EnquiryItem, EnquiryStatus, EnquiryType } from '@/types';
import { Phone, Mail, MapPin, Calendar, FileText, AlertCircle, Search, Loader2, Megaphone } from 'lucide-react';

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadEnquiries();
  }, [typeFilter, statusFilter, searchQuery]);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (typeFilter !== 'ALL') params.append('type', typeFilter);
      if (statusFilter !== 'ALL') params.append('status', statusFilter);
      if (searchQuery.trim()) params.append('search', searchQuery.trim());

      const res = await fetch(`/api/enquiries?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.data?.items) {
          setEnquiries(data.data.items);
        }
      }
    } catch (err) {
      console.error('Failed to load enquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: EnquiryStatus) => {
    try {
      const res = await fetch(`/api/enquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        await loadEnquiries();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 font-sans">Patient Enquiries & Bookings</h1>
            <p className="text-xs text-slate-500">Centralized control panel for home collection, package requests, and campaign attribution.</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-700"
              />
            </div>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Enquiry Types</option>
              <option value="HOME_COLLECTION">Home Collection</option>
              <option value="PACKAGE">Package Booking</option>
              <option value="CONTACT">General Contact</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
            >
              <option value="ALL">All Statuses</option>
              <option value="NEW">🟡 NEW</option>
              <option value="CONTACTED">🔵 CONTACTED</option>
              <option value="CONFIRMED">🟣 CONFIRMED</option>
              <option value="COMPLETED">🟢 COMPLETED</option>
              <option value="CANCELLED">🔴 CANCELLED</option>
            </select>
          </div>
        </div>

        {/* Enquiries List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-brand-700" /> Loading patient enquiries...
            </div>
          ) : enquiries.length === 0 ? (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-2">
              <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No Enquiries Found</h3>
              <p className="text-xs text-slate-500">No patient bookings match your active filters.</p>
            </div>
          ) : (
            enquiries.map((e) => (
              <div
                key={e.id}
                className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                      e.type === 'HOME_COLLECTION'
                        ? 'bg-emerald-100 text-emerald-800'
                        : e.type === 'PACKAGE'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}>
                      {e.type}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{e.customer.fullName}</h3>

                    {e.campaign && (
                      <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Megaphone className="w-3 h-3 text-amber-600" />
                        Campaign: {e.campaign.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(e.createdAt).toLocaleDateString()}
                    </span>
                    <select
                      value={e.status}
                      onChange={(evt) => handleStatusChange(e.id, evt.target.value as EnquiryStatus)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold focus:outline-none focus:ring-2 border ${
                        e.status === 'NEW'
                          ? 'bg-amber-50 border-amber-300 text-amber-800'
                          : e.status === 'COMPLETED'
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <option value="NEW">🟡 NEW</option>
                      <option value="CONTACTED">🔵 CONTACTED</option>
                      <option value="CONFIRMED">🟣 CONFIRMED</option>
                      <option value="COMPLETED">🟢 COMPLETED</option>
                      <option value="CANCELLED">🔴 CANCELLED</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-700 shrink-0" />
                    <span>Phone: <a href={`tel:${e.customer.phone}`} className="font-bold text-slate-900 hover:underline">{e.customer.phone}</a></span>
                  </div>

                  {e.customer.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-brand-700 shrink-0" />
                      <span>Email: <strong className="text-slate-800">{e.customer.email}</strong></span>
                    </div>
                  )}

                  {e.preferredDate && (
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-brand-700 shrink-0" />
                      <span>Preferred: <strong className="text-slate-800">{e.preferredDate} ({e.preferredTime || 'Morning'})</strong></span>
                    </div>
                  )}
                </div>

                {/* Details Section */}
                <div className="space-y-2 text-xs">
                  {e.package && (
                    <div className="bg-blue-50/60 p-3 rounded-xl border border-blue-100 flex items-center justify-between">
                      <span className="font-bold text-blue-900">Requested Package: {e.package.package.title}</span>
                      <span className="font-extrabold text-blue-700">₹{e.package.package.discountedPrice} × {e.package.quantity}</span>
                    </div>
                  )}

                  {e.tests && e.tests.length > 0 && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                      <span className="font-bold text-slate-800 block">Requested Diagnostic Tests:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {e.tests.map((t) => (
                          <span key={t.id} className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 text-[11px] font-medium">
                            {t.testName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {e.message && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700">
                      <span className="font-bold text-slate-900 block mb-0.5">Patient Message:</span>
                      <p className="italic">{e.message}</p>
                    </div>
                  )}

                  {e.customer.address && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-start gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">Collection Address:</span> {e.customer.address} {e.customer.city ? `, ${e.customer.city}` : ''} {e.customer.pincode ? `(${e.customer.pincode})` : ''}
                      </div>
                    </div>
                  )}

                  {e.prescriptionUrl && (
                    <div className="pt-1">
                      <a
                        href={e.prescriptionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-emerald-700 font-bold hover:underline bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200"
                      >
                        📄 View Uploaded Doctor Prescription →
                      </a>
                    </div>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
