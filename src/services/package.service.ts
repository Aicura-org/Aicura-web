import { prisma } from '@/lib/prisma';
import { CreatePackageInput, UpdatePackageInput } from '@/types';

export function slugify(text: string, fallback = 'health-package'): string {
  if (!text) return `${fallback}-${Date.now().toString(36)}`;

  const slug = text
    .normalize('NFKD')
    .toLowerCase()
    .replace(/[\u2010-\u2015_]/g, '-')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');

  if (!slug || slug.length < 2) {
    return `${fallback}-${Date.now().toString(36)}`;
  }
  return slug;
}

export async function resolveUniqueSlug(baseSlug: string, currentId?: string): Promise<string> {
  let checkSlug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.package.findUnique({
      where: { slug: checkSlug },
      select: { id: true },
    });

    if (!existing || (currentId && existing.id === currentId)) {
      return checkSlug;
    }

    checkSlug = `${baseSlug}-${counter}`;
    counter++;
  }
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
    const fallbackCategory = input.category ? slugify(input.category) : 'package';
    const rawSlug = input.slug?.trim() ? slugify(input.slug) : slugify(input.title, fallbackCategory);
    const finalSlug = await resolveUniqueSlug(rawSlug);

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
    const shouldRegenerateSlug = 
      (input.title && input.title !== existing.title && !input.slug) ||
      !slug || 
      slug.trim() === '';

    if (input.slug && input.slug.trim() !== '') {
      const baseSlug = slugify(input.slug);
      slug = await resolveUniqueSlug(baseSlug, id);
    } else if (shouldRegenerateSlug) {
      const fallback = input.category || existing.category ? slugify(input.category || existing.category) : 'package';
      const baseSlug = slugify(input.title || existing.title, fallback);
      slug = await resolveUniqueSlug(baseSlug, id);
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

  async syncMissingSlugs() {
    const packages = await prisma.package.findMany({
      select: { id: true, title: true, slug: true, category: true },
    });
    let updatedCount = 0;
    for (const pkg of packages) {
      if (!pkg.slug || pkg.slug.trim() === '' || pkg.slug.startsWith('-')) {
        const fallback = pkg.category ? slugify(pkg.category) : 'package';
        const baseSlug = slugify(pkg.title, fallback);
        const finalSlug = await resolveUniqueSlug(baseSlug, pkg.id);
        await prisma.package.update({
          where: { id: pkg.id },
          data: { slug: finalSlug },
        });
        updatedCount++;
      }
    }
    return updatedCount;
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
