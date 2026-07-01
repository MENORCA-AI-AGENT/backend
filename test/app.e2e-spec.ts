import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

/**
 * End-to-end smoke tests for the HTTP API bootstrap.
 *
 * Decision: the test mirrors the production `/api` prefix so regressions in the
 * public routing contract are caught before Swagger or frontend work depends on
 * the endpoint.
 */
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  /**
   * Confirms the root API endpoint responds through the configured API prefix.
   *
   * Decision: keeping this as a minimal smoke test gives quick feedback that the
   * Nest app can boot and serve HTTP before deeper feature e2e tests are added.
   */
  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect('Menorca Travel Agent API');
  });

  afterEach(async () => {
    await app.close();
  });
});
