import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, IsUrl, Min } from 'class-validator';
import { Transform } from 'class-transformer';

/**
 * Describes and validates the environment variables consumed by the backend.
 *
 * Decision: the backend reads all secrets from the process environment and keeps
 * this DTO as the single contract for configuration, preventing accidental use
 * of hard-coded provider keys in code, tests, or documentation.
 */
export class EnvironmentDto {
  @ApiPropertyOptional({ example: 3000 })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  PORT?: number;

  @ApiPropertyOptional({ example: 'http://localhost:3000' })
  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  APP_URL?: string;

  @ApiPropertyOptional({ example: 'https://example.supabase.co' })
  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  SUPABASE_URL?: string;

  @ApiPropertyOptional({ example: 'public-key' })
  @IsOptional()
  @IsString()
  SUPABASE_PUBLISHABLE_KEY?: string;

  @ApiPropertyOptional({ example: 'service-role-key' })
  @IsOptional()
  @IsString()
  SUPABASE_SERVICE_ROLE_KEY?: string;

  @ApiPropertyOptional({ example: 'google,apple' })
  @IsOptional()
  @IsString()
  SUPABASE_AUTH_PROVIDERS?: string;

  @ApiPropertyOptional({ example: 'jwt-secret' })
  @IsOptional()
  @IsString()
  JWT_SECRET?: string;

  @ApiPropertyOptional({ example: '15m' })
  @IsOptional()
  @IsString()
  JWT_EXPIRES_IN?: string;

  @ApiPropertyOptional({ example: 'deepseek-key' })
  @IsOptional()
  @IsString()
  DEEPSEEK_API_KEY?: string;

  @ApiPropertyOptional({ example: 'gemini-key' })
  @IsOptional()
  @IsString()
  GEMINI_API_KEY?: string;

  @ApiPropertyOptional({ example: 'groq-key' })
  @IsOptional()
  @IsString()
  GROQ_API_KEY?: string;

  @ApiPropertyOptional({ example: 'openai-key' })
  @IsOptional()
  @IsString()
  OPENAI_API_KEY?: string;

  @ApiPropertyOptional({ example: 'stripe-secret' })
  @IsOptional()
  @IsString()
  STRIPE_SECRET_KEY?: string;

  @ApiPropertyOptional({ example: 'stripe-webhook-secret' })
  @IsOptional()
  @IsString()
  STRIPE_WEBHOOK_SECRET?: string;

  @ApiPropertyOptional({ example: 'price_123' })
  @IsOptional()
  @IsString()
  STRIPE_PRICE_TRAVEL_PACK?: string;

  @ApiPropertyOptional({ example: 'localhost:19530' })
  @IsOptional()
  @IsString()
  MILVUS_ADDRESS?: string;

  @ApiPropertyOptional({ example: 'project_milvus-etcd:2379' })
  @IsOptional()
  @IsString()
  ETCD_ENDPOINTS?: string;

  @ApiPropertyOptional({ example: 'project_milvus-minio:9000' })
  @IsOptional()
  @IsString()
  MINIO_ADDRESS?: string;

  @ApiPropertyOptional({ example: 'https://www.tmsa.es' })
  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  TMSA_BASE_URL?: string;

  @ApiPropertyOptional({ example: 'https://api.open-meteo.com' })
  @IsOptional()
  @IsUrl({ require_tld: false, require_protocol: true })
  OPEN_METEO_BASE_URL?: string;
}
