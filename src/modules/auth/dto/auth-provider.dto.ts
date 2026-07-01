import { ApiProperty } from '@nestjs/swagger';
import { IsIn } from 'class-validator';

/**
 * Supported OAuth providers for the Menorca travel app.
 *
 * Decision: login is owned by Supabase Auth and intentionally limited to the
 * two providers configured for the project: Google and Apple.
 */
export class AuthProviderDto {
  @ApiProperty({ enum: ['google', 'apple'], example: 'google' })
  @IsIn(['google', 'apple'])
  provider!: 'google' | 'apple';
}
