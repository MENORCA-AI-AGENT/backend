import { AuthController } from './auth.controller';
import { AuthenticatedUser } from './domain/authenticated-user.entity';
import { SupabaseAuthService } from './supabase-auth.service';
import { Role } from '../../shared/auth/role.enum';

/**
 * Unit tests for auth HTTP contracts.
 *
 * Decision: controller tests verify DTO-shaped responses while token validation
 * remains covered by the guard and service tests.
 */
describe('AuthController', () => {
  /**
   * Creates a controller with mocked Supabase auth behavior.
   *
   * Decision: direct construction keeps these tests independent from external
   * Supabase credentials and network access.
   */
  function createController(): {
    controller: AuthController;
    service: jest.Mocked<
      Pick<SupabaseAuthService, 'getAllowedProviders' | 'deleteAccount'>
    >;
  } {
    const service = {
      getAllowedProviders: jest.fn().mockReturnValue(['google', 'apple']),
      deleteAccount: jest.fn().mockResolvedValue(undefined),
    };

    return {
      controller: new AuthController(service as unknown as SupabaseAuthService),
      service,
    };
  }

  /**
   * Confirms only Google and Apple are returned.
   *
   * Decision: the frontend should not show login options that are outside the
   * providers configured in Supabase for this product.
   */
  it('returns allowed OAuth providers', () => {
    const { controller } = createController();

    expect(controller.getAllowedProviders()).toEqual([
      { provider: 'google' },
      { provider: 'apple' },
    ]);
  });

  /**
   * Confirms current user responses avoid raw Supabase metadata.
   *
   * Decision: the API should expose a stable backend-safe contract instead of
   * leaking provider-specific payloads to the frontend.
   */
  it('returns the current authenticated user', () => {
    const { controller } = createController();
    const user = new AuthenticatedUser(
      'user-id',
      'user@example.com',
      [Role.User],
      'apple',
    );

    expect(controller.getCurrentUser(user)).toEqual({
      id: 'user-id',
      email: 'user@example.com',
      roles: [Role.User],
      provider: 'apple',
    });
  });

  /**
   * Confirms account deletion delegates to the admin-capable auth service.
   *
   * Decision: deletion requires service-role credentials and must stay behind
   * the backend boundary for privacy and security.
   */
  it('deletes the current authenticated user account', async () => {
    const { controller, service } = createController();
    const user = new AuthenticatedUser(
      'user-id',
      'user@example.com',
      [Role.User],
      'google',
    );

    await expect(controller.deleteCurrentUser(user)).resolves.toEqual({
      deleted: true,
      message:
        'Account deletion requested. The current access token may remain valid until it expires.',
    });
    expect(service.deleteAccount).toHaveBeenCalledWith('user-id');
  });
});
