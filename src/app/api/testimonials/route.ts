import { NextRequest } from 'next/server';
import { TestimonialService } from '@/services/testimonial.service';
import { getAdminFromRequest } from '@/lib/auth';
import { validateTestimonialInput } from '@/lib/validation';
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
    const all = searchParams.get('all') === 'true';
    const search = searchParams.get('search') || undefined;

    let isFeatured: boolean | undefined = true;
    if (all) {
      const adminSession = await getAdminFromRequest(req);
      if (adminSession) {
        isFeatured = undefined;
      }
    } else if (searchParams.has('isFeatured')) {
      isFeatured = searchParams.get('isFeatured') === 'true';
    }

    const testimonials = await TestimonialService.listTestimonials({
      isFeatured,
      search,
    });

    return successResponse(testimonials);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to manage patient reviews');
    }

    const body = await req.json().catch(() => ({}));
    const errors = validateTestimonialInput(body, false);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const testimonial = await TestimonialService.createTestimonial(body);
    return createdResponse(testimonial, 'Patient review created successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
