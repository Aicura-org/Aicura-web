import { NextRequest } from 'next/server';
import { EnquiryService } from '@/services/enquiry.service';
import { getAdminFromRequest } from '@/lib/auth';
import {
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
  internalErrorResponse,
} from '@/lib/api-response';
import { EnquiryStatus } from '@/types';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to view enquiry details');
    }

    const { id } = await params;
    const enquiry = await EnquiryService.getEnquiryById(id);
    if (!enquiry) {
      return notFoundResponse('Enquiry');
    }

    return successResponse(enquiry);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to update enquiry');
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    if (!body.status || !['NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].includes(body.status)) {
      return validationErrorResponse([
        { field: 'status', message: 'Valid status (NEW, CONTACTED, CONFIRMED, COMPLETED, CANCELLED) is required' },
      ]);
    }

    const updated = await EnquiryService.updateEnquiryStatus(id, body.status as EnquiryStatus);
    if (!updated) {
      return notFoundResponse('Enquiry');
    }

    return successResponse(updated, 'Enquiry status updated successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
