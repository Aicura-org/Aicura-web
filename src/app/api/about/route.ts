import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import {
  successResponse,
  unauthorizedResponse,
  internalErrorResponse,
} from '@/lib/api-response';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface UpdateAboutBody {
  id?: string;
  badgeText?: string;
  titlePrefix?: string;
  titleHighlight?: string;
  description?: string;
  imageUrl?: string;
  imagePublicId?: string | null;
  badge1Title?: string;
  badge1Subtitle?: string;
  badge2Title?: string;
  badge2Subtitle?: string;
  badge3Text?: string;
  pillar1Title?: string;
  pillar1Desc?: string;
  pillar2Title?: string;
  pillar2Desc?: string;
  pillar3Title?: string;
  pillar3Desc?: string;
  pillar4Title?: string;
  pillar4Desc?: string;
  primaryBtnText?: string;
  primaryBtnLink?: string;
  secondaryBtnText?: string;
  isActive?: boolean;
}

const defaultAboutData = {
  badgeText: 'About AiCura Diagnostics',
  titlePrefix: 'Pioneering Clinical Precision &',
  titleHighlight: 'Trusted Healthcare.',
  description:
    'At AiCura Diagnostics, we believe accurate diagnostics are the cornerstone of effective healthcare. Combining state-of-the-art laboratory automation with seasoned medical pathologists, we deliver trustworthy, high-precision results for you and your family.',
  imageUrl:
    'https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1000',
  imagePublicId: null,
  badge1Title: 'NABL Standard',
  badge1Subtitle: 'Quality Assured Testing',
  badge2Title: '99.8% Precision',
  badge2Subtitle: 'Double Verified Results',
  badge3Text: '10,000+ Happy Patients',
  pillar1Title: 'Fully Automated Analyzers',
  pillar1Desc: 'Advanced robotic equipment ensuring error-free testing with rapid turnaround.',
  pillar2Title: 'NABL & ISO Compliant',
  pillar2Desc: 'Standardized protocols matching the highest global benchmarks for diagnostic accuracy.',
  pillar3Title: 'MD Pathologist Verified',
  pillar3Desc: 'Every diagnostic report is validated by veteran senior pathologists.',
  pillar4Title: 'Same-Day Digital Reports',
  pillar4Desc: 'Prompt delivery of secure, comprehensive reports directly via WhatsApp & Email.',
  primaryBtnText: 'Learn More About Us',
  primaryBtnLink: '/about',
  secondaryBtnText: 'Contact Our Lab',
  isActive: true,
};

export async function GET() {
  try {
    let about = await prisma.aboutSection.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!about) {
      about = await prisma.aboutSection.create({
        data: defaultAboutData,
      });
    }

    return successResponse(about);
  } catch (error) {
    console.error('GET /api/about error:', error);
    return internalErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to modify About section');
    }

    const body: UpdateAboutBody = await req.json().catch(() => ({}));

    let existing = body.id
      ? await prisma.aboutSection.findUnique({ where: { id: body.id } })
      : await prisma.aboutSection.findFirst({ orderBy: { updatedAt: 'desc' } });

    let saved;
    if (existing) {
      saved = await prisma.aboutSection.update({
        where: { id: existing.id },
        data: {
          badgeText: body.badgeText ?? existing.badgeText,
          titlePrefix: body.titlePrefix ?? existing.titlePrefix,
          titleHighlight: body.titleHighlight ?? existing.titleHighlight,
          description: body.description ?? existing.description,
          imageUrl: body.imageUrl !== undefined ? body.imageUrl : existing.imageUrl,
          imagePublicId: body.imagePublicId !== undefined ? body.imagePublicId : existing.imagePublicId,
          badge1Title: body.badge1Title ?? existing.badge1Title,
          badge1Subtitle: body.badge1Subtitle ?? existing.badge1Subtitle,
          badge2Title: body.badge2Title ?? existing.badge2Title,
          badge2Subtitle: body.badge2Subtitle ?? existing.badge2Subtitle,
          badge3Text: body.badge3Text ?? existing.badge3Text,
          pillar1Title: body.pillar1Title ?? existing.pillar1Title,
          pillar1Desc: body.pillar1Desc ?? existing.pillar1Desc,
          pillar2Title: body.pillar2Title ?? existing.pillar2Title,
          pillar2Desc: body.pillar2Desc ?? existing.pillar2Desc,
          pillar3Title: body.pillar3Title ?? existing.pillar3Title,
          pillar3Desc: body.pillar3Desc ?? existing.pillar3Desc,
          pillar4Title: body.pillar4Title ?? existing.pillar4Title,
          pillar4Desc: body.pillar4Desc ?? existing.pillar4Desc,
          primaryBtnText: body.primaryBtnText ?? existing.primaryBtnText,
          primaryBtnLink: body.primaryBtnLink ?? existing.primaryBtnLink,
          secondaryBtnText: body.secondaryBtnText ?? existing.secondaryBtnText,
          isActive: body.isActive !== undefined ? body.isActive : existing.isActive,
        },
      });
    } else {
      saved = await prisma.aboutSection.create({
        data: {
          ...defaultAboutData,
          ...body,
        },
      });
    }

    return successResponse(saved, 'About Us section saved successfully');
  } catch (error) {
    console.error('POST /api/about error:', error);
    return internalErrorResponse(error);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to modify About section');
    }

    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');

    let existing = await prisma.aboutSection.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (existing && type === 'image') {
      const updated = await prisma.aboutSection.update({
        where: { id: existing.id },
        data: {
          imageUrl: defaultAboutData.imageUrl,
          imagePublicId: null,
        },
      });
      return successResponse(updated, 'Image reset to default');
    }

    return successResponse(existing, 'No changes made');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
