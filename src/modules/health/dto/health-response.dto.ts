import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsIn, IsISO8601, ValidateNested } from 'class-validator';
import { ServiceHealthDto } from './service-health.dto';

/**
 * Aggregated health response returned by the API.
 *
 * Decision: the response is DTO-based from day one so frontend widgets, Swagger,
 * and tests all consume the same stable contract.
 */
export class HealthResponseDto {
  @ApiProperty({ example: 'ok' })
  @IsIn(['ok', 'degraded'])
  status!: 'ok' | 'degraded';

  @ApiProperty({ example: '2026-07-01T12:00:00.000Z' })
  @IsISO8601()
  checkedAt!: string;

  @ApiProperty({ type: [ServiceHealthDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceHealthDto)
  services!: ServiceHealthDto[];
}
