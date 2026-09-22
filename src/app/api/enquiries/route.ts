import { NextRequest } from 'next/server';
import { EnquiryService } from '@/services/enquiry.service';
import { getAdminFromRequest } from '@/lib/auth';
import { validateEnquiryInput } from '@/lib/validation';
import {
  successResponse,
  createdResponse,
  validationErrorResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/api-response';
import { EnquiryStatus, EnquiryType } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to view enquiries');
    }

    const { searchParams } = new URL(req.url);
    
    // Check if dashboard stats requested
    if (searchParams.get('mode') === 'stats') {
      const stats = await EnquiryService.getDashboardStats();
      return successResponse(stats);
    }

    const type = (searchParams.get('type') as EnquiryType) || undefined;
    const status = (searchParams.get('status') as EnquiryStatus) || undefined;
    const campaignId = searchParams.get('campaignId') || undefined;
    const search = searchParams.get('search') || undefined;
    const startDate = searchParams.get('startDate') || undefined;
    const endDate = searchParams.get('endDate') || undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const result = await EnquiryService.listEnquiries({
      type,
      status,
      campaignId,
      search,
      startDate,
      endDate,
      page,
      limit,
    });

    return successResponse(result);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const errors = validateEnquiryInput(body);

    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const enquiry = await EnquiryService.createEnquiry(body);
    return createdResponse(enquiry, 'Enquiry submitted successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
