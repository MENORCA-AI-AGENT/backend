import { Request } from 'express';
import { Role } from './role.enum';

/**
 * Minimal authenticated user shape expected by guards and decorators.
 *
 * Decision: this interface intentionally avoids coupling the app to a concrete
 * Supabase JWT payload until the auth module is implemented, making the guard
 * testable and replaceable.
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
    roles: Role[];
    provider?: string;
  };
}
