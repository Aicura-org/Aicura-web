'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { CalendarCheck, Package, Megaphone, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';

interface StatsData {
  totalEnquiries: number;
  newEnquiries: number;
  contactedEnquiries: number;
  completedEnquiries: number;
  totalPackages: number;
  activeCampaigns: number;
  recentEnquiries: Array<{
    id: string;
    type: string;
    status: string;
    customer: { fullName: string; phone: string };
    campaign?: { name: string } | null;
    createdAt: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/enquiries?mode=stats');
        if (res.ok) {
          const data = await res.json();
          if (data.success) {
            setStats(data.data);
          }
        }
      } catch (err) {
        console.error('Failed to load dashboard stats', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl mx-auto">
        
        {/* Welcome Banner */}
        <div className="bg-brand-700 text-white p-8 rounded-3xl border border-emerald-600 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-yellow-400 text-xs font-bold uppercase tracking-wider block">Overview</span>
            <h1 className="text-2xl sm:text-3xl font-bold font-sans">AiCura Diagnostics Management</h1>
            <p className="text-slate-200 text-xs mt-1">Manage health packages, active campaign drives, and patient home collection requests.</p>
          </div>
          <div className="flex flex-wrap gap-2.5 items-center">
            <Link
              href="/admin/home-collection"
              className="px-4 py-2.5 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-bold text-xs rounded-xl shadow shrink-0 transition-all flex items-center gap-1.5"
            >
              <span>🛵 Home Collection CMS</span>
            </Link>
            <Link
              href="/admin/enquiries?status=NEW"
              className="px-5 py-2.5 gold-gradient text-brand-900 font-bold text-xs rounded-xl shadow shrink-0 w-fit hover:scale-105 transition-transform flex items-center gap-1.5"
            >
              View {stats?.newEnquiries ?? 0} New Enquiries <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>


        {/* Stats Grid */}
        {loading ? (
          <div className="py-12 flex items-center justify-center text-slate-400 gap-2 text-xs">
            <Loader2 className="w-5 h-5 animate-spin text-brand-700" /> Loading dashboard metrics...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Total Enquiries</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-brand-700 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-sans">{stats?.totalEnquiries ?? 0}</div>
              <span className="text-[11px] text-amber-600 font-semibold">{stats?.newEnquiries ?? 0} NEW awaiting response</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Published Packages</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-brand-700 flex items-center justify-center">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-sans">{stats?.totalPackages ?? 0}</div>
              <span className="text-[11px] text-slate-500 font-medium">Available on website</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Active Campaigns</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-brand-700 flex items-center justify-center">
                  <Megaphone className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-900 font-sans">{stats?.activeCampaigns ?? 0}</div>
              <span className="text-[11px] text-emerald-600 font-medium">Live promo drives</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase">Completed Bookings</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-brand-700 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-brand-700 font-sans">{stats?.completedEnquiries ?? 0}</div>
              <span className="text-[11px] text-slate-500 font-medium">Successfully processed</span>
            </div>
          </div>
        )}

        {/* Recent Enquiries Preview */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">Recent Patient Bookings & Enquiries</h2>
              <p className="text-xs text-slate-500">Real-time incoming home collection and package requests</p>
            </div>
            <Link href="/admin/enquiries" className="text-xs text-brand-700 hover:underline font-bold">
              View All Enquiries →
            </Link>
          </div>

          {!stats || stats.recentEnquiries.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">No patient enquiries logged yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <tr>
                    <th className="p-3">Patient Name</th>
                    <th className="p-3">Type</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Campaign Attribution</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentEnquiries.map((e) => (
                    <tr key={e.id} className="hover:bg-slate-50/80">
                      <td className="p-3 font-semibold text-slate-900">{e.customer.fullName}</td>
                      <td className="p-3 font-mono text-[10px] uppercase text-brand-700 font-bold">{e.type}</td>
                      <td className="p-3 font-mono">{e.customer.phone}</td>
                      <td className="p-3 text-slate-600">
                        {e.campaign?.name ? (
                          <span className="bg-yellow-100 text-yellow-900 px-2 py-0.5 rounded text-[10px] font-semibold">
                            {e.campaign.name}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Direct Organic</span>
                        )}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            e.status === 'NEW'
                              ? 'bg-amber-100 text-amber-800'
                              : e.status === 'COMPLETED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {e.status}
                        </span>
                      </td>
                      <td className="p-3 text-right text-slate-500 font-mono text-[11px]">
                        {new Date(e.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
