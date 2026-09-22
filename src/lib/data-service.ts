import { getSupabase } from './supabase';
import {
  INITIAL_PACKAGES,
  INITIAL_TESTS,
  INITIAL_BLOGS,
  INITIAL_TESTIMONIALS,
  INITIAL_FAQS,
  HealthPackage,
  DiagnosticTest,
  HealthBlog,
  Testimonial,
  FAQItem
} from '@/data/initialData';

// In-memory runtime cache for zero-breakage Vercel preview when Supabase is not configured
let localPackages = [...INITIAL_PACKAGES];
let localTests = [...INITIAL_TESTS];
let localBlogs = [...INITIAL_BLOGS];
let localTestimonials = [...INITIAL_TESTIMONIALS];
let localEnquiries: any[] = [];

export interface EnquirySubmission {
  id?: string;
  type: 'test' | 'package' | 'home_collection' | 'prescription';
  fullName: string;
  phone: string;
  email?: string;
  city?: string;
  address?: string;
  pincode?: string;
  selectedItem?: string;
  prescriptionUrl?: string;
  preferredDate?: string;
  preferredTime?: string;
  notes?: string;
  status?: string;
  createdAt?: string;
}

export const DataService = {
  // 1. PACKAGES
  async getPackages(): Promise<HealthPackage[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('packages').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          category: item.category,
          testCount: item.test_count,
          originalPrice: Number(item.original_price),
          discountedPrice: Number(item.discounted_price),
          description: item.description,
          includedTests: item.included_tests || [],
          isPopular: item.is_popular,
          badgeText: item.badge_text,
          imageUrl: item.image_url,
        }));
      }
    }
    return localPackages;
  },

  async getPackageBySlug(slug: string): Promise<HealthPackage | null> {
    const packages = await this.getPackages();
    return packages.find((p) => p.slug === slug) || null;
  },

  async savePackage(pkgData: Partial<HealthPackage>): Promise<HealthPackage> {
    const supabase = getSupabase();
    const slug = pkgData.title ? pkgData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : `pkg-${Date.now()}`;
    const newPkg: HealthPackage = {
      id: pkgData.id || `pkg-${Date.now()}`,
      title: pkgData.title || 'Untitled Package',
      slug,
      category: pkgData.category || 'General',
      testCount: pkgData.testCount || 10,
      originalPrice: pkgData.originalPrice || 2000,
      discountedPrice: pkgData.discountedPrice || 1499,
      description: pkgData.description || '',
      includedTests: pkgData.includedTests || [],
      isPopular: pkgData.isPopular || false,
      badgeText: pkgData.badgeText || '',
      imageUrl: pkgData.imageUrl || '',
    };

    if (supabase) {
      await supabase.from('packages').upsert({
        id: newPkg.id.startsWith('pkg-') ? undefined : newPkg.id,
        title: newPkg.title,
        slug: newPkg.slug,
        category: newPkg.category,
        test_count: newPkg.testCount,
        original_price: newPkg.originalPrice,
        discounted_price: newPkg.discountedPrice,
        description: newPkg.description,
        included_tests: newPkg.includedTests,
        is_popular: newPkg.isPopular,
        badge_text: newPkg.badgeText,
        image_url: newPkg.imageUrl,
      });
    }

    const index = localPackages.findIndex((p) => p.id === newPkg.id);
    if (index >= 0) {
      localPackages[index] = newPkg;
    } else {
      localPackages.unshift(newPkg);
    }
    return newPkg;
  },

  async deletePackage(id: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('packages').delete().eq('id', id);
    }
    localPackages = localPackages.filter((p) => p.id !== id);
    return true;
  },

  // 2. DIAGNOSTIC TESTS
  async getTests(): Promise<DiagnosticTest[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('tests').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((t: any) => ({
          id: t.id,
          name: t.name,
          code: t.code,
          category: t.category,
          price: Number(t.price),
          originalPrice: t.original_price ? Number(t.original_price) : undefined,
          sampleType: t.sample_type,
          fastingRequired: t.fasting_required,
          reportTurnaround: t.report_turnaround,
          description: t.description,
        }));
      }
    }
    return localTests;
  },

  // 3. BLOGS / ARTICLES
  async getBlogs(): Promise<HealthBlog[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('blogs').select('*').order('published_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((b: any) => ({
          id: b.id,
          title: b.title,
          slug: b.slug,
          excerpt: b.excerpt,
          content: b.content,
          coverImage: b.cover_image,
          readTime: b.read_time,
          publishedAt: b.published_at ? new Date(b.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent',
          author: b.author,
        }));
      }
    }
    return localBlogs;
  },

  async getBlogBySlug(slug: string): Promise<HealthBlog | null> {
    const blogs = await this.getBlogs();
    return blogs.find((b) => b.slug === slug) || null;
  },

  // 4. TESTIMONIALS & FAQS
  async getTestimonials(): Promise<Testimonial[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data.map((t: any) => ({
          id: t.id,
          patientName: t.patient_name,
          location: t.location,
          comment: t.comment,
          rating: t.rating,
          avatarUrl: t.avatar_url,
        }));
      }
    }
    return localTestimonials;
  },

  getFAQs(): FAQItem[] {
    return INITIAL_FAQS;
  },

  // 5. ENQUIRIES & HOME COLLECTION BOOKINGS
  async getEnquiries(): Promise<EnquirySubmission[]> {
    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data.map((e: any) => ({
          id: e.id,
          type: e.type,
          fullName: e.full_name,
          phone: e.phone,
          email: e.email,
          city: e.city,
          address: e.address,
          pincode: e.pincode,
          selectedItem: e.selected_item,
          prescriptionUrl: e.prescription_url,
          preferredDate: e.preferred_date,
          preferredTime: e.preferred_time,
          notes: e.notes,
          status: e.status || 'pending',
          createdAt: e.created_at,
        }));
      }
    }
    return localEnquiries;
  },

  async createEnquiry(enquiry: EnquirySubmission): Promise<EnquirySubmission> {
    const supabase = getSupabase();
    const newEnquiry: EnquirySubmission = {
      ...enquiry,
      id: `enq-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    if (supabase) {
      await supabase.from('enquiries').insert({
        type: newEnquiry.type,
        full_name: newEnquiry.fullName,
        phone: newEnquiry.phone,
        email: newEnquiry.email || null,
        city: newEnquiry.city || null,
        address: newEnquiry.address || null,
        pincode: newEnquiry.pincode || null,
        selected_item: newEnquiry.selectedItem || null,
        prescription_url: newEnquiry.prescriptionUrl || null,
        preferred_date: newEnquiry.preferredDate || null,
        preferred_time: newEnquiry.preferredTime || null,
        notes: newEnquiry.notes || null,
        status: 'pending',
      });
    }

    localEnquiries.unshift(newEnquiry);
    return newEnquiry;
  },

  async updateEnquiryStatus(id: string, status: string): Promise<boolean> {
    const supabase = getSupabase();
    if (supabase) {
      await supabase.from('enquiries').update({ status }).eq('id', id);
    }
    const enquiry = localEnquiries.find((e) => e.id === id);
    if (enquiry) {
      enquiry.status = status;
    }
    return true;
  }
};
