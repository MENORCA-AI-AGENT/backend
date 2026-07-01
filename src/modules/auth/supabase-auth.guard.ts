import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthenticatedRequest } from '../../shared/auth/authenticated-request.interface';
import { SupabaseAuthService } from './supabase-auth.service';

/**
 * Authenticates HTTP requests using Supabase access tokens.
 *
 * Decision: NestJS acts as a protected resource API; it accepts Supabase tokens
 * but does not create local sessions, passwords, or replacement JWTs.
 */
@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(private readonly authService: SupabaseAuthService) {}

  /**
   * Attaches the authenticated user to the request when the bearer token is valid.
   *
   * Decision: the guard centralizes token parsing so controllers can focus on
   * use cases and role guards can reuse the normalized `request.user` shape.
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException('Missing bearer token.');
    }

    request.user = await this.authService.authenticateBearerToken(token);

    return true;
  }

  /**
   * Extracts the token from the standard Authorization header.
   *
   * Decision: keeping parsing strict avoids accepting ambiguous credentials from
   * non-standard headers or malformed schemes.
   */
  private extractBearerToken(authorization: string | undefined): string | null {
    const [scheme, token] = authorization?.split(' ') ?? [];

    return scheme === 'Bearer' && token ? token : null;
  }
}
