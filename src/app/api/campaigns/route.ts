import { NextRequest } from 'next/server';
import { CampaignService } from '@/services/campaign.service';
import { getAdminFromRequest } from '@/lib/auth';
import { validateCampaignInput } from '@/lib/validation';
import {
  successResponse,
  createdResponse,
  validationErrorResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    const { searchParams } = new URL(req.url);
    const isActive = adminSession
      ? searchParams.get('isActive') === 'false' ? false : undefined
      : true;

    const campaigns = await CampaignService.listCampaigns({ isActive });
    return successResponse(campaigns);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to create campaign');
    }

    const body = await req.json().catch(() => ({}));
    const errors = validateCampaignInput(body);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const campaign = await CampaignService.createCampaign(body);
    return createdResponse(campaign, 'Campaign created successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
