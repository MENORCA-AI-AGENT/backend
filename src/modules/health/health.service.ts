import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HealthResponseDto } from './dto/health-response.dto';
import { ServiceHealthDto } from './dto/service-health.dto';

type ServiceProbe = {
  name: string;
  urlConfigKey?: string;
  secretConfigKey?: string;
  probePath?: string;
};

/**
 * Checks configuration and lightweight connectivity for external dependencies.
 *
 * Decision: health checks live in their own module because they are operational
 * concerns shared by development, Swagger testing, CI, and future deployment
 * monitors, rather than belonging to a single business feature.
 */
@Injectable()
export class HealthService {
  private readonly probes: ServiceProbe[] = [
    {
      name: 'supabase',
      urlConfigKey: 'SUPABASE_URL',
      secretConfigKey: 'SUPABASE_PUBLISHABLE_KEY',
    },
    {
      name: 'open-meteo',
      urlConfigKey: 'OPEN_METEO_BASE_URL',
      probePath:
        '/v1/forecast?latitude=39.8885&longitude=4.2658&hourly=temperature_2m&forecast_days=1',
    },
    {
      name: 'tmsa',
      urlConfigKey: 'TMSA_BASE_URL',
      probePath: '/transporte-regular',
    },
    { name: 'deepseek', secretConfigKey: 'DEEPSEEK_API_KEY' },
    { name: 'gemini', secretConfigKey: 'GEMINI_API_KEY' },
    { name: 'groq', secretConfigKey: 'GROQ_API_KEY' },
    { name: 'openai', secretConfigKey: 'OPENAI_API_KEY' },
    { name: 'stripe', secretConfigKey: 'STRIPE_SECRET_KEY' },
    { name: 'milvus', urlConfigKey: 'MILVUS_ADDRESS' },
  ];

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Builds a dependency report by checking configured values and optional URLs.
   *
   * Decision: provider APIs that require paid or rate-limited calls are treated
   * as configured-only checks for now; URL-based public services get a real HTTP
   * probe so we verify the integrations we can test safely without consuming AI
   * or payment provider quota.
   */
  async check(): Promise<HealthResponseDto> {
    const services = await Promise.all(
      this.probes.map((probe) => this.checkService(probe)),
    );

    return {
      status: services.every((service) => service.configured)
        ? 'ok'
        : 'degraded',
      checkedAt: new Date().toISOString(),
      services,
    };
  }

  /**
   * Checks one dependency without exposing the actual configured value.
   *
   * Decision: this private method keeps provider-specific behavior contained so
   * new services can be added to the probe list without changing controller code.
   */
  private async checkService(probe: ServiceProbe): Promise<ServiceHealthDto> {
    const url = probe.urlConfigKey
      ? this.configService.get<string>(probe.urlConfigKey)
      : undefined;
    const secret = probe.secretConfigKey
      ? this.configService.get<string>(probe.secretConfigKey)
      : undefined;
    const configured = Boolean(url || secret);

    if (!configured) {
      return {
        name: probe.name,
        configured: false,
        reachable: false,
        message: `Missing ${probe.urlConfigKey ?? probe.secretConfigKey}`,
      };
    }

    if (!url || !probe.probePath) {
      return {
        name: probe.name,
        configured: true,
        reachable: true,
        message:
          'Configured; live probe skipped to avoid consuming provider quota.',
      };
    }

    const start = Date.now();

    try {
      await firstValueFrom(
        this.httpService.get(`${url}${probe.probePath}`, { timeout: 5000 }),
      );

      return {
        name: probe.name,
        configured: true,
        reachable: true,
        latencyMs: Date.now() - start,
      };
    } catch (error) {
      return {
        name: probe.name,
        configured: true,
        reachable: false,
        latencyMs: Date.now() - start,
        message: error instanceof Error ? error.message : 'Unknown probe error',
      };
    }
  }
}
