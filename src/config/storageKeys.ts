/**
 * localStorage key constants, shared by the mock API's persistence layer
 * and UI-side storage (wizard drafts). Keeping the namespace in one module
 * means "reset demo data" (which wipes `scholarsphere.db.v1.*`) also clears
 * user drafts — without UI code importing the mock layer.
 */
export const DB_NAMESPACE = 'scholarsphere.db.v1';

/** Autosaved registration wizard draft (values + step). */
export const REGISTER_DRAFT_KEY = `${DB_NAMESPACE}.registerDraft`;

/**
 * Demo-auth session keys. sessionStorage (not localStorage) on purpose:
 * sessions die with the tab — a safer default for a demo, and "reset demo
 * data" never resurrects stale credentials.
 */
export const SESSIONS_TABLE_KEY = 'scholarsphere.session.v1.sessions';
export const SESSION_TOKEN_KEY = 'scholarsphere.session.v1.token';
