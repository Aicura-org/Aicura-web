import { NextRequest } from 'next/server';
import { PackageService } from '@/services/package.service';
import { getAdminFromRequest } from '@/lib/auth';
import { validatePackageInput } from '@/lib/validation';
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let pkg = await PackageService.getPackageById(id);
    if (!pkg) {
      pkg = await PackageService.getPackageBySlug(id);
    }

    if (!pkg) {
      return notFoundResponse('Package');
    }

    return successResponse(pkg);
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
      return unauthorizedResponse('Authentication required to update package');
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    // Special quick action: toggle publish
    if (body.action === 'togglePublish') {
      const updated = await PackageService.togglePublish(id);
      if (!updated) return notFoundResponse('Package');
      return successResponse(updated, 'Package publish status updated');
    }

    const errors = validatePackageInput(body, true);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const updated = await PackageService.updatePackage(id, body);
    if (!updated) {
      return notFoundResponse('Package');
    }

    return successResponse(updated, 'Package updated successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to delete package');
    }

    const { id } = await params;
    await PackageService.deletePackage(id);
    return successResponse({ id }, 'Package deleted successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
