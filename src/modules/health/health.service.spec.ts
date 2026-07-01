import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { of, throwError } from 'rxjs';
import { HealthService } from './health.service';

/**
 * Unit tests for dependency health checks.
 *
 * Decision: external service checks are mocked so CI verifies orchestration logic
 * without requiring real Supabase, Stripe, AI, Milvus, or public web credentials.
 */
describe('HealthService', () => {
  /**
   * Creates the health service with controlled config and HTTP behavior.
   *
   * Decision: direct construction is enough because the service has no framework
   * lifecycle hooks and this keeps the tests fast.
   */
  function createService(
    config: Record<string, string>,
    httpGet = jest.fn().mockReturnValue(of({ status: 200 })),
  ): HealthService {
    const configService = {
      get: jest.fn((key: string) => config[key]),
    } as unknown as ConfigService;
    const httpService = {
      get: httpGet,
    } as unknown as HttpService;

    return new HealthService(configService, httpService);
  }

  /**
   * Verifies missing provider settings degrade the report.
   *
   * Decision: degraded startup visibility is safer than pretending integrations
   * are healthy when the environment is incomplete.
   */
  it('marks missing services as degraded', async () => {
    const service = createService({});

    const result = await service.check();

    expect(result.status).toBe('degraded');
    expect(result.services).toContainEqual(
      expect.objectContaining({
        name: 'supabase',
        configured: false,
        reachable: false,
      }),
    );
  });

  /**
   * Verifies public URL probes are executed when configured.
   *
   * Decision: public providers such as weather and TMSA can be checked without
   * spending paid provider quota, so they get real connectivity probes.
   */
  it('checks reachable URL-based services', async () => {
    const httpGet = jest.fn().mockReturnValue(of({ status: 200 }));
    const service = createService(
      {
        OPEN_METEO_BASE_URL: 'https://api.open-meteo.com',
        TMSA_BASE_URL: 'https://www.tmsa.es',
      },
      httpGet,
    );

    const result = await service.check();

    expect(httpGet).toHaveBeenCalledWith(
      expect.stringContaining('https://api.open-meteo.com/v1/forecast'),
      { timeout: 5000 },
    );
    expect(result.services).toContainEqual(
      expect.objectContaining({
        name: 'open-meteo',
        configured: true,
        reachable: true,
      }),
    );
  });

  /**
   * Verifies probe failures are reported without throwing the whole endpoint.
   *
   * Decision: health endpoints should diagnose partial outages rather than fail
   * completely when one dependency is down.
   */
  it('reports unreachable services when probes fail', async () => {
    const service = createService(
      { OPEN_METEO_BASE_URL: 'https://api.open-meteo.com' },
      jest.fn().mockReturnValue(throwError(() => new Error('network error'))),
    );

    const result = await service.check();

    expect(result.services).toContainEqual(
      expect.objectContaining({
        name: 'open-meteo',
        configured: true,
        reachable: false,
        message: 'network error',
      }),
    );
  });
});
