import { NextRequest } from 'next/server';
import { CampaignService } from '@/services/campaign.service';
import { getAdminFromRequest } from '@/lib/auth';
import { validateCampaignInput } from '@/lib/validation';
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
    let campaign = await CampaignService.getCampaignById(id);
    if (!campaign) {
      campaign = await CampaignService.getCampaignBySlug(id);
    }

    if (!campaign) {
      return notFoundResponse('Campaign');
    }

    return successResponse(campaign);
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
      return unauthorizedResponse('Authentication required to update campaign');
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const errors = validateCampaignInput(body, true);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const updated = await CampaignService.updateCampaign(id, body);
    if (!updated) {
      return notFoundResponse('Campaign');
    }

    return successResponse(updated, 'Campaign updated successfully');
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
      return unauthorizedResponse('Authentication required to delete campaign');
    }

    const { id } = await params;
    await CampaignService.deleteCampaign(id);
    return successResponse({ id }, 'Campaign deleted successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
