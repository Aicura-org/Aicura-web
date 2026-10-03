import { ApiErrorDetail, CreatePackageInput, CreateCampaignInput, CreateEnquiryInput } from '@/types';

export function validateLoginInput(body: { email?: string; password?: string }): ApiErrorDetail[] {
  const errors: ApiErrorDetail[] = [];
  if (!body.email || typeof body.email !== 'string' || !body.email.includes('@')) {
    errors.push({ field: 'email', message: 'Valid email address is required' });
  }
  if (!body.password || typeof body.password !== 'string' || body.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }
  return errors;
}

export function validatePackageInput(body: Partial<CreatePackageInput>, isUpdate = false): ApiErrorDetail[] {
  const errors: ApiErrorDetail[] = [];

  if (!isUpdate) {
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Package title is required' });
    }
    if (!body.category || typeof body.category !== 'string') {
      errors.push({ field: 'category', message: 'Category is required' });
    }
    if (typeof body.originalPrice !== 'number' || body.originalPrice <= 0) {
      errors.push({ field: 'originalPrice', message: 'Original price must be greater than 0' });
    }
    if (typeof body.discountedPrice !== 'number' || body.discountedPrice <= 0) {
      errors.push({ field: 'discountedPrice', message: 'Discounted price must be greater than 0' });
    }
    if (!body.description || typeof body.description !== 'string') {
      errors.push({ field: 'description', message: 'Description is required' });
    }
    if (!Array.isArray(body.includedTests) || body.includedTests.length === 0) {
      errors.push({ field: 'includedTests', message: 'At least one included test is required' });
    }
  } else {
    if (body.title !== undefined && (typeof body.title !== 'string' || body.title.trim().length === 0)) {
      errors.push({ field: 'title', message: 'Package title cannot be empty' });
    }
    if (body.originalPrice !== undefined && (typeof body.originalPrice !== 'number' || body.originalPrice <= 0)) {
      errors.push({ field: 'originalPrice', message: 'Original price must be greater than 0' });
    }
    if (body.discountedPrice !== undefined && (typeof body.discountedPrice !== 'number' || body.discountedPrice <= 0)) {
      errors.push({ field: 'discountedPrice', message: 'Discounted price must be greater than 0' });
    }
  }

  return errors;
}

export function validateCampaignInput(body: Partial<CreateCampaignInput>, isUpdate = false): ApiErrorDetail[] {
  const errors: ApiErrorDetail[] = [];

  if (!isUpdate) {
    if (!body.name || typeof body.name !== 'string' || body.name.trim().length === 0) {
      errors.push({ field: 'name', message: 'Campaign internal name is required' });
    }
    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      errors.push({ field: 'title', message: 'Campaign public title is required' });
    }
  }

  return errors;
}

export function validateEnquiryInput(body: Partial<CreateEnquiryInput>): ApiErrorDetail[] {
  const errors: ApiErrorDetail[] = [];

  if (!body.fullName || typeof body.fullName !== 'string' || body.fullName.trim().length < 2) {
    errors.push({ field: 'fullName', message: 'Full name is required (min 2 chars)' });
  }

  const phoneRegex = /^[6-9]\d{9}$|^(\+91[\-\s]?)?[6-9]\d{9}$/;
  if (!body.phone || typeof body.phone !== 'string' || !phoneRegex.test(body.phone.replace(/\s+/g, ''))) {
    errors.push({ field: 'phone', message: 'Valid 10-digit Indian phone number is required' });
  }

  if (body.email && typeof body.email === 'string' && body.email.length > 0) {
    if (!body.email.includes('@')) {
      errors.push({ field: 'email', message: 'Please provide a valid email address' });
    }
  }

  if (!body.type || !['HOME_COLLECTION', 'PACKAGE', 'CONTACT'].includes(body.type)) {
    errors.push({ field: 'type', message: 'Valid enquiry type (HOME_COLLECTION, PACKAGE, CONTACT) is required' });
  }

  return errors;
}

export function validateCompanyDetailsInput(
  body: Partial<import('@/types').CreateCompanyDetailsInput>,
  isUpdate = false
): ApiErrorDetail[] {
  const errors: ApiErrorDetail[] = [];

  if (!isUpdate) {
    if (!body.companyName || typeof body.companyName !== 'string' || body.companyName.trim().length === 0) {
      errors.push({ field: 'companyName', message: 'Company Name is required' });
    }
    if (!body.address || typeof body.address !== 'string' || body.address.trim().length === 0) {
      errors.push({ field: 'address', message: 'Address is required' });
    }
    if (!body.mobileNumber || typeof body.mobileNumber !== 'string' || body.mobileNumber.trim().length === 0) {
      errors.push({ field: 'mobileNumber', message: 'Mobile Number is required' });
    }
    if (!body.whatsappNumber || typeof body.whatsappNumber !== 'string' || body.whatsappNumber.trim().length === 0) {
      errors.push({ field: 'whatsappNumber', message: 'WhatsApp Number is required' });
    }
    if (!body.mapLink || typeof body.mapLink !== 'string' || body.mapLink.trim().length === 0) {
      errors.push({ field: 'mapLink', message: 'Map Link is required' });
    }
  } else {
    if (body.companyName !== undefined && (typeof body.companyName !== 'string' || body.companyName.trim().length === 0)) {
      errors.push({ field: 'companyName', message: 'Company Name cannot be empty' });
    }
    if (body.address !== undefined && (typeof body.address !== 'string' || body.address.trim().length === 0)) {
      errors.push({ field: 'address', message: 'Address cannot be empty' });
    }
    if (body.mobileNumber !== undefined && (typeof body.mobileNumber !== 'string' || body.mobileNumber.trim().length === 0)) {
      errors.push({ field: 'mobileNumber', message: 'Mobile Number cannot be empty' });
    }
    if (body.whatsappNumber !== undefined && (typeof body.whatsappNumber !== 'string' || body.whatsappNumber.trim().length === 0)) {
      errors.push({ field: 'whatsappNumber', message: 'WhatsApp Number cannot be empty' });
    }
    if (body.mapLink !== undefined && (typeof body.mapLink !== 'string' || body.mapLink.trim().length === 0)) {
      errors.push({ field: 'mapLink', message: 'Map Link cannot be empty' });
    }
  }

  if (body.email && typeof body.email === 'string' && body.email.trim().length > 0) {
    if (!body.email.includes('@')) {
      errors.push({ field: 'email', message: 'Please provide a valid email address' });
    }
  }

  return errors;
}

