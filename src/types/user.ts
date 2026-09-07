/** Demo account roles. Authorization is enforced in the API layer. */
export type UserRole = 'applicant' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
}
