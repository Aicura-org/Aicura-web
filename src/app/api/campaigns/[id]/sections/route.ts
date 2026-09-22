import { NextRequest } from 'next/server';
import { CampaignService } from '@/services/campaign.service';
import { getAdminFromRequest } from '@/lib/auth';
import {
  createdResponse,
  successResponse,
  unauthorizedResponse,
  validationErrorResponse,
  internalErrorResponse,
} from '@/lib/api-response';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to manage sections');
    }

    const { id: campaignId } = await params;
    const body = await req.json().catch(() => ({}));

    if (!body.title || !body.content) {
      return validationErrorResponse([
        { field: 'title', message: 'Section title is required' },
        { field: 'content', message: 'Section content is required' },
      ]);
    }

    const section = await CampaignService.addSection(campaignId, {
      title: body.title,
      content: body.content,
      imageUrl: body.imageUrl,
      displayOrder: body.displayOrder,
    });

    return createdResponse(section, 'Campaign section added');
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
      return unauthorizedResponse('Authentication required to delete section');
    }

    const { searchParams } = new URL(req.url);
    const sectionId = searchParams.get('sectionId');
    if (!sectionId) {
      return validationErrorResponse([{ field: 'sectionId', message: 'sectionId query param required' }]);
    }

    await CampaignService.deleteSection(sectionId);
    return successResponse({ sectionId }, 'Section deleted');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
