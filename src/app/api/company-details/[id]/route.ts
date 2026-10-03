import { NextRequest } from 'next/server';
import { CompanyService } from '@/services/company.service';
import { getAdminFromRequest } from '@/lib/auth';
import { validateCompanyDetailsInput } from '@/lib/validation';
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await CompanyService.getCompanyDetailsById(id);

    if (!item) {
      return notFoundResponse('Company details');
    }

    return successResponse(item);
  } catch (error) {
    console.error('GET /api/company-details/[id] error:', error);
    return internalErrorResponse(error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession && process.env.NODE_ENV === 'production') {
      return unauthorizedResponse('Authentication required to update company details');
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    // Special quick action: toggle active
    if (body.action === 'toggleActive') {
      const existing = await CompanyService.getCompanyDetailsById(id);
      if (!existing) return notFoundResponse('Company details');
      const updated = await CompanyService.updateCompanyDetails(id, {
        isActive: !existing.isActive,
      });
      return successResponse(updated, 'Company status updated');
    }

    // Special quick action: set as primary
    if (body.action === 'setPrimary') {
      const updated = await CompanyService.updateCompanyDetails(id, {
        isPrimary: true,
      });
      if (!updated) return notFoundResponse('Company details');
      return successResponse(updated, 'Primary company updated');
    }

    const errors = validateCompanyDetailsInput(body, true);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const updated = await CompanyService.updateCompanyDetails(id, body);
    if (!updated) {
      return notFoundResponse('Company details');
    }

    return successResponse(updated, 'Company details updated successfully');
  } catch (error) {
    console.error('PATCH /api/company-details/[id] error:', error);
    return internalErrorResponse(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession && process.env.NODE_ENV === 'production') {
      return unauthorizedResponse('Authentication required to delete company details');
    }

    const { id } = await params;
    const deleted = await CompanyService.deleteCompanyDetails(id);

    if (!deleted) {
      return notFoundResponse('Company details');
    }

    return successResponse({ id }, 'Company details deleted successfully');
  } catch (error) {
    console.error('DELETE /api/company-details/[id] error:', error);
    return internalErrorResponse(error);
  }
}
