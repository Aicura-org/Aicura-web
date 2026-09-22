import { NextRequest } from 'next/server';
import { UploadService } from '@/services/upload.service';
import { getAdminFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, internalErrorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to upload files');
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return errorResponse('No file provided', 400);
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await UploadService.uploadImage(buffer, file.name, file.type);
    return successResponse({ url: uploadResult.url, public_id: uploadResult.public_id }, 'File uploaded successfully to Cloudinary');

  } catch (error: any) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400, 'CLOUDINARY_UPLOAD_ERROR');
    }
    return internalErrorResponse(error);
  }
}
