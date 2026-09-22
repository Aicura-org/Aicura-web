import { prisma } from '@/lib/prisma';
import { CreatePackageInput, UpdatePackageInput } from '@/types';

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const PackageService = {
  async listPackages(options?: { isPublished?: boolean; category?: string; isPopular?: boolean }) {
    const where: any = {};
    if (options?.isPublished !== undefined) where.isPublished = options.isPublished;
    if (options?.category) where.category = options.category;
    if (options?.isPopular !== undefined) where.isPopular = options.isPopular;

    return prisma.package.findMany({
      where,
      orderBy: [
        { isPopular: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  },

  async getPackageById(id: string) {
    return prisma.package.findUnique({
      where: { id },
    });
  },

  async getPackageBySlug(slug: string) {
    return prisma.package.findUnique({
      where: { slug },
    });
  },

  async createPackage(input: CreatePackageInput) {
    const slug = input.slug || slugify(input.title);

    // Ensure unique slug
    let finalSlug = slug;
    let counter = 1;
    while (await prisma.package.findUnique({ where: { slug: finalSlug } })) {
      finalSlug = `${slug}-${counter}`;
      counter++;
    }

    return prisma.package.create({
      data: {
        title: input.title,
        slug: finalSlug,
        category: input.category,
        testCount: input.testCount || input.includedTests.length,
        originalPrice: input.originalPrice,
        discountedPrice: input.discountedPrice,
        description: input.description,
        includedTests: input.includedTests,
        benefits: input.benefits || [],
        preparation: input.preparation || null,
        imageUrl: input.imageUrl || null,
        isPopular: input.isPopular ?? false,
        badgeText: input.badgeText || null,
        isPublished: input.isPublished ?? true,
      },
    });
  },

  async updatePackage(id: string, input: UpdatePackageInput) {
    const existing = await prisma.package.findUnique({ where: { id } });
    if (!existing) return null;

    let slug = existing.slug;
    if (input.title && input.title !== existing.title && !input.slug) {
      slug = slugify(input.title);
      let counter = 1;
      let checkSlug = slug;
      while (true) {
        const found = await prisma.package.findUnique({ where: { slug: checkSlug } });
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

    return prisma.package.update({
      where: { id },
      data: {
        ...(input.title && { title: input.title }),
        slug,
        ...(input.category && { category: input.category }),
        ...(input.testCount !== undefined && { testCount: input.testCount }),
        ...(input.originalPrice !== undefined && { originalPrice: input.originalPrice }),
        ...(input.discountedPrice !== undefined && { discountedPrice: input.discountedPrice }),
        ...(input.description && { description: input.description }),
        ...(input.includedTests && { includedTests: input.includedTests }),
        ...(input.benefits && { benefits: input.benefits }),
        ...(input.preparation !== undefined && { preparation: input.preparation }),
        ...(input.imageUrl !== undefined && { imageUrl: input.imageUrl }),
        ...(input.isPopular !== undefined && { isPopular: input.isPopular }),
        ...(input.badgeText !== undefined && { badgeText: input.badgeText }),
        ...(input.isPublished !== undefined && { isPublished: input.isPublished }),
      },
    });
  },

  async deletePackage(id: string) {
    return prisma.package.delete({
      where: { id },
    });
  },

  async togglePublish(id: string) {
    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) return null;
    return prisma.package.update({
      where: { id },
      data: { isPublished: !pkg.isPublished },
    });
  },
};
