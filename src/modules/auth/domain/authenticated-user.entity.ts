import { Role } from '../../../shared/auth/role.enum';

/**
 * Authenticated user information trusted by the backend.
 *
 * Decision: the backend keeps its own minimal user entity so controllers and
 * use cases do not depend directly on Supabase SDK response shapes.
 */
export class AuthenticatedUser {
  constructor(
    public readonly id: string,
    public readonly email: string | undefined,
    public readonly roles: Role[],
    public readonly provider: string | undefined,
  ) {}
}
