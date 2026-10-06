'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Send,
  ChevronDown,
} from 'lucide-react';
import { CompanyDetailsItem } from '@/types';

export default function Footer() {
  const [company, setCompany] = useState<CompanyDetailsItem | null>(null);

  // Mobile accordion states
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/company-details?primary=true')
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (json?.success && json.data) {
          setCompany(json.data);
        }
      })
      .catch(() => {});
  }, []);

  const formattedAddress = company
    ? [company.address, company.city, company.state, company.pincode]
        .filter(Boolean)
        .join(', ')
    : '123, Health Avenue, Kochi, Kerala - 682001';

  const toggleSection = (section: string) => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  return (
    <footer className="bg-brand-800 text-slate-300 pt-16 pb-8 border-t border-brand-700/60 relative overflow-hidden">

      {/* Decorative accent shape */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-700/20 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-brand-700/60">

          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-1">
            <Link href="/" className="flex items-center">
              <img
                src="/logo.png"
                alt="AiCura Diagnostics"
                className="h-20 sm:h-24 w-auto object-contain hover:scale-105 transition-transform"
              />
            </Link>

            <p className="text-slate-300 text-sm leading-relaxed pr-4">
              Committed to accurate diagnostics and better healthcare for a healthier tomorrow. Certified lab facilities with home sample collection at your doorstep.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-brand-700/60 hover:bg-yellow-500 hover:text-brand-900 flex items-center justify-center text-slate-300 transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-brand-700/60 hover:bg-yellow-500 hover:text-brand-900 flex items-center justify-center text-slate-300 transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-brand-700/60 hover:bg-yellow-500 hover:text-brand-900 flex items-center justify-center text-slate-300 transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>

              <a
                href="#"
                className="w-9 h-9 rounded-full bg-brand-700/60 hover:bg-yellow-500 hover:text-brand-900 flex items-center justify-center text-slate-300 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">

            {/* Desktop Heading */}
            <h3 className="hidden lg:block text-white text-base font-semibold tracking-wide">
              Quick Links
            </h3>

            {/* Mobile Heading */}
            <button
              type="button"
              onClick={() => toggleSection('quick-links')}
              className="lg:hidden w-full flex items-center justify-between text-white text-base font-semibold tracking-wide py-1"
              aria-expanded={openSection === 'quick-links'}
            >
              <span>Quick Links</span>

              <ChevronDown
                className={`w-5 h-5 text-yellow-400 transition-transform duration-300 ${
                  openSection === 'quick-links' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Links */}
            <ul
              className={`space-y-2 text-sm ${
                openSection === 'quick-links'
                  ? 'block'
                  : 'hidden'
              } lg:block`}
            >
              <li>
                <Link
                  href="/"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  href="/about"
                  className="hover:text-yellow-400 transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  href="/tests-services"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Tests & Services
                </Link>
              </li>

              <li>
                <Link
                  href="/packages"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Health Packages
                </Link>
              </li>

              <li>
                <Link
                  href="/home-collection"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Home Collection
                </Link>
              </li>

              <li>
                <Link
                  href="/campaigns"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Special Campaigns
                </Link>
              </li>

              <li>
                <Link
                  href="/gallery"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Gallery
                </Link>
              </li>

              <li>
                <Link
                  href="/blog"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Blog & News
                </Link>
              </li>

              <li>
                <Link
                  href="/contact"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Our Services */}
          <div className="space-y-3">

            {/* Desktop Heading */}
            <h3 className="hidden lg:block text-white text-base font-semibold tracking-wide">
              Our Services
            </h3>

            {/* Mobile Heading */}
            <button
              type="button"
              onClick={() => toggleSection('services')}
              className="lg:hidden w-full flex items-center justify-between text-white text-base font-semibold tracking-wide py-1"
              aria-expanded={openSection === 'services'}
            >
              <span>Our Services</span>

              <ChevronDown
                className={`w-5 h-5 text-yellow-400 transition-transform duration-300 ${
                  openSection === 'services' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Services Links */}
            <ul
              className={`space-y-2 text-sm ${
                openSection === 'services'
                  ? 'block'
                  : 'hidden'
              } lg:block`}
            >
              <li>
                <Link
                  href="/tests-services?cat=Blood"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Blood Tests
                </Link>
              </li>

              <li>
                <Link
                  href="/tests-services?cat=Diabetes"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Diabetes Care
                </Link>
              </li>

              <li>
                <Link
                  href="/packages"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Health Checkups
                </Link>
              </li>

              <li>
                <Link
                  href="/tests-services?cat=Women"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Women's Tests
                </Link>
              </li>

              <li>
                <Link
                  href="/tests-services?cat=Thyroid"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Thyroid Tests
                </Link>
              </li>

              <li>
                <Link
                  href="/tests-services?cat=Allergy"
                  className="hover:text-yellow-400 transition-colors"
                >
                  Allergy Tests
                </Link>
              </li>

              <li>
                <Link
                  href="/tests-services"
                  className="hover:text-yellow-400 transition-colors"
                >
                  More Tests
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us & Newsletter */}
          <div className="space-y-4">

            {/* Desktop Heading */}
            <h3 className="hidden lg:block text-white text-base font-semibold tracking-wide">
              Contact Us
            </h3>

            {/* Mobile Heading */}
            <button
              type="button"
              onClick={() => toggleSection('contact')}
              className="lg:hidden w-full flex items-center justify-between text-white text-base font-semibold tracking-wide py-1"
              aria-expanded={openSection === 'contact'}
            >
              <span>Contact Us</span>

              <ChevronDown
                className={`w-5 h-5 text-yellow-400 transition-transform duration-300 ${
                  openSection === 'contact' ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Contact Content */}
            <div
              className={`${
                openSection === 'contact'
                  ? 'block'
                  : 'hidden'
              } lg:block`}
            >
              <ul className="space-y-2.5 text-xs text-slate-300">

                {/* Phone */}
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />

                  <a
                    href={`tel:${company?.mobileNumber || '+919946284615'}`}
                    className="hover:text-yellow-400 font-semibold"
                  >
                    {company?.mobileNumber || '+91 99462 84615'}
                  </a>
                </li>

                {/* Email */}
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />

                  <a
                    href={`mailto:${
                      company?.email || 'info@aicuradiagnostics.in'
                    }`}
                    className="hover:text-yellow-400"
                  >
                    {company?.email || 'info@aicuradiagnostics.in'}
                  </a>
                </li>

                {/* Address */}
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />

                  {company?.mapLink ? (
                    <a
                      href={company.mapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-yellow-400"
                    >
                      {formattedAddress}
                    </a>
                  ) : (
                    <span>{formattedAddress}</span>
                  )}
                </li>

                {/* Working Hours */}
                <li className="flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />

                  <span className="whitespace-pre-line">
                    {company?.workingHours ||
                      'Mon - Sat: 7:00 AM - 8:00 PM\nSunday: 7:00 AM - 2:00 PM'}
                  </span>
                </li>

              </ul>

              {/* Newsletter form */}
              <div className="pt-2">

                <span className="text-xs font-medium text-white block mb-1.5">
                  Subscribe to Our Updates
                </span>

                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex"
                >
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="w-full px-3 py-2 bg-brand-900/80 border border-brand-600 rounded-l-md text-xs text-white placeholder-slate-400 focus:outline-none focus:border-yellow-400"
                  />

                  <button
                    type="submit"
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3.5 py-2 rounded-r-md flex items-center justify-center transition-colors"
                    aria-label="Subscribe"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">

          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="hover:text-slate-200"
            >
              Privacy Policy
            </Link>

            <Link
              href="/terms"
              className="hover:text-slate-200"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/refund"
              className="hover:text-slate-200"
            >
              Refund Policy
            </Link>

            <Link
              href="/admin/login"
              className="text-yellow-400 hover:underline font-medium"
            >
              Admin Portal
            </Link>
          </div>

          <p>
            © {new Date().getFullYear()} AiCura Diagnostics. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}