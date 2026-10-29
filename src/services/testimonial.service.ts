import { prisma } from '@/lib/prisma';
import { CreateTestimonialInput, UpdateTestimonialInput } from '@/types';

export const TestimonialService = {
  async listTestimonials(options?: { isFeatured?: boolean; search?: string }) {
    const where: any = {};

    if (options?.isFeatured !== undefined) {
      where.isFeatured = options.isFeatured;
    }

    if (options?.search && options.search.trim().length > 0) {
      const q = options.search.trim();
      where.OR = [
        { patientName: { contains: q, mode: 'insensitive' } },
        { location: { contains: q, mode: 'insensitive' } },
        { comment: { contains: q, mode: 'insensitive' } },
      ];
    }

    return prisma.testimonial.findMany({
      where,
      orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
    });
  },

  async getTestimonialById(id: string) {
    return prisma.testimonial.findUnique({
      where: { id },
    });
  },

  async createTestimonial(input: CreateTestimonialInput) {
    return prisma.testimonial.create({
      data: {
        patientName: input.patientName.trim(),
        location: input.location.trim(),
        comment: input.comment.trim(),
        rating: input.rating !== undefined ? Math.min(5, Math.max(1, Number(input.rating))) : 5,
        avatarUrl: input.avatarUrl && input.avatarUrl.trim() ? input.avatarUrl.trim() : null,
        isFeatured: input.isFeatured ?? true,
      },
    });
  },

  async updateTestimonial(id: string, input: UpdateTestimonialInput) {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return null;

    return prisma.testimonial.update({
      where: { id },
      data: {
        ...(input.patientName !== undefined && { patientName: input.patientName.trim() }),
        ...(input.location !== undefined && { location: input.location.trim() }),
        ...(input.comment !== undefined && { comment: input.comment.trim() }),
        ...(input.rating !== undefined && {
          rating: Math.min(5, Math.max(1, Number(input.rating))),
        }),
        ...(input.avatarUrl !== undefined && {
          avatarUrl: input.avatarUrl && input.avatarUrl.trim() ? input.avatarUrl.trim() : null,
        }),
        ...(input.isFeatured !== undefined && { isFeatured: Boolean(input.isFeatured) }),
      },
    });
  },

  async toggleFeatured(id: string) {
    const existing = await prisma.testimonial.findUnique({ where: { id } });
    if (!existing) return null;

    return prisma.testimonial.update({
      where: { id },
      data: { isFeatured: !existing.isFeatured },
    });
  },

  async deleteTestimonial(id: string) {
    return prisma.testimonial.delete({
      where: { id },
    });
  },
};
