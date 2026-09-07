import { z } from 'zod';
import { REGISTER_DRAFT_KEY } from '@/config/storageKeys';
import { DEFAULT_VALUES, STEP_IDS, type RegisterFormValues } from './schema';

/**
 * Autosaved wizard draft. Lives under the shared `scholarsphere.db.v1.*`
 * namespace so "reset demo data" clears drafts too (see storageKeys.ts).
 * Shape-checked with Zod on load; corrupt drafts are discarded, and values
 * merge over defaults so future form fields never break old drafts.
 */
const draftSchema = z.object({
  version: z.literal(1),
  savedAt: z.string().min(1),
  stepIndex: z.number().int().min(0).max(STEP_IDS.length - 1),
  values: z.record(z.unknown()),
});

export interface RegisterDraft {
  version: 1;
  savedAt: string;
  stepIndex: number;
  values: RegisterFormValues;
}

export function saveRegisterDraft(stepIndex: number, values: RegisterFormValues): void {
  try {
    window.localStorage.setItem(
      REGISTER_DRAFT_KEY,
      JSON.stringify({ version: 1, savedAt: new Date().toISOString(), stepIndex, values }),
    );
  } catch {
    // Storage unavailable (private mode/quota) — the demo degrades gracefully.
  }
}

export function loadRegisterDraft(): RegisterDraft | null {
  try {
    const raw = window.localStorage.getItem(REGISTER_DRAFT_KEY);
    if (raw === null) return null;

    const parsed = draftSchema.safeParse(JSON.parse(raw));
    if (!parsed.success) {
      window.localStorage.removeItem(REGISTER_DRAFT_KEY);
      return null;
    }

    // Merge each section over the defaults (forward-compatible).
    const stored = parsed.data.values as Partial<RegisterFormValues>;
    const values: RegisterFormValues = {
      eligibility: { ...DEFAULT_VALUES.eligibility, ...stored.eligibility },
      student: { ...DEFAULT_VALUES.student, ...stored.student },
      guardian: { ...DEFAULT_VALUES.guardian, ...stored.guardian },
      academic: { ...DEFAULT_VALUES.academic, ...stored.academic },
      payment: { ...DEFAULT_VALUES.payment, ...stored.payment },
    };
    return { version: 1, savedAt: parsed.data.savedAt, stepIndex: parsed.data.stepIndex, values };
  } catch {
    return null; // unreadable JSON or unavailable storage — start fresh
  }
}

export function clearRegisterDraft(): void {
  try {
    window.localStorage.removeItem(REGISTER_DRAFT_KEY);
  } catch {
    // ignore — nothing to clean up
  }
}
