'use client';

import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { CompanyDetailsItem } from '@/types';
import {
  Building2,
  Plus,
  Edit3,
  Trash2,
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Clock,
  Globe,
  FileText,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  Save,
  RefreshCw,
  Building,
} from 'lucide-react';

interface FormState {
  companyName: string;
  branchName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  mobileNumber: string;
  alternatePhone: string;
  whatsappNumber: string;
  email: string;
  mapLink: string;
  workingHours: string;
  websiteUrl: string;
  taxNumber: string;
  isPrimary: boolean;
  isActive: boolean;
}

const emptyFormState: FormState = {
  companyName: '',
  branchName: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  mobileNumber: '',
  alternatePhone: '',
  whatsappNumber: '',
  email: '',
  mapLink: '',
  workingHours: '',
  websiteUrl: '',
  taxNumber: '',
  isPrimary: true,
  isActive: true,
};

export default function AdminCompanyDetailsPage() {
  const [company, setCompany] = useState<CompanyDetailsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormState>(emptyFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchCompanyDetails();
  }, []);

  const showAlert = (type: 'success' | 'error', message: string) => {
    setAlert({ type, message });
    setTimeout(() => {
      setAlert(null);
    }, 4500);
  };

  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('aicura_admin_token') : null;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchCompanyDetails = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/company-details', {
        headers: getAuthHeaders(),
        credentials: 'include',
        cache: 'no-store',
      });
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data) && json.data.length > 0) {
          const item: CompanyDetailsItem = json.data[0];
          setCompany(item);
          populateForm(item);
          setIsEditing(false);
        } else {
          setCompany(null);
          setFormData(emptyFormState);
        }
      } else {
        showAlert('error', 'Failed to retrieve company details from database');
      }
    } catch (err) {
      console.error('Fetch company details error:', err);
      showAlert('error', 'Network error while fetching company details');
    } finally {
      setLoading(false);
    }
  };

  const populateForm = (item: CompanyDetailsItem) => {
    setFormData({
      companyName: item.companyName || '',
      branchName: item.branchName || '',
      address: item.address || '',
      city: item.city || '',
      state: item.state || '',
      pincode: item.pincode || '',
      mobileNumber: item.mobileNumber || '',
      alternatePhone: item.alternatePhone || '',
      whatsappNumber: item.whatsappNumber || '',
      email: item.email || '',
      mapLink: item.mapLink || '',
      workingHours: item.workingHours || '',
      websiteUrl: item.websiteUrl || '',
      taxNumber: item.taxNumber || '',
      isPrimary: item.isPrimary ?? true,
      isActive: item.isActive ?? true,
    });
    setFormErrors({});
  };

  const handleStartAdd = () => {
    setFormData(emptyFormState);
    setFormErrors({});
    setIsEditing(true);
  };

  const handleStartEdit = () => {
    if (company) {
      populateForm(company);
    }
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    if (company) {
      populateForm(company);
      setIsEditing(false);
    } else {
      setIsEditing(false);
    }
    setFormErrors({});
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      errors.companyName = 'Company Name is required';
    }
    if (!formData.address.trim()) {
      errors.address = 'Company Address is required';
    }
    if (!formData.mobileNumber.trim()) {
      errors.mobileNumber = 'Mobile Number is required';
    }
    if (!formData.whatsappNumber.trim()) {
      errors.whatsappNumber = 'WhatsApp Number is required';
    }
    if (!formData.mapLink.trim()) {
      errors.mapLink = 'Google Map link is required';
    }
    if (formData.email && !formData.email.includes('@')) {
      errors.email = 'Please provide a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setSaving(true);
    try {
      const url = company?.id ? `/api/company-details/${company.id}` : '/api/company-details';
      const method = company?.id ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (res.ok && json.success) {
        showAlert('success', 'Company details saved successfully in the database');
        await fetchCompanyDetails();
        setIsEditing(false);
      } else {
        const msg = json.message || (json.error?.details ? JSON.stringify(json.error.details) : 'Failed to save');
        showAlert('error', msg);
      }
    } catch (err) {
      console.error('Save error:', err);
      showAlert('error', 'Network error while saving company details');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!company) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/company-details/${company.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
        credentials: 'include',
      });
      const json = await res.json();

      if (res.ok && json.success) {
        showAlert('success', 'Company details deleted from database');
        setIsDeleteModalOpen(false);
        setCompany(null);
        setFormData(emptyFormState);
        setIsEditing(false);
      } else {
        showAlert('error', json.message || 'Failed to delete company details');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showAlert('error', 'Network error while deleting item');
    } finally {
      setDeleting(false);
    }
  };

  const copyMobileToWhatsapp = () => {
    if (formData.mobileNumber) {
      setFormData((prev) => ({ ...prev, whatsappNumber: prev.mobileNumber }));
      setFormErrors((prev) => {
        const copy = { ...prev };
        delete copy.whatsappNumber;
        return copy;
      });
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6 max-w-7xl mx-auto pb-12">
        {/* Toast Alert Notification */}
        {alert && (
          <div
            className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-medium transition-all transform animate-in fade-in slide-in-from-top-4 ${
              alert.type === 'success'
                ? 'bg-emerald-900 border-emerald-600 text-white'
                : 'bg-red-900 border-red-600 text-white'
            }`}
          >
            {alert.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            )}
            <span>{alert.message}</span>
            <button onClick={() => setAlert(null)} className="ml-2 text-white/70 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-brand-700/10 text-brand-700 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-brand-800" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 font-sans">
                Company Details
              </h1>
              <p className="text-xs text-slate-500">
                Manage company name, address, contact numbers, and Google Map location.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchCompanyDetails}
              title="Refresh from database"
              className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:text-brand-800 hover:bg-slate-50 transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            {company && !isEditing && (
              <>
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-2 px-4 py-2.5 bg-brand-800 hover:bg-brand-700 text-yellow-400 font-semibold text-xs rounded-xl shadow transition"
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="flex items-center gap-2 px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold text-xs rounded-xl border border-red-200 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </button>
              </>
            )}

            {!company && !isEditing && (
              <button
                onClick={handleStartAdd}
                className="flex items-center gap-2 px-5 py-2.5 bg-brand-800 hover:bg-brand-700 text-yellow-400 font-semibold text-xs rounded-xl shadow transition hover:scale-[1.02]"
              >
                <Plus className="w-4 h-4" />
                <span>Add Company Details</span>
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        {loading ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
            <Loader2 className="w-8 h-8 text-brand-700 animate-spin mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Loading company details from database...</p>
          </div>
        ) : isEditing || !company ? (
          /* ============================================================== */
          /* FORM VIEW (ADD / EDIT)                                         */
          /* ============================================================== */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-brand-800 text-white px-6 py-4 flex items-center justify-between">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Building className="w-4 h-4 text-yellow-400" />
                <span>{company ? 'Edit Company Details' : 'Add Company Details'}</span>
              </h2>
              {company && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="text-xs text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSaveSubmit} className="p-6 sm:p-8 space-y-6">
              {/* Section 1: Basic Information */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-brand-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Building className="w-4 h-4" /> Basic Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. AiCura Diagnostics"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className={`w-full px-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900 ${
                        formErrors.companyName ? 'border-red-500' : 'border-slate-200'
                      }`}
                    />
                    {formErrors.companyName && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.companyName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Branch / Center Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Main Diagnostic Center"
                      value={formData.branchName}
                      onChange={(e) => setFormData({ ...formData, branchName: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Website URL
                    </label>
                    <div className="relative">
                      <Globe className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="https://aicuradiagnostics.in"
                        value={formData.websiteUrl}
                        onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      GSTIN / Registration / License No.
                    </label>
                    <div className="relative">
                      <FileText className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="e.g. 32AABCU9603R1ZM"
                        value={formData.taxNumber}
                        onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                        className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Contact Numbers */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-brand-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Phone className="w-4 h-4" /> Contact Numbers & Communication
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. +91 99462 84615"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900 ${
                          formErrors.mobileNumber ? 'border-red-500' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {formErrors.mobileNumber && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.mobileNumber}</p>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-slate-700">
                        WhatsApp Number <span className="text-red-500">*</span>
                      </label>
                      {formData.mobileNumber && (
                        <button
                          type="button"
                          onClick={copyMobileToWhatsapp}
                          className="text-[11px] text-brand-700 hover:underline font-semibold"
                        >
                          Same as Mobile
                        </button>
                      )}
                    </div>
                    <div className="relative">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. +91 99462 84615"
                        value={formData.whatsappNumber}
                        onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900 ${
                          formErrors.whatsappNumber ? 'border-red-500' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {formErrors.whatsappNumber && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.whatsappNumber}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Alternate Phone / Helpline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 0484 2345678"
                      value={formData.alternatePhone}
                      onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
                      className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Official Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        placeholder="info@aicuradiagnostics.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900 ${
                          formErrors.email ? 'border-red-500' : 'border-slate-200'
                        }`}
                      />
                    </div>
                    {formErrors.email && (
                      <p className="text-[11px] text-red-500 mt-1">{formErrors.email}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Physical Address & Map */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-brand-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <MapPin className="w-4 h-4" /> Physical Address & Map Link
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Address <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="e.g. AiCura Diagnostic Center, Health Avenue, Near Medical Trust, MG Road"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className={`w-full px-3.5 py-2 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900 ${
                      formErrors.address ? 'border-red-500' : 'border-slate-200'
                    }`}
                  />
                  {formErrors.address && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City</label>
                    <input
                      type="text"
                      placeholder="e.g. Kochi"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">State</label>
                    <input
                      type="text"
                      placeholder="e.g. Kerala"
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pincode</label>
                    <input
                      type="text"
                      placeholder="e.g. 682001"
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                      className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Google Maps Link <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="url"
                      required
                      placeholder="https://maps.google.com/?q=..."
                      value={formData.mapLink}
                      onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                      className={`w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900 ${
                        formErrors.mapLink ? 'border-red-500' : 'border-slate-200'
                      }`}
                    />
                  </div>
                  {formErrors.mapLink && (
                    <p className="text-[11px] text-red-500 mt-1">{formErrors.mapLink}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    Google Maps share or location link for patients to find your diagnostics laboratory.
                  </p>
                </div>
              </div>

              {/* Section 4: Operational Hours */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-brand-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
                  <Clock className="w-4 h-4" /> Operational Hours
                </h3>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Working Hours
                  </label>
                  <div className="relative">
                    <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="e.g. Mon - Sat: 7:00 AM - 8:00 PM | Sun: 7:00 AM - 2:00 PM"
                      value={formData.workingHours}
                      onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                      className="w-full pl-9 pr-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-700 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                {company && (
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-brand-800 hover:bg-brand-700 text-yellow-400 font-semibold text-xs rounded-xl shadow transition disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving in Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{company ? 'Update Company Details' : 'Save Company Details'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* ============================================================== */
          /* VIEW MODE (SAVED DETAILS CARD)                                 */
          /* ============================================================== */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-6 p-6 sm:p-8">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-bold text-slate-900 font-sans">
                    {company.companyName}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Saved in Database
                  </span>
                </div>
                {company.branchName && (
                  <p className="text-xs font-semibold text-brand-700 mt-1">
                    {company.branchName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartEdit}
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-800 text-yellow-400 font-semibold text-xs rounded-xl hover:bg-brand-700 transition shadow"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Details</span>
                </button>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition border border-transparent hover:border-red-100"
                  title="Delete company details"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Mobile Number
                </span>
                <a
                  href={`tel:${company.mobileNumber}`}
                  className="text-base font-bold text-slate-900 hover:text-brand-700 flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-brand-700 shrink-0" />
                  <span>{company.mobileNumber}</span>
                </a>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  WhatsApp Number
                </span>
                <a
                  href={`https://wa.me/${company.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base font-bold text-emerald-700 hover:underline flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{company.whatsappNumber}</span>
                </a>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Official Email
                </span>
                <a
                  href={company.email ? `mailto:${company.email}` : '#'}
                  className="text-xs font-bold text-slate-800 hover:text-brand-700 flex items-center gap-2 mt-1 truncate"
                >
                  <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="truncate">{company.email || 'Not specified'}</span>
                </a>
              </div>
            </div>

            {/* Address & Location card */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-700 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Physical Address
                    </h3>
                    <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                      {company.address}
                    </p>
                    {(company.city || company.state || company.pincode) && (
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {[company.city, company.state, company.pincode].filter(Boolean).join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                {company.mapLink && (
                  <a
                    href={company.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-800 text-yellow-400 rounded-lg text-xs font-semibold hover:bg-brand-700 transition shrink-0 shadow"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>View on Map</span>
                  </a>
                )}
              </div>
            </div>

            {/* Additional details: Working hours, website, tax info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                <Clock className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-slate-800 block">Working Hours</span>
                  <span className="text-slate-600 mt-0.5 block whitespace-pre-line">
                    {company.workingHours || 'Not specified'}
                  </span>
                </div>
              </div>

              {company.alternatePhone && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                  <Phone className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Alternate Phone / Helpline</span>
                    <span className="text-slate-600 mt-0.5 block">{company.alternatePhone}</span>
                  </div>
                </div>
              )}

              {company.websiteUrl && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                  <Globe className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">Website</span>
                    <a
                      href={company.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-700 hover:underline mt-0.5 inline-flex items-center gap-1 font-medium"
                    >
                      <span>{company.websiteUrl}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {company.taxNumber && (
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-3">
                  <FileText className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-slate-800 block">GST / Registration No.</span>
                    <span className="font-mono text-slate-600 mt-0.5 block">{company.taxNumber}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteModalOpen && company && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-3xl max-w-md w-full border border-slate-200 shadow-2xl p-6 space-y-4 animate-in fade-in zoom-in-95">
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-base font-bold text-slate-900">Delete Company Details?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Are you sure you want to delete the company details for{' '}
                  <span className="font-bold text-slate-800">"{company.companyName}"</span>?
                  This will remove it from the PostgreSQL database.
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  disabled={deleting}
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleting}
                  onClick={handleDeleteConfirm}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-xs rounded-xl shadow transition disabled:opacity-50"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4" />
                      <span>Yes, Delete</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
