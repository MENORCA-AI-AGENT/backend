import { ConfigService } from '@nestjs/config';
import {
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseAuthService } from './supabase-auth.service';
import { Role } from '../../shared/auth/role.enum';

const mockGetUser = jest.fn();
const mockDeleteUser = jest.fn();

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn((_url: string, key: string) => {
    if (key === 'publishable-key') {
      return {
        auth: {
          getUser: mockGetUser,
        },
      };
    }

    return {
      auth: {
        admin: {
          deleteUser: mockDeleteUser,
        },
      },
    };
  }),
}));

/**
 * Unit tests for Supabase Auth service integration behavior.
 *
 * Decision: the Supabase SDK is mocked so tests verify backend decisions without
 * requiring live credentials or consuming external project resources.
 */
describe('SupabaseAuthService', () => {
  /**
   * Creates the service with a deterministic configuration map.
   *
   * Decision: explicit config keeps secret handling visible and prevents tests
   * from reading accidental local environment variables.
   */
  function createService(
    config: Record<string, string> = {
      SUPABASE_URL: 'https://project.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
      SUPABASE_SERVICE_ROLE_KEY: 'service-role-key',
      SUPABASE_AUTH_PROVIDERS: 'google,apple',
    },
  ): SupabaseAuthService {
    const configService = {
      get: jest.fn((key: string) => config[key]),
    } as unknown as ConfigService;

    return new SupabaseAuthService(configService);
  }

  beforeEach(() => {
    mockGetUser.mockReset();
    mockDeleteUser.mockReset();
  });

  /**
   * Confirms provider policy is limited to Google and Apple.
   *
   * Decision: provider allow-listing is a product rule that should be testable
   * independently from Supabase dashboard configuration.
   */
  it('returns Google and Apple as allowed providers', () => {
    const service = createService();

    expect(service.getAllowedProviders()).toEqual(['google', 'apple']);
  });

  /**
   * Confirms Supabase token validation maps trusted app metadata roles.
   *
   * Decision: route authorization must use app metadata, not user metadata,
   * because app metadata is controlled by privileged backend/admin processes.
   */
  it('authenticates a Supabase bearer token', async () => {
    mockGetUser.mockResolvedValue({
      data: {
        user: {
          id: 'user-id',
          email: 'user@example.com',
          app_metadata: {
            provider: 'google',
            roles: [Role.Admin],
          },
        },
      },
      error: null,
    });
    const service = createService();

    await expect(service.authenticateBearerToken('token')).resolves.toEqual({
      id: 'user-id',
      email: 'user@example.com',
      roles: [Role.Admin],
      provider: 'google',
    });
    expect(mockGetUser).toHaveBeenCalledWith('token');
  });

  /**
   * Confirms invalid Supabase tokens are rejected.
   *
   * Decision: failed Supabase validation should become a standard unauthorized
   * API response instead of leaking provider error details.
   */
  it('rejects invalid Supabase bearer tokens', async () => {
    mockGetUser.mockResolvedValue({
      data: { user: null },
      error: new Error('invalid'),
    });
    const service = createService();

    await expect(
      service.authenticateBearerToken('token'),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });

  /**
   * Confirms account deletion uses Supabase admin APIs.
   *
   * Decision: deleting Auth users requires service-role authority and must stay
   * server-side for data protection compliance.
   */
  it('deletes a Supabase Auth user with the admin client', async () => {
    mockDeleteUser.mockResolvedValue({ error: null });
    const service = createService();

    await expect(service.deleteAccount('user-id')).resolves.toBeUndefined();
    expect(mockDeleteUser).toHaveBeenCalledWith('user-id');
  });

  /**
   * Confirms missing admin configuration blocks deletion.
   *
   * Decision: failing closed is safer than pretending account deletion succeeded
   * when service-role credentials are absent.
   */
  it('fails account deletion when the admin client is not configured', async () => {
    const service = createService({
      SUPABASE_URL: 'https://project.supabase.co',
      SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
    });

    await expect(service.deleteAccount('user-id')).rejects.toBeInstanceOf(
      InternalServerErrorException,
    );
  });
});
