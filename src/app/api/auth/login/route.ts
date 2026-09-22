import { NextRequest } from 'next/server';
import { AuthService } from '@/services/auth.service';
import { setAuthCookie } from '@/lib/auth';
import { validateLoginInput } from '@/lib/validation';
import { successResponse, validationErrorResponse, unauthorizedResponse, internalErrorResponse } from '@/lib/api-response';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const errors = validateLoginInput(body);

    if (errors.length > 0) {
      return validationErrorResponse(errors);
    }

    const result = await AuthService.login(body.email, body.password);
    if (!result) {
      return unauthorizedResponse('Invalid email or password');
    }

    await setAuthCookie(result.token);

    return successResponse(
      {
        user: result.user,
        token: result.token,
      },
      'Login successful'
    );
  } catch (error) {
    return internalErrorResponse(error);
  }
}
