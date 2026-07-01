import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthResponseDto } from './dto/health-response.dto';
import { HealthService } from './health.service';

/**
 * Exposes operational endpoints used by Swagger, CI, and deployment checks.
 *
 * Decision: health endpoints stay public because they return only availability
 * metadata and no secret values, making them useful before authentication exists.
 */
@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  /**
   * Returns the current configuration and connectivity status for integrations.
   *
   * Decision: a single aggregated endpoint keeps manual Swagger testing simple
   * while still giving enough detail to identify which provider needs attention.
   */
  @Get()
  @ApiOkResponse({ type: HealthResponseDto })
  check(): Promise<HealthResponseDto> {
    return this.healthService.check();
  }
}
