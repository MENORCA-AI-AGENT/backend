import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from './current-user.decorator';
import { AuthenticatedUser } from './domain/authenticated-user.entity';
import { AuthProviderDto } from './dto/auth-provider.dto';
import { CurrentUserResponseDto } from './dto/current-user-response.dto';
import { DeleteAccountResponseDto } from './dto/delete-account-response.dto';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { SupabaseAuthService } from './supabase-auth.service';

/**
 * Exposes authentication-adjacent endpoints for the protected API.
 *
 * Decision: OAuth login itself stays in Supabase/client SDK; this controller
 * only documents allowed providers, returns the current user, and handles
 * privacy-sensitive account deletion on the backend.
 */
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: SupabaseAuthService) {}

  /**
   * Returns the OAuth providers allowed by product policy.
   *
   * Decision: the frontend can read this endpoint or mirror the same allow-list
   * so only Google and Apple login buttons are shown.
   */
  @Get('providers')
  @ApiOkResponse({ type: AuthProviderDto, isArray: true })
  getAllowedProviders(): AuthProviderDto[] {
    return this.authService
      .getAllowedProviders()
      .map((provider) => ({ provider }));
  }

  /**
   * Returns the authenticated user's backend-safe identity and roles.
   *
   * Decision: this endpoint lets the frontend confirm the Supabase session with
   * the backend before enabling protected travel-agent capabilities.
   */
  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: CurrentUserResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Supabase token.',
  })
  getCurrentUser(
    @CurrentUser() user: AuthenticatedUser,
  ): CurrentUserResponseDto {
    return {
      id: user.id,
      email: user.email,
      roles: user.roles,
      provider: user.provider,
    };
  }

  /**
   * Deletes the authenticated user's Supabase Auth account.
   *
   * Decision: this endpoint supports privacy rights such as account deletion; the
   * frontend must sign out immediately because existing JWTs can remain valid
   * until their configured expiry.
   */
  @Delete('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiBearerAuth()
  @ApiOkResponse({ type: DeleteAccountResponseDto })
  @ApiUnauthorizedResponse({
    description: 'Missing or invalid Supabase token.',
  })
  async deleteCurrentUser(
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<DeleteAccountResponseDto> {
    await this.authService.deleteAccount(user.id);

    return {
      deleted: true,
      message:
        'Account deletion requested. The current access token may remain valid until it expires.',
    };
  }
}
