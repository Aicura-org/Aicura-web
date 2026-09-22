import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, errorResponse, internalErrorResponse } from '@/lib/api-response';
import { UploadService } from '@/services/upload.service';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const banners = await prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return successResponse(banners, 'Hero carousel banners retrieved');
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to update hero section');
    }

    const body = await req.json();

    // Handle batch reorder
    if (body.action === 'reorder' && Array.isArray(body.orders)) {
      await Promise.all(
        body.orders.map((item: { id: string; displayOrder: number }) =>
          prisma.heroBanner.update({
            where: { id: item.id },
            data: { displayOrder: item.displayOrder },
          })
        )
      );
      const allBanners = await prisma.heroBanner.findMany({
        where: { isActive: true },
        orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
      });
      return successResponse(allBanners, 'Banner order updated successfully');
    }

    const {
      id,
      badgeText,
      title,
      subtitle,
      buttonText,
      buttonLink,
      imageUrl,
      imagePublicId,
      mobileImageUrl,
      mobileImagePublicId,
      displayOrder,
      isActive,
    } = body;

    let targetBanner = id ? await prisma.heroBanner.findUnique({ where: { id } }) : null;

    let savedBanner;
    if (targetBanner) {
      // Cleanup previous desktop image if changed
      if (
        targetBanner.imagePublicId &&
        imagePublicId !== targetBanner.imagePublicId &&
        imageUrl !== targetBanner.imageUrl
      ) {
        try {
          await UploadService.deleteImage(targetBanner.imagePublicId);
        } catch (err) {
          console.error('Failed to cleanup previous Cloudinary desktop image:', err);
        }
      }

      // Cleanup previous mobile image if changed
      if (
        targetBanner.mobileImagePublicId &&
        mobileImagePublicId !== targetBanner.mobileImagePublicId &&
        mobileImageUrl !== targetBanner.mobileImageUrl
      ) {
        try {
          await UploadService.deleteImage(targetBanner.mobileImagePublicId);
        } catch (err) {
          console.error('Failed to cleanup previous Cloudinary mobile image:', err);
        }
      }

      savedBanner = await prisma.heroBanner.update({
        where: { id: targetBanner.id },
        data: {
          badgeText: badgeText ? badgeText.trim() : null,
          title: title ? title.trim() : null,
          subtitle: subtitle ? subtitle.trim() : null,
          buttonText: buttonText ? buttonText.trim() : 'Explore',
          buttonLink: buttonLink ? buttonLink.trim() : '/packages',
          imageUrl: imageUrl ? imageUrl.trim() : null,
          imagePublicId: imagePublicId ? imagePublicId.trim() : null,
          mobileImageUrl: mobileImageUrl ? mobileImageUrl.trim() : null,
          mobileImagePublicId: mobileImagePublicId ? mobileImagePublicId.trim() : null,
          displayOrder: typeof displayOrder === 'number' ? displayOrder : targetBanner.displayOrder,
          isActive: typeof isActive === 'boolean' ? isActive : true,
        },
      });
    } else {
      // Find highest display order
      const highestOrder = await prisma.heroBanner.findFirst({
        orderBy: { displayOrder: 'desc' },
        select: { displayOrder: true },
      });

      const nextOrder = typeof displayOrder === 'number' ? displayOrder : (highestOrder?.displayOrder ?? -1) + 1;

      savedBanner = await prisma.heroBanner.create({
        data: {
          badgeText: badgeText ? badgeText.trim() : null,
          title: title ? title.trim() : null,
          subtitle: subtitle ? subtitle.trim() : null,
          buttonText: buttonText ? buttonText.trim() : 'Explore',
          buttonLink: buttonLink ? buttonLink.trim() : '/packages',
          imageUrl: imageUrl ? imageUrl.trim() : null,
          imagePublicId: imagePublicId ? imagePublicId.trim() : null,
          mobileImageUrl: mobileImageUrl ? mobileImageUrl.trim() : null,
          mobileImagePublicId: mobileImagePublicId ? mobileImagePublicId.trim() : null,
          displayOrder: nextOrder,
          isActive: typeof isActive === 'boolean' ? isActive : true,
        },
      });
    }

    const allBanners = await prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return successResponse({ savedBanner, allBanners }, 'Hero banner saved successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to delete hero banner');
    }

    const id = req.nextUrl.searchParams.get('id');
    const targetType = req.nextUrl.searchParams.get('type') || 'slide';

    if (!id) {
      // Fallback: If no id provided, find first
      const firstBanner = await prisma.heroBanner.findFirst({
        orderBy: { createdAt: 'desc' },
      });
      if (!firstBanner) {
        return errorResponse('No hero banner found to delete', 404);
      }
      return await deleteHeroTarget(firstBanner.id, targetType);
    }

    return await deleteHeroTarget(id, targetType);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

async function deleteHeroTarget(id: string, targetType: string) {
  const existingHero = await prisma.heroBanner.findUnique({
    where: { id },
  });

  if (!existingHero) {
    return errorResponse('Hero banner not found', 404);
  }

  if (targetType === 'slide') {
    // Delete Cloudinary assets
    if (existingHero.imagePublicId) {
      try {
        await UploadService.deleteImage(existingHero.imagePublicId);
      } catch (err) {
        console.error('Failed deleting desktop image from Cloudinary:', err);
      }
    }
    if (existingHero.mobileImagePublicId) {
      try {
        await UploadService.deleteImage(existingHero.mobileImagePublicId);
      } catch (err) {
        console.error('Failed deleting mobile image from Cloudinary:', err);
      }
    }

    await prisma.heroBanner.delete({
      where: { id },
    });

    const remainingBanners = await prisma.heroBanner.findMany({
      where: { isActive: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    });

    return successResponse(remainingBanners, 'Hero slide deleted successfully');
  } else if (targetType === 'mobile') {
    if (existingHero.mobileImagePublicId) {
      try {
        await UploadService.deleteImage(existingHero.mobileImagePublicId);
      } catch (err) {
        console.error('Failed deleting mobile image from Cloudinary:', err);
      }
    }

    const updatedHero = await prisma.heroBanner.update({
      where: { id },
      data: {
        mobileImageUrl: null,
        mobileImagePublicId: null,
      },
    });

    return successResponse(updatedHero, 'Mobile hero banner image deleted successfully');
  } else {
    // Desktop image delete
    if (existingHero.imagePublicId) {
      try {
        await UploadService.deleteImage(existingHero.imagePublicId);
      } catch (err) {
        console.error('Failed deleting desktop image from Cloudinary:', err);
      }
    }

    const updatedHero = await prisma.heroBanner.update({
      where: { id },
      data: {
        imageUrl: null,
        imagePublicId: null,
      },
    });

    return successResponse(updatedHero, 'Desktop hero banner image deleted successfully');
  }
}


