import { NextRequest } from 'next/server';
import { BlogService } from '@/services/blog.service';
import { getAdminFromRequest } from '@/lib/auth';
import { validateBlogInput } from '@/lib/validation';
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let blog = await BlogService.getBlogById(id);
    if (!blog) {
      blog = await BlogService.getBlogBySlug(id);
    }

    const adminSession = await getAdminFromRequest(req);
    if (!blog || (!blog.isPublished && !adminSession)) {
      return notFoundResponse('Blog article');
    }

    return successResponse(blog);
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
      return unauthorizedResponse('Authentication required to update blog article');
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));

    if (body.action === 'togglePublish') {
      const updated = await BlogService.togglePublish(id);
      if (!updated) return notFoundResponse('Blog article');
      return successResponse(updated, 'Blog publish status updated');
    }

    const errors = validateBlogInput(body, true);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const updated = await BlogService.updateBlog(id, body);
    if (!updated) {
      return notFoundResponse('Blog article');
    }

    return successResponse(updated, 'Blog article updated successfully');
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
      return unauthorizedResponse('Authentication required to delete blog article');
    }

    const { id } = await params;
    const existing = await BlogService.getBlogById(id);
    if (!existing) {
      return notFoundResponse('Blog article');
    }

    await BlogService.deleteBlog(id);
    return successResponse({ id }, 'Blog article deleted successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}

