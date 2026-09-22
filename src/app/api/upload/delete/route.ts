import { NextRequest } from 'next/server';
import { UploadService } from '@/services/upload.service';
import { getAdminFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, internalErrorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to delete Cloudinary images');
    }

    const body = await req.json();
    const { public_id } = body;

    if (!public_id) {
      return errorResponse('public_id is required', 400);
    }

    await UploadService.deleteImage(public_id);
    return successResponse({ public_id }, 'Image successfully deleted from Cloudinary');
  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400, 'CLOUDINARY_DELETE_ERROR');
    }
    return internalErrorResponse(error);
  }
}
