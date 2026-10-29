import { prisma } from '@/lib/prisma';
import { CreateBlogInput, UpdateBlogInput } from '@/types';
import { slugify } from './package.service';
import { plainTextToHtml } from '@/lib/blog-content';
import { UploadService } from './upload.service';

export async function resolveUniqueBlogSlug(baseSlug: string, currentId?: string): Promise<string> {
  let checkSlug = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.blog.findUnique({
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

export const BlogService = {
  async listBlogs(options?: { isPublished?: boolean; search?: string; limit?: number }) {
    const where: any = {};

    if (options?.isPublished !== undefined) {
      where.isPublished = options.isPublished;
    }

    if (options?.search && options.search.trim().length > 0) {
      const q = options.search.trim();
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { excerpt: { contains: q, mode: 'insensitive' } },
        { author: { contains: q, mode: 'insensitive' } },
      ];
    }

    return prisma.blog.findMany({
      where,
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      ...(options?.limit ? { take: options.limit } : {}),
    });
  },

  async getBlogById(id: string) {
    return prisma.blog.findUnique({
      where: { id },
    });
  },

  async getBlogBySlug(slug: string) {
    return prisma.blog.findUnique({
      where: { slug },
    });
  },

  async createBlog(input: CreateBlogInput) {
    const rawSlug = input.slug?.trim()
      ? slugify(input.slug, 'health-article')
      : slugify(input.title, 'health-article');
    const finalSlug = await resolveUniqueBlogSlug(rawSlug);

    return prisma.blog.create({
      data: {
        title: input.title.trim(),
        slug: finalSlug,
        excerpt: input.excerpt.trim(),
        content: plainTextToHtml(input.content.trim()),
        coverImage: input.coverImage.trim(),
        readTime: input.readTime?.trim() || '4 min read',
        author: input.author?.trim() || 'AiCura Team',
        isPublished: input.isPublished ?? true,
        publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
      },
    });
  },

  async updateBlog(id: string, input: UpdateBlogInput) {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return null;

    let slug = existing.slug;
    const shouldRegenerateSlug =
      (input.title && input.title !== existing.title && !input.slug) ||
      !slug ||
      slug.trim() === '';

    if (input.slug && input.slug.trim() !== '') {
      const baseSlug = slugify(input.slug, 'health-article');
      slug = await resolveUniqueBlogSlug(baseSlug, id);
    } else if (shouldRegenerateSlug) {
      const baseSlug = slugify(input.title || existing.title, 'health-article');
      slug = await resolveUniqueBlogSlug(baseSlug, id);
    }

    // Delete previous Cloudinary cover image if coverImage was replaced
    if (
      input.coverImage !== undefined &&
      existing.coverImage &&
      input.coverImage.trim() !== existing.coverImage
    ) {
      try {
        await UploadService.deleteImage(existing.coverImage);
      } catch (err) {
        console.warn('Failed to delete previous blog cover image from Cloudinary:', err);
      }
    }

    return prisma.blog.update({
      where: { id },
      data: {
        ...(input.title !== undefined && { title: input.title.trim() }),
        slug,
        ...(input.excerpt !== undefined && { excerpt: input.excerpt.trim() }),
        ...(input.content !== undefined && { content: plainTextToHtml(input.content.trim()) }),
        ...(input.coverImage !== undefined && { coverImage: input.coverImage.trim() }),
        ...(input.readTime !== undefined && { readTime: input.readTime.trim() || '4 min read' }),
        ...(input.author !== undefined && { author: input.author.trim() || 'AiCura Team' }),
        ...(input.isPublished !== undefined && { isPublished: Boolean(input.isPublished) }),
        ...(input.publishedAt !== undefined && {
          publishedAt: input.publishedAt ? new Date(input.publishedAt) : existing.publishedAt,
        }),
      },
    });
  },

  async togglePublish(id: string) {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) return null;

    return prisma.blog.update({
      where: { id },
      data: { isPublished: !existing.isPublished },
    });
  },

  async deleteBlog(id: string) {
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (existing?.coverImage) {
      try {
        await UploadService.deleteImage(existing.coverImage);
      } catch (err) {
        console.warn('Failed to delete blog cover image from Cloudinary:', err);
      }
    }

    return prisma.blog.delete({
      where: { id },
    });
  },
};
