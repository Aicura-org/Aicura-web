import { NextRequest } from 'next/server';
import { TestimonialService } from '@/services/testimonial.service';
import { getAdminFromRequest } from '@/lib/auth';
import { validateTestimonialInput } from '@/lib/validation';
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
    const testimonial = await TestimonialService.getTestimonialById(id);
    if (!testimonial) {
      return notFoundResponse('Testimonial');
    }
    return successResponse(testimonial);
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
      return unauthorizedResponse('Authentication required to update patient review');
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    if (body.action === 'toggleFeatured') {
      const updated = await TestimonialService.toggleFeatured(id);
      if (!updated) return notFoundResponse('Testimonial');
      return successResponse(updated, 'Patient review visibility updated');
    }

    const errors = validateTestimonialInput(body, true);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const updated = await TestimonialService.updateTestimonial(id, body);
    if (!updated) {
      return notFoundResponse('Testimonial');
    }

    return successResponse(updated, 'Patient review updated successfully');
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
      return unauthorizedResponse('Authentication required to delete patient review');
    }

    const { id } = await params;
    const existing = await TestimonialService.getTestimonialById(id);
    if (!existing) {
      return notFoundResponse('Testimonial');
    }

    await TestimonialService.deleteTestimonial(id);
    return successResponse({ id }, 'Patient review deleted successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}

