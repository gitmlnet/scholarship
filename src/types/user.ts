/** Demo account roles. Authorization is enforced in the API layer. */
export type UserRole = 'applicant' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
}

/**
 * How demo credentials are stored: a salted SHA-256 digest, never plaintext.
 * This teaches the real-world pattern without pretending to be production
 * password storage (documented in docs/ARCHITECTURE.md §9).
 */
export interface CredentialRecord {
  algorithm: 'sha256';
  salt: string;
  hash: string;
}

/** Full user record — lives ONLY inside the mock API, never sent to the UI. */
export interface UserRecord extends User {
  credential: CredentialRecord;
}
