import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from './role.enum';
import { RolesGuard } from './roles.guard';

/**
 * Unit tests for route role authorization.
 *
 * Decision: role behavior is tested independently from JWT validation so future
 * Supabase token parsing can change without weakening route protection.
 */
describe('RolesGuard', () => {
  const handler = () => undefined;
  class TestController {}

  /**
   * Builds the smallest ExecutionContext needed by the guard.
   *
   * Decision: a tiny factory keeps tests expressive without bootstrapping a full
   * Nest testing module for simple metadata matching.
   */
  function createContext(roles: Role[] = []): ExecutionContext {
    return {
      getHandler: () => handler,
      getClass: () => TestController,
      switchToHttp: () => ({
        getRequest: () => ({
          user: {
            id: 'user-id',
            roles,
          },
        }),
      }),
    } as unknown as ExecutionContext;
  }

  /**
   * Confirms public routes remain accessible.
   *
   * Decision: role metadata is opt-in so public endpoints like health checks do
   * not need mock authentication during development or uptime monitoring.
   */
  it('allows routes without role metadata', () => {
    const guard = new RolesGuard(new Reflector());

    expect(guard.canActivate(createContext())).toBe(true);
  });

  /**
   * Confirms matching user roles are accepted.
   *
   * Decision: matching any role keeps endpoint declarations concise when a route
   * is valid for both paid users and administrators.
   */
  it('allows users with at least one required role', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.Admin]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext([Role.Admin]))).toBe(true);
  });

  /**
   * Confirms non-matching user roles are rejected.
   *
   * Decision: authorization failures return false here so Nest can translate the
   * result into the standard forbidden response at the framework boundary.
   */
  it('rejects users without a required role', () => {
    const reflector = {
      getAllAndOverride: jest.fn().mockReturnValue([Role.Admin]),
    } as unknown as Reflector;
    const guard = new RolesGuard(reflector);

    expect(guard.canActivate(createContext([Role.User]))).toBe(false);
  });
});
