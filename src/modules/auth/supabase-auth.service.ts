import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient, User } from '@supabase/supabase-js';
import { Role } from '../../shared/auth/role.enum';
import { AuthenticatedUser } from './domain/authenticated-user.entity';

type SupabaseAppMetadata = {
  provider?: string;
  providers?: string[];
  role?: string;
  roles?: string[];
};

/**
 * Integrates NestJS with Supabase Auth without issuing local credentials.
 *
 * Decision: Supabase remains the authentication authority; this service only
 * validates access tokens, maps trusted metadata, and performs admin operations
 * that must never run in the frontend.
 */
@Injectable()
export class SupabaseAuthService {
  private readonly userClient: SupabaseClient | undefined;
  private readonly adminClient: SupabaseClient | undefined;
  private readonly allowedProviders: Array<'google' | 'apple'>;

  constructor(private readonly configService: ConfigService) {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const publishableKey = this.configService.get<string>(
      'SUPABASE_PUBLISHABLE_KEY',
    );
    const serviceRoleKey = this.configService.get<string>(
      'SUPABASE_SERVICE_ROLE_KEY',
    );

    this.allowedProviders = this.parseAllowedProviders(
      this.configService.get<string>('SUPABASE_AUTH_PROVIDERS') ??
        'google,apple',
    );

    this.userClient =
      supabaseUrl && publishableKey
        ? createClient(supabaseUrl, publishableKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          })
        : undefined;

    this.adminClient =
      supabaseUrl && serviceRoleKey
        ? createClient(supabaseUrl, serviceRoleKey, {
            auth: { persistSession: false, autoRefreshToken: false },
          })
        : undefined;
  }

  /**
   * Returns the OAuth providers intentionally allowed by this API.
   *
   * Decision: exposing the allow-list lets frontend and Swagger tests confirm
   * that only Google and Apple are supported, while Supabase still owns the real
   * OAuth redirect flow.
   */
  getAllowedProviders(): Array<'google' | 'apple'> {
    return this.allowedProviders;
  }

  /**
   * Validates a Supabase access token and maps it to the backend user entity.
   *
   * Decision: `auth.getUser(token)` asks Supabase to verify the token instead of
   * duplicating JWT verification logic locally, reducing drift with Supabase Auth.
   */
  async authenticateBearerToken(token: string): Promise<AuthenticatedUser> {
    if (!this.userClient) {
      throw new InternalServerErrorException(
        'Supabase user client is not configured.',
      );
    }

    const { data, error } = await this.userClient.auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid Supabase access token.');
    }

    return this.mapSupabaseUser(data.user);
  }

  /**
   * Deletes the authenticated user from Supabase Auth.
   *
   * Decision: account deletion is executed with the service role key on the
   * backend because the frontend must never receive admin credentials.
   */
  async deleteAccount(userId: string): Promise<void> {
    if (!this.adminClient) {
      throw new InternalServerErrorException(
        'Supabase admin client is not configured.',
      );
    }

    const { error } = await this.adminClient.auth.admin.deleteUser(userId);

    if (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  /**
   * Maps a Supabase Auth user into backend-safe identity information.
   *
   * Decision: authorization roles are read only from app metadata because user
   * metadata is user-editable and therefore unsafe for route protection.
   */
  private mapSupabaseUser(user: User): AuthenticatedUser {
    const appMetadata = user.app_metadata as SupabaseAppMetadata;
    const provider = appMetadata.provider ?? appMetadata.providers?.[0];
    const roles = this.extractRoles(appMetadata);

    return new AuthenticatedUser(user.id, user.email, roles, provider);
  }

  /**
   * Extracts known roles from trusted Supabase app metadata.
   *
   * Decision: unknown role strings are ignored instead of accepted so a malformed
   * claim cannot accidentally grant broader API access.
   */
  private extractRoles(appMetadata: SupabaseAppMetadata): Role[] {
    const rawRoles = [
      ...(Array.isArray(appMetadata.roles) ? appMetadata.roles : []),
      ...(appMetadata.role ? [appMetadata.role] : []),
    ];
    const roles = rawRoles.filter((role): role is Role =>
      Object.values(Role).includes(role as Role),
    );

    return roles.length > 0 ? roles : [Role.User];
  }

  /**
   * Parses the provider allow-list from environment configuration.
   *
   * Decision: the code validates configured providers at startup construction so
   * a typo cannot silently enable an unsupported OAuth option in Swagger or UI.
   */
  private parseAllowedProviders(value: string): Array<'google' | 'apple'> {
    const providers = value
      .split(',')
      .map((provider) => provider.trim())
      .filter(Boolean);

    const allowed = providers.filter(
      (provider): provider is 'google' | 'apple' =>
        provider === 'google' || provider === 'apple',
    );

    return allowed.length > 0 ? allowed : ['google', 'apple'];
  }
}
