import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getAdminFromRequest } from '@/lib/auth';
import { validateDiagnosticTestInput } from '@/lib/validation';
import {
  successResponse,
  notFoundResponse,
  unauthorizedResponse,
  validationErrorResponse,
  errorResponse,
  internalErrorResponse,
} from '@/lib/api-response';

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    let test = await prisma.diagnosticTest.findUnique({
      where: { id },
    });

    if (!test) {
      test = await prisma.diagnosticTest.findUnique({
        where: { code: id.toUpperCase() },
      });
    }

    if (!test) {
      return notFoundResponse('DiagnosticTest');
    }

    return successResponse(test);
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
      return unauthorizedResponse('Authentication required to update diagnostic test');
    }

    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const errors = validateDiagnosticTestInput(body, true);
    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const existing = await prisma.diagnosticTest.findUnique({ where: { id } });
    if (!existing) {
      return notFoundResponse('DiagnosticTest');
    }

    // Check code collision if code is updated
    if (body.code && body.code.trim().toUpperCase() !== existing.code) {
      const codeTaken = await prisma.diagnosticTest.findUnique({
        where: { code: body.code.trim().toUpperCase() },
      });
      if (codeTaken && codeTaken.id !== id) {
        return errorResponse('A test with this test code already exists', 409, 'DUPLICATE_CODE');
      }
    }

    const updated = await prisma.diagnosticTest.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name.trim() }),
        ...(body.code && { code: body.code.trim().toUpperCase() }),
        ...(body.category && { category: body.category.trim() }),
        ...(body.price !== undefined && { price: Number(body.price) }),
        ...(body.originalPrice !== undefined && {
          originalPrice: body.originalPrice ? Number(body.originalPrice) : null,
        }),
        ...(body.sampleType && { sampleType: body.sampleType.trim() }),
        ...(body.fastingRequired !== undefined && { fastingRequired: Boolean(body.fastingRequired) }),
        ...(body.reportTurnaround && { reportTurnaround: body.reportTurnaround.trim() }),
        ...(body.description !== undefined && {
          description: body.description?.trim() || null,
        }),
        ...(body.isActive !== undefined && { isActive: Boolean(body.isActive) }),
      },
    });

    return successResponse(updated, 'Diagnostic test updated successfully');
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
      return unauthorizedResponse('Authentication required to delete diagnostic test');
    }

    const { id } = await params;
    await prisma.diagnosticTest.delete({
      where: { id },
    });

    return successResponse({ id }, 'Diagnostic test deleted successfully');
  } catch (error) {
    return internalErrorResponse(error);
  }
}
