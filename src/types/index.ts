// Standardized API Response format
export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
}

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  error?: {
    code?: string;
    details?: ApiErrorDetail[] | string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedData<T> {
  items: T[];
  pagination: PaginatedMeta;
}

// Enums
export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'STAFF';
export type EnquiryType = 'HOME_COLLECTION' | 'PACKAGE' | 'CONTACT';
export type EnquiryStatus = 'NEW' | 'CONTACTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

// Domain Entities
export interface AdminUserProfile {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
}

export interface PackageItem {
  id: string;
  title: string;
  slug: string;
  category: string;
  testCount: number;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  includedTests: string[];
  benefits: string[];
  preparation?: string | null;
  imageUrl?: string | null;
  isPopular: boolean;
  badgeText?: string | null;
  isPublished: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CampaignSectionItem {
  id: string;
  campaignId: string;
  title: string;
  content: string;
  imageUrl?: string | null;
  displayOrder: number;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CampaignItem {
  id: string;
  name: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  heroImageUrl?: string | null;
  ctaText: string;
  ctaLink?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  isActive: boolean;
  startDate?: string | Date | null;
  endDate?: string | Date | null;
  sections?: CampaignSectionItem[];
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface CustomerItem {
  id: string;
  fullName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  pincode?: string | null;
}

export interface EnquiryItem {
  id: string;
  type: EnquiryType;
  customerId: string;
  customer: CustomerItem;
  campaignId?: string | null;
  campaign?: { id: string; name: string; slug: string } | null;
  status: EnquiryStatus;
  message?: string | null;
  prescriptionUrl?: string | null;
  preferredDate?: string | null;
  preferredTime?: string | null;
  tests?: { id: string; testName: string }[];
  package?: {
    id: string;
    packageId: string;
    quantity: number;
    package: { title: string; discountedPrice: number };
  } | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

// Inputs
export interface CreatePackageInput {
  title: string;
  slug?: string;
  category: string;
  testCount: number;
  originalPrice: number;
  discountedPrice: number;
  description: string;
  includedTests: string[];
  benefits?: string[];
  preparation?: string;
  imageUrl?: string;
  isPopular?: boolean;
  badgeText?: string;
  isPublished?: boolean;
}

export interface UpdatePackageInput extends Partial<CreatePackageInput> {}

export interface CreateCampaignInput {
  name: string;
  slug?: string;
  title: string;
  subtitle?: string;
  description?: string;
  heroImageUrl?: string;
  ctaText?: string;
  ctaLink?: string;
  seoTitle?: string;
  seoDescription?: string;
  isActive?: boolean;
  startDate?: string;
  endDate?: string;
}

export interface UpdateCampaignInput extends Partial<CreateCampaignInput> {}

export interface CreateEnquiryInput {
  type: EnquiryType;
  fullName: string;
  phone: string;
  email?: string;
  address?: string;
  city?: string;
  pincode?: string;
  campaignId?: string;
  campaignSlug?: string;
  message?: string;
  prescriptionUrl?: string;
  preferredDate?: string;
  preferredTime?: string;
  tests?: string[];
  packageId?: string;
  packageQuantity?: number;
}

export interface EnquiryFilterParams {
  type?: EnquiryType;
  status?: EnquiryStatus;
  campaignId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AboutSectionItem {
  id: string;
  badgeText?: string | null;
  titlePrefix?: string | null;
  titleHighlight?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  imagePublicId?: string | null;
  badge1Title?: string | null;
  badge1Subtitle?: string | null;
  badge2Title?: string | null;
  badge2Subtitle?: string | null;
  badge3Text?: string | null;
  pillar1Title?: string | null;
  pillar1Desc?: string | null;
  pillar2Title?: string | null;
  pillar2Desc?: string | null;
  pillar3Title?: string | null;
  pillar3Desc?: string | null;
  pillar4Title?: string | null;
  pillar4Desc?: string | null;
  primaryBtnText?: string | null;
  primaryBtnLink?: string | null;
  secondaryBtnText?: string | null;
  isActive: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}

