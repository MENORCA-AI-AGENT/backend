import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';
import { Role } from './role.enum';
import { AuthenticatedRequest } from './authenticated-request.interface';

/**
 * Protects controller handlers by matching route role metadata against the user.
 *
 * Decision: the guard allows routes without role metadata so public endpoints
 * remain lightweight, while protected routes can opt in with the Roles decorator.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  /**
   * Returns true when the current route is public or the authenticated user owns
   * at least one required role.
   *
   * Decision: role matching is deliberately simple at this layer; quota,
   * subscription, and package ownership are business rules handled by dedicated
   * application services instead of being hidden inside authorization plumbing.
   */
  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const userRoles = request.user?.roles ?? [];

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
