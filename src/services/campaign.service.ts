import { prisma } from '@/lib/prisma';
import { CreateCampaignInput, UpdateCampaignInput } from '@/types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const CampaignService = {
  async listCampaigns(options?: { isActive?: boolean }) {
    const where: any = {};
    if (options?.isActive !== undefined) where.isActive = options.isActive;

    return prisma.campaign.findMany({
      where,
      include: {
        sections: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: { enquiries: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  },

  async getCampaignById(id: string) {
    return prisma.campaign.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: { enquiries: true },
        },
      },
    });
  },

  async getCampaignBySlug(slug: string) {
    return prisma.campaign.findUnique({
      where: { slug },
      include: {
        sections: {
          orderBy: { displayOrder: 'asc' },
        },
        _count: {
          select: { enquiries: true },
        },
      },
    });
  },

  async createCampaign(input: CreateCampaignInput) {
    const slug = input.slug || slugify(input.name);

    let finalSlug = slug;
    let counter = 1;
    while (await prisma.campaign.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    return prisma.campaign.create({
      data: {
        name: input.name,
        slug: finalSlug,
        title: input.title,
        subtitle: input.subtitle || null,
        description: input.description || null,
        heroImageUrl: input.heroImageUrl || null,
        ctaText: input.ctaText || 'Book Now',
        ctaLink: input.ctaLink || null,
        seoTitle: input.seoTitle || input.title,
        seoDescription: input.seoDescription || input.description || null,
        isActive: input.isActive ?? true,
        startDate: input.startDate ? new Date(input.startDate) : null,
        endDate: input.endDate ? new Date(input.endDate) : null,
      },
      include: {
        sections: true,
      },
    });
  },

  async updateCampaign(id: string, input: UpdateCampaignInput) {
    const existing = await prisma.campaign.findUnique({ where: { id } });
    if (!existing) return null;

    let slug = existing.slug;
    if (input.name && input.name !== existing.name && !input.slug) {
      slug = slugify(input.name);
      let counter = 1;
      let checkSlug = slug;
      while (true) {
        const found = await prisma.campaign.findUnique({ where: { slug: checkSlug } });
        if (!found || found.id === id) {
          slug = checkSlug;
          break;
        }
        checkSlug = `${slug}-${counter}`;
        counter++;
      }
    } else if (input.slug) {
      slug = input.slug;
    }

    return prisma.campaign.update({
      where: { id },
      data: {
        ...(input.name && { name: input.name }),
        slug,
        ...(input.title && { title: input.title }),
        ...(input.subtitle !== undefined && { subtitle: input.subtitle }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.heroImageUrl !== undefined && { heroImageUrl: input.heroImageUrl }),
        ...(input.ctaText && { ctaText: input.ctaText }),
        ...(input.ctaLink !== undefined && { ctaLink: input.ctaLink }),
        ...(input.seoTitle !== undefined && { seoTitle: input.seoTitle }),
        ...(input.seoDescription !== undefined && { seoDescription: input.seoDescription }),
        ...(input.isActive !== undefined && { isActive: input.isActive }),
        ...(input.startDate !== undefined && { startDate: input.startDate ? new Date(input.startDate) : null }),
        ...(input.endDate !== undefined && { endDate: input.endDate ? new Date(input.endDate) : null }),
      },
      include: {
        sections: {
          orderBy: { displayOrder: 'asc' },
        },
      },
    });
  },

  async deleteCampaign(id: string) {
    return prisma.campaign.delete({
      where: { id },
    });
  },

  async addSection(campaignId: string, sectionData: { title: string; content: string; imageUrl?: string; displayOrder?: number }) {
    const maxOrder = await prisma.campaignSection.aggregate({
      where: { campaignId },
      _max: { displayOrder: true },
    });
    const nextOrder = sectionData.displayOrder ?? ((maxOrder._max.displayOrder ?? -1) + 1);

    return prisma.campaignSection.create({
      data: {
        campaignId,
        title: sectionData.title,
        content: sectionData.content,
        imageUrl: sectionData.imageUrl || null,
        displayOrder: nextOrder,
      },
    });
  },

  async updateSection(sectionId: string, sectionData: { title?: string; content?: string; imageUrl?: string; displayOrder?: number }) {
    return prisma.campaignSection.update({
      where: { id: sectionId },
      data: {
        ...(sectionData.title && { title: sectionData.title }),
        ...(sectionData.content && { content: sectionData.content }),
        ...(sectionData.imageUrl !== undefined && { imageUrl: sectionData.imageUrl }),
        ...(sectionData.displayOrder !== undefined && { displayOrder: sectionData.displayOrder }),
      },
    });
  },

  async deleteSection(sectionId: string) {
    return prisma.campaignSection.delete({
      where: { id: sectionId },
    });
  },
};
