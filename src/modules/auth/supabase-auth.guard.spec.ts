import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthenticatedUser } from './domain/authenticated-user.entity';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { SupabaseAuthService } from './supabase-auth.service';
import { Role } from '../../shared/auth/role.enum';

/**
 * Unit tests for Supabase bearer-token route protection.
 *
 * Decision: the guard is tested without Nest bootstrapping so token parsing and
 * request attachment stay fast to verify as auth rules evolve.
 */
describe('SupabaseAuthGuard', () => {
  /**
   * Creates the smallest execution context needed by the guard.
   *
   * Decision: the factory keeps each test focused on Authorization headers
   * instead of framework setup.
   */
  function createContext(authorization?: string): {
    context: ExecutionContext;
    request: { headers: { authorization?: string }; user?: AuthenticatedUser };
  } {
    const request = { headers: { authorization } };

    return {
      request,
      context: {
        switchToHttp: () => ({
          getRequest: () => request,
        }),
      } as unknown as ExecutionContext,
    };
  }

  /**
   * Confirms a valid bearer token produces an authenticated request.
   *
   * Decision: downstream role guards depend on `request.user`, so this is the
   * central contract the auth guard must preserve.
   */
  it('attaches authenticated Supabase user to the request', async () => {
    const user = new AuthenticatedUser(
      'user-id',
      'user@example.com',
      [Role.User],
      'google',
    );
    const authService = {
      authenticateBearerToken: jest.fn().mockResolvedValue(user),
    } as unknown as SupabaseAuthService;
    const guard = new SupabaseAuthGuard(authService);
    const { context, request } = createContext('Bearer valid-token');

    await expect(guard.canActivate(context)).resolves.toBe(true);
    expect(authService.authenticateBearerToken).toHaveBeenCalledWith(
      'valid-token',
    );
    expect(request.user).toBe(user);
  });

  /**
   * Confirms missing bearer credentials are rejected.
   *
   * Decision: the backend only accepts standard bearer tokens from Supabase and
   * does not support alternate ad hoc auth headers.
   */
  it('rejects requests without a bearer token', async () => {
    const authService = {
      authenticateBearerToken: jest.fn(),
    } as unknown as SupabaseAuthService;
    const guard = new SupabaseAuthGuard(authService);
    const { context } = createContext('Basic abc');

    await expect(guard.canActivate(context)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
    expect(authService.authenticateBearerToken).not.toHaveBeenCalled();
  });
});
