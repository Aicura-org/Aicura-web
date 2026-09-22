import { NextResponse } from 'next/server';
import { ApiErrorDetail, ApiResponse, PaginatedData } from '@/types';

export function successResponse<T>(data: T, message?: string, status: number = 200) {
  return NextResponse.json<ApiResponse<T>>(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

export function createdResponse<T>(data: T, message: string = 'Created successfully') {
  return successResponse(data, message, 201);
}

export function paginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  total: number,
  message?: string
) {
  const totalPages = Math.ceil(total / limit) || 1;
  const payload: PaginatedData<T> = {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
    },
  };
  return successResponse(payload, message, 200);
}

export function errorResponse(
  message: string,
  status: number = 400,
  code?: string,
  details?: ApiErrorDetail[] | string
) {
  return NextResponse.json<ApiResponse<never>>(
    {
      success: false,
      message,
      error: {
        code,
        details,
      },
    },
    { status }
  );
}

export function validationErrorResponse(errors: ApiErrorDetail[]) {
  return errorResponse('Validation failed', 422, 'VALIDATION_ERROR', errors);
}

export function notFoundResponse(entity: string = 'Resource') {
  return errorResponse(`${entity} not found`, 404, 'NOT_FOUND');
}

export function unauthorizedResponse(message: string = 'Unauthorized access') {
  return errorResponse(message, 401, 'UNAUTHORIZED');
}

export function forbiddenResponse(message: string = 'Forbidden access') {
  return errorResponse(message, 403, 'FORBIDDEN');
}

export function internalErrorResponse(error?: unknown) {
  console.error('[Internal Error]:', error);
  return errorResponse(
    process.env.NODE_ENV === 'development' && error instanceof Error
      ? error.message
      : 'An unexpected internal server error occurred',
    500,
    'INTERNAL_SERVER_ERROR'
  );
}
