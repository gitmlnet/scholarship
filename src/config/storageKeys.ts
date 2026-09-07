/**
 * localStorage key constants, shared by the mock API's persistence layer
 * and UI-side storage (wizard drafts). Keeping the namespace in one module
 * means "reset demo data" (which wipes `scholarsphere.db.v1.*`) also clears
 * user drafts — without UI code importing the mock layer.
 */
export const DB_NAMESPACE = 'scholarsphere.db.v1';

/** Autosaved registration wizard draft (values + step). */
export const REGISTER_DRAFT_KEY = `${DB_NAMESPACE}.registerDraft`;
