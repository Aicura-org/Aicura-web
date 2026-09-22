import { prisma } from '@/lib/prisma';
import { successResponse, internalErrorResponse } from '@/lib/api-response';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { isFeatured: true },
      orderBy: { createdAt: 'desc' },
    });

    return successResponse(testimonials);
  } catch (error) {
    return internalErrorResponse(error);
  }
}
