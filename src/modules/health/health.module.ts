import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

/**
 * Groups operational health checks and HTTP probing dependencies.
 *
 * Decision: the module imports HttpModule here instead of globally so outbound
 * HTTP clients remain explicit and easy to mock in unit tests.
 */
@Module({
  imports: [HttpModule],
  controllers: [HealthController],
  providers: [HealthService],
})
export class HealthModule {}
