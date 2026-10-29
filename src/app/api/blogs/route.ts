import { NextRequest } from 'next/server';
import { BlogService } from '@/services/blog.service';
import { getAdminFromRequest } from '@/lib/auth';
import { validateBlogInput } from '@/lib/validation';
import {
  successResponse,
  createdResponse,
  notFoundResponse,
  validationErrorResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    const all = searchParams.get('all') === 'true';
    const search = searchParams.get('search') || undefined;

    if (slug) {
      let blog = await BlogService.getBlogBySlug(slug);
      if (!blog) {
        blog = await BlogService.getBlogById(slug);
      }
      const adminSession = await getAdminFromRequest(req);
      if (!blog || (!blog.isPublished && !adminSession)) {
        return notFoundResponse('Blog article');
      }
      return successResponse(blog);
    }

    let isPublished: boolean | undefined = true;
    if (all) {
      const adminSession = await getAdminFromRequest(req);
      if (adminSession) {
        isPublished = undefined;
      }
    } else if (searchParams.has('isPublished')) {
      isPublished = searchParams.get('isPublished') === 'true';
    }

    const blogs = await BlogService.listBlogs({
      isPublished,
      search,
    });

    return successResponse(blogs);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to create blog article');
    }

    const body = await req.json().catch(() => ({}));
    const errors = validateBlogInput(body, false);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const blog = await BlogService.createBlog(body);
    return createdResponse(blog, 'Blog article created successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
