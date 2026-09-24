'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  LayoutDashboard,
  Package,
  CalendarCheck,
  Megaphone,
  Sparkles,
  Bike,
  Building,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Loader2,
} from 'lucide-react';
import { AdminUserProfile } from '@/types';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<AdminUserProfile | null>(null);
  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setAdminUser(json.data);
          } else {
            handleUnauthorized();
          }
        } else {
          handleUnauthorized();
        }
      } catch {
        handleUnauthorized();
      } finally {
        setAuthenticating(false);
      }
    }
    checkAuth();
  }, [pathname]);

  const handleUnauthorized = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aicura_admin_token');
    }
    if (pathname !== '/admin/login') {
      router.push('/admin/login');
    }
    setAuthenticating(false);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // Ignore
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('aicura_admin_token');
    }
    router.push('/admin/login');
  };

  const navs = [
    { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Hero Banner CMS', href: '/admin/hero', icon: Sparkles },
    { label: 'About Us CMS', href: '/admin/about', icon: Building },
    { label: 'Home Collection CMS', href: '/admin/home-collection', icon: Bike },
    { label: 'Packages CMS', href: '/admin/packages', icon: Package },
    { label: 'Campaigns CMS', href: '/admin/campaigns', icon: Megaphone },
    { label: 'Patient Enquiries', href: '/admin/enquiries', icon: CalendarCheck },
  ];


  if (authenticating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-yellow-400 animate-spin" />
          <p className="text-xs text-slate-400 font-medium">Verifying admin session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans relative">
      
      {/* Mobile Drawer Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
        />
      )}

      {/* Sidebar Desktop & Mobile Drawer */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col w-64 bg-brand-800 text-white border-r border-brand-700 p-5 justify-between shrink-0 transition-transform duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-6">
          
          {/* Header & Logo */}
          <div className="flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <span className="text-lg font-bold text-white block leading-none">AiCura</span>
                <span className="text-[10px] text-emerald-300 font-mono tracking-widest uppercase">CMS Admin</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-brand-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Badge */}
          {adminUser && (
            <div className="bg-brand-700/60 rounded-xl p-3 border border-brand-600/50 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-yellow-400 text-brand-900 font-bold flex items-center justify-center text-xs">
                {adminUser.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-white truncate">{adminUser.name}</p>
                <p className="text-[10px] text-slate-300 truncate">{adminUser.email}</p>
              </div>
            </div>
          )}

          {/* Nav Items */}
          <nav className="space-y-1.5 pt-2">
            {navs.map((n) => {
              const IconComp = n.icon;
              const active = pathname === n.href || (n.href !== '/admin/dashboard' && pathname.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    active ? 'bg-brand-700 text-yellow-400 shadow-md' : 'text-slate-300 hover:bg-brand-700/50 hover:text-white'
                  }`}
                >
                  <IconComp className="w-4 h-4" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="space-y-2 pt-6 border-t border-brand-700">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-brand-700/50"
          >
            <span>Live Public Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs text-red-400 hover:bg-red-500/10 font-semibold"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        
        {/* Top Navbar */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-base font-bold text-slate-900">Admin Control Panel</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              PostgreSQL Connected
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6 sm:p-8 flex-1">{children}</main>
      </div>

    </div>
  );
}
