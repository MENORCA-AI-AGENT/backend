import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthenticatedRequest } from '../../shared/auth/authenticated-request.interface';
import { AuthenticatedUser } from './domain/authenticated-user.entity';

/**
 * Reads the authenticated user attached by SupabaseAuthGuard.
 *
 * Decision: controllers use a decorator instead of reading `request.user`
 * directly so HTTP framework details stay out of application endpoints.
 */
export const CurrentUser = createParamDecorator(
  (
    _data: unknown,
    context: ExecutionContext,
  ): AuthenticatedUser | undefined => {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    return request.user as AuthenticatedUser | undefined;
  },
);
