import { NextRequest } from 'next/server';
import { PackageService } from '@/services/package.service';
import { getAdminFromRequest } from '@/lib/auth';
import { validatePackageInput } from '@/lib/validation';
import {
  successResponse,
  createdResponse,
  validationErrorResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const isPopular = searchParams.get('isPopular') === 'true' ? true : undefined;
    
    // Check if user is admin — if admin, return all packages; if public, only published
    const adminSession = await getAdminFromRequest(req);
    const isPublished = adminSession ? undefined : true;

    const packages = await PackageService.listPackages({
      isPublished,
      category,
      isPopular,
    });

    return successResponse(packages);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to create package');
    }

    const body = await req.json().catch(() => ({}));
    const errors = validatePackageInput(body);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const pkg = await PackageService.createPackage(body);
    return createdResponse(pkg, 'Package created successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
