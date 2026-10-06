import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import { validateDiagnosticTestInput } from '@/lib/validation';
import {
  successResponse,
  createdResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
  internalErrorResponse,
} from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;
    const all = searchParams.get('all') === 'true';
    const withCategories = searchParams.get('withCategories') === 'true';

    const where: any = {};
    if (!adminSession && !all) {
      where.isActive = true;
    } else if (searchParams.has('isActive')) {
      where.isActive = searchParams.get('isActive') === 'true';
    }

    if (category && category !== 'All') {
      where.category = { equals: category, mode: 'insensitive' };
    }
    if (search && search.trim().length > 0) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tests = await prisma.diagnosticTest.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    if (withCategories) {
      const categoriesResult = await prisma.diagnosticTest.findMany({
        where: adminSession ? {} : { isActive: true },
        select: { category: true },
        distinct: ['category'],
        orderBy: { category: 'asc' },
      });
      const categories = ['All', ...categoriesResult.map((c) => c.category).filter(Boolean)];
      return successResponse({ tests, categories });
    }

    return successResponse(tests);
  } catch (error) {
    return internalErrorResponse(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminSession = await getAdminFromRequest(req);
    if (!adminSession) {
      return unauthorizedResponse('Authentication required to manage diagnostic tests');
    }

    const body = await req.json().catch(() => ({}));
    const errors = validateDiagnosticTestInput(body);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    // Check code uniqueness
    const existing = await prisma.diagnosticTest.findUnique({
      where: { code: body.code.trim().toUpperCase() },
    });
    if (existing) {
      return errorResponse('A test with this test code already exists', 409, 'DUPLICATE_CODE');
    }

    const test = await prisma.diagnosticTest.create({
      data: {
        name: body.name.trim(),
        code: body.code.trim().toUpperCase(),
        category: body.category.trim(),
        price: Number(body.price),
        originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        sampleType: body.sampleType.trim(),
        fastingRequired: Boolean(body.fastingRequired),
        reportTurnaround: body.reportTurnaround.trim(),
        description: body.description?.trim() || null,
        isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      },
    });

    return createdResponse(test, 'Diagnostic test created successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
