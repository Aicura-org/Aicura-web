import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { successResponse, internalErrorResponse } from '@/lib/api-response';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    const where: any = { isActive: true };
    if (category && category !== 'All') where.category = category;
    if (search && search.trim().length > 0) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const tests = await prisma.diagnosticTest.findMany({
      where,
      orderBy: { name: 'asc' },
    });

    return successResponse(tests);
  } catch (error) {
    return internalErrorResponse(error);
  }
}
