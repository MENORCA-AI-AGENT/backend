import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
} from 'class-validator';
import { Role } from '../../../shared/auth/role.enum';

/**
 * Public response for the currently authenticated user.
 *
 * Decision: the DTO exposes only the identity and authorization data needed by
 * the app, avoiding raw Supabase metadata leakage.
 */
export class CurrentUserResponseDto {
  @ApiProperty({ example: '9e6f3f6d-8c2c-4f64-a69c-03d3bfb2d533' })
  @IsString()
  id!: string;

  @ApiPropertyOptional({ example: 'user@example.com' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ enum: Role, isArray: true, example: [Role.User] })
  @IsArray()
  @IsEnum(Role, { each: true })
  @Type(() => String)
  roles!: Role[];

  @ApiPropertyOptional({ example: 'google' })
  @IsOptional()
  @IsString()
  provider?: string;
}
