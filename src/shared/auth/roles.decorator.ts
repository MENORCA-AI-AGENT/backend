import { SetMetadata } from '@nestjs/common';
import { Role } from './role.enum';

/**
 * Metadata key used by RolesGuard to read the route authorization contract.
 *
 * Decision: exporting the key keeps the guard explicit and avoids string
 * duplication when tests need to assert role metadata behavior.
 */
export const ROLES_KEY = 'roles';

/**
 * Declares which roles can execute a controller handler.
 *
 * Decision: authorization is expressed at the presentation layer because route
 * access is an API concern, while business rules remain inside application
 * services and use cases.
 */
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
