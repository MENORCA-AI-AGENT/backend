import { validateEnvironment } from './validate-environment';

/**
 * Unit tests for environment validation.
 *
 * Decision: configuration is tested before provider modules exist because a bad
 * environment contract would make every external integration fail at runtime.
 */
describe('validateEnvironment', () => {
  /**
   * Verifies optional service variables allow local development to start.
   *
   * Decision: most secrets are optional at bootstrap so contributors can run
   * tests without real provider credentials.
   */
  it('accepts an empty local environment', () => {
    expect(validateEnvironment({})).toEqual({});
  });

  /**
   * Verifies malformed URLs are caught early.
   *
   * Decision: URL validation prevents confusing health-check failures later in
   * the request lifecycle.
   */
  it('rejects invalid service URLs', () => {
    expect(() =>
      validateEnvironment({ SUPABASE_URL: 'not-a-valid-url' }),
    ).toThrow();
  });
});
