import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, notFoundResponse, internalErrorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (slug) {
      const blog = await prisma.blog.findUnique({
        where: { slug },
      });
      if (!blog || !blog.isPublished) {
        return notFoundResponse('Blog article');
      }
      return successResponse(blog);
    }

    const blogs = await prisma.blog.findMany({
      where: { isPublished: true },
      orderBy: { publishedAt: 'desc' },
    });

    return successResponse(blogs);
  } catch (error) {
    return internalErrorResponse(error);
  }
}
