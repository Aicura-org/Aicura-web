import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import {
  successResponse,
  unauthorizedResponse,
  errorResponse,
  internalErrorResponse,
} from '@/lib/api-response';
import { deleteFromCloudinary } from '@/lib/cloudinary';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

// Use raw SQL so we don't depend on prisma.galleryImage being present
// on the generated client object (avoids stale client cache issues).

// GET /api/gallery — list all gallery images
export async function GET() {
  try {
    const rows = await prisma.$queryRaw<any[]>`
      SELECT * FROM "GalleryImage"
      ORDER BY "displayOrder" ASC, "createdAt" DESC
    `;
    return successResponse(rows);
  } catch (error) {
    console.error('GET /api/gallery error:', error);
    return internalErrorResponse(error);
  }
}

// POST /api/gallery — create a new gallery image
export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to manage gallery');
    }

    const body = await req.json().catch(() => ({}));
    const {
      imageUrl,
      publicId = null,
      title = null,
      description = null,
      category = 'general',
      altText = null,
      displayOrder = 0,
      isActive = true,
    } = body;

    if (!imageUrl) {
      return errorResponse('imageUrl is required', 400);
    }

    const rows = await prisma.$queryRaw<any[]>`
      INSERT INTO "GalleryImage"
        (id, "imageUrl", "publicId", title, description, category, "altText", "displayOrder", "isActive", "createdAt", "updatedAt")
      VALUES
        (gen_random_uuid()::text, ${imageUrl}, ${publicId}, ${title}, ${description}, ${category}, ${altText}, ${displayOrder}, ${isActive}, NOW(), NOW())
      RETURNING *
    `;

    return successResponse(rows[0], 'Gallery image added successfully');
  } catch (error) {
    console.error('POST /api/gallery error:', error);
    return internalErrorResponse(error);
  }
}

// PATCH /api/gallery — update an existing gallery image
export async function PATCH(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to manage gallery');
    }

    const body = await req.json().catch(() => ({}));
    const { id, title, description, category, altText, displayOrder, isActive } = body;

    if (!id) return errorResponse('id is required', 400);

    // Build SET clause dynamically using raw update with all provided fields
    const safeTitle       = title       !== undefined ? title       : null;
    const safeDesc        = description !== undefined ? description : null;
    const safeCat         = category    !== undefined ? category    : 'general';
    const safeAlt         = altText     !== undefined ? altText     : null;
    const safeOrder       = displayOrder !== undefined ? Number(displayOrder) : 0;
    const safeActive      = isActive    !== undefined ? Boolean(isActive) : true;

    const rows = await prisma.$queryRaw<any[]>`
      UPDATE "GalleryImage"
      SET
        title          = ${safeTitle},
        description    = ${safeDesc},
        category       = ${safeCat},
        "altText"      = ${safeAlt},
        "displayOrder" = ${safeOrder},
        "isActive"     = ${safeActive},
        "updatedAt"    = NOW()
      WHERE id = ${id}
      RETURNING *
    `;

    if (!rows.length) return errorResponse('Gallery image not found', 404);

    return successResponse(rows[0], 'Gallery image updated');
  } catch (error) {
    console.error('PATCH /api/gallery error:', error);
    return internalErrorResponse(error);
  }
}

// DELETE /api/gallery?id=xxx — delete a gallery image
export async function DELETE(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to manage gallery');
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) return errorResponse('id query param is required', 400);

    // Fetch publicId for Cloudinary cleanup
    const existing = await prisma.$queryRaw<any[]>`
      SELECT "publicId" FROM "GalleryImage" WHERE id = ${id}
    `;

    if (existing?.[0]?.publicId) {
      try {
        await deleteFromCloudinary(existing[0].publicId);
      } catch (cloudErr) {
        console.warn('Cloudinary delete warning (continuing):', cloudErr);
      }
    }

    await prisma.$executeRaw`DELETE FROM "GalleryImage" WHERE id = ${id}`;

    return successResponse({ id }, 'Gallery image deleted successfully');
  } catch (error) {
    console.error('DELETE /api/gallery error:', error);
    return internalErrorResponse(error);
  }
}
