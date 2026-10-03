import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CompanyService } from '@/services/company.service';
import { getAdminFromRequest } from '@/lib/auth';
import { validateCompanyDetailsInput } from '@/lib/validation';
import {
  successResponse,
  createdResponse,
  validationErrorResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const primaryOnly = searchParams.get('primary') === 'true';

    if (primaryOnly) {
      const primary = await CompanyService.getPrimaryCompanyDetails();
      return successResponse(primary);
    }

    const adminSession = await getAdminFromRequest(req);
    const isActive = adminSession ? undefined : true;

    const items = await CompanyService.listCompanyDetails({ isActive });
    return successResponse(items);
  } catch (error) {
    console.error('GET /api/company-details error:', error);
    return internalErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession && process.env.NODE_ENV === 'production') {
      return unauthorizedResponse('Authentication required to manage company details');
    }

    const body = await req.json().catch(() => ({}));
    const errors = validateCompanyDetailsInput(body, false);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    // Check if an existing company record exists
    const existing = await prisma.companyDetails.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    let item;
    if (existing) {
      item = await CompanyService.updateCompanyDetails(existing.id, body);
    } else {
      item = await CompanyService.createCompanyDetails(body);
    }

    return createdResponse(item, 'Company details saved successfully in database');
  } catch (error) {
    console.error('POST /api/company-details error:', error);
    return internalErrorResponse(error);
  }
}
