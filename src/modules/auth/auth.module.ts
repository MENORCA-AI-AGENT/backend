import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { SupabaseAuthGuard } from './supabase-auth.guard';
import { SupabaseAuthService } from './supabase-auth.service';

/**
 * Auth module for Supabase-backed user identity.
 *
 * Decision: authentication is grouped in a feature module even though Supabase
 * owns login, because backend route protection, current-user mapping, and account
 * deletion are API responsibilities.
 */
@Module({
  controllers: [AuthController],
  providers: [SupabaseAuthService, SupabaseAuthGuard],
  exports: [SupabaseAuthService, SupabaseAuthGuard],
})
export class AuthModule {}
