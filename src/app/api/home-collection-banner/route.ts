import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import { successResponse, unauthorizedResponse, internalErrorResponse } from '@/lib/api-response';
import { UploadService } from '@/services/upload.service';

import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

const DEFAULT_BANNER = {
  badgeText: 'HOME COLLECTION',
  titlePrefix: 'Healthcare that',
  titleHighlight: 'comes home.',
  subtitle: 'Professional sample collection at your doorstep. Safe, convenient and trusted by thousands.',
  bgImageUrl: '',
  bgImagePublicId: null,
  bikeImageUrl: '',
  bikeImagePublicId: null,
  buttonText: 'Book Home Collection',
  buttonLink: '/home-collection',
  animationSpeed: 14,
  animationEnabled: true,
  isActive: true,
};

export async function GET() {
  try {
    let banner = await prisma.homeCollectionBanner.findFirst({
      orderBy: { createdAt: 'desc' },
    });

    if (!banner) {
      // Create initial default banner if none exists
      banner = await prisma.homeCollectionBanner.create({
        data: DEFAULT_BANNER,
      });
    }

    return successResponse(banner, 'Home collection banner settings retrieved');
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to update Home Collection banner');
    }

    const body = await req.json();
    const {
      id,
      badgeText,
      titlePrefix,
      titleHighlight,
      subtitle,
      bgImageUrl,
      bgImagePublicId,
      bikeImageUrl,
      bikeImagePublicId,
      buttonText,
      buttonLink,
      animationSpeed,
      animationEnabled,
      isActive,
    } = body;

    let targetBanner = id
      ? await prisma.homeCollectionBanner.findUnique({ where: { id } })
      : await prisma.homeCollectionBanner.findFirst({ orderBy: { createdAt: 'desc' } });

    let savedBanner;

    if (targetBanner) {
      // If background image was replaced and had old public_id, cleanup old Cloudinary asset
      if (
        targetBanner.bgImagePublicId &&
        bgImagePublicId !== targetBanner.bgImagePublicId &&
        bgImageUrl !== targetBanner.bgImageUrl
      ) {
        try {
          await UploadService.deleteImage(targetBanner.bgImagePublicId);
        } catch (err) {
          console.error('Failed to cleanup old background image:', err);
        }
      }

      // If bike image was replaced and had old public_id, cleanup old Cloudinary asset
      if (
        targetBanner.bikeImagePublicId &&
        bikeImagePublicId !== targetBanner.bikeImagePublicId &&
        bikeImageUrl !== targetBanner.bikeImageUrl
      ) {
        try {
          await UploadService.deleteImage(targetBanner.bikeImagePublicId);
        } catch (err) {
          console.error('Failed to cleanup old bike image:', err);
        }
      }

      savedBanner = await prisma.homeCollectionBanner.update({
        where: { id: targetBanner.id },
        data: {
          badgeText: badgeText !== undefined ? badgeText : targetBanner.badgeText,
          titlePrefix: titlePrefix !== undefined ? titlePrefix : targetBanner.titlePrefix,
          titleHighlight: titleHighlight !== undefined ? titleHighlight : targetBanner.titleHighlight,
          subtitle: subtitle !== undefined ? subtitle : targetBanner.subtitle,
          bgImageUrl: bgImageUrl !== undefined ? bgImageUrl : targetBanner.bgImageUrl,
          bgImagePublicId: bgImagePublicId !== undefined ? bgImagePublicId : targetBanner.bgImagePublicId,
          bikeImageUrl: bikeImageUrl !== undefined ? bikeImageUrl : targetBanner.bikeImageUrl,
          bikeImagePublicId: bikeImagePublicId !== undefined ? bikeImagePublicId : targetBanner.bikeImagePublicId,
          buttonText: buttonText !== undefined ? buttonText : targetBanner.buttonText,
          buttonLink: buttonLink !== undefined ? buttonLink : targetBanner.buttonLink,
          animationSpeed: typeof animationSpeed === 'number' ? animationSpeed : targetBanner.animationSpeed,
          animationEnabled: typeof animationEnabled === 'boolean' ? animationEnabled : targetBanner.animationEnabled,
          isActive: typeof isActive === 'boolean' ? isActive : targetBanner.isActive,
        },
      });
    } else {
      savedBanner = await prisma.homeCollectionBanner.create({
        data: {
          badgeText: badgeText || DEFAULT_BANNER.badgeText,
          titlePrefix: titlePrefix || DEFAULT_BANNER.titlePrefix,
          titleHighlight: titleHighlight || DEFAULT_BANNER.titleHighlight,
          subtitle: subtitle || DEFAULT_BANNER.subtitle,
          bgImageUrl: bgImageUrl || DEFAULT_BANNER.bgImageUrl,
          bgImagePublicId: bgImagePublicId || null,
          bikeImageUrl: bikeImageUrl || DEFAULT_BANNER.bikeImageUrl,
          bikeImagePublicId: bikeImagePublicId || null,
          buttonText: buttonText || DEFAULT_BANNER.buttonText,
          buttonLink: buttonLink || DEFAULT_BANNER.buttonLink,
          animationSpeed: typeof animationSpeed === 'number' ? animationSpeed : DEFAULT_BANNER.animationSpeed,
          animationEnabled: typeof animationEnabled === 'boolean' ? animationEnabled : true,
          isActive: typeof isActive === 'boolean' ? isActive : true,
        },
      });
    }

    revalidatePath('/');
    revalidatePath('/admin/home-collection');

    return successResponse(savedBanner, 'Home collection banner saved successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
