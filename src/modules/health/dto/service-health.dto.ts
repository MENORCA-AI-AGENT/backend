import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

/**
 * Public health status for a single dependency.
 *
 * Decision: health responses expose connectivity and configuration state without
 * returning secret values, so Swagger can be used safely during endpoint testing.
 */
export class ServiceHealthDto {
  @ApiProperty({ example: 'supabase' })
  @IsString()
  name!: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  configured!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  reachable!: boolean;

  @ApiProperty({ example: 123, required: false })
  @IsOptional()
  @IsInt()
  @Min(0)
  latencyMs?: number;

  @ApiProperty({ example: 'Missing SUPABASE_URL', required: false })
  @IsOptional()
  @IsString()
  message?: string;
}
