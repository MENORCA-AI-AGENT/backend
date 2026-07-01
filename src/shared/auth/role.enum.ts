/**
 * Supported authorization roles for backend route protection.
 *
 * Decision: roles are modeled as a TypeScript enum to give controllers and tests
 * a single vocabulary while the persistence layer can later map them to Supabase
 * app metadata or an RLS-protected roles table.
 */
export enum Role {
  Guest = 'guest',
  User = 'user',
  PaidUser = 'paid_user',
  Admin = 'admin',
}
