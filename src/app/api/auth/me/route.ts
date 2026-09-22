import { NextRequest } from 'next/server';
import { getAdminFromRequest } from '@/lib/auth';
import { AuthService } from '@/services/auth.service';
import { successResponse, unauthorizedResponse, internalErrorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Not authenticated');
    }

    const profile = await AuthService.getAdminProfile(adminSession.sub);
    if (!profile || !profile.isActive) {
      return unauthorizedResponse('User session invalid or deactivated');
    }

    return successResponse(profile);
  } catch (error) {
    return internalErrorResponse(error);
  }
}
