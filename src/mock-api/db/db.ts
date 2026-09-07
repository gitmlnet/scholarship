import type { Application, AuditEntry, Faq, Notice, ProgramSettings, Statistic } from '@/types';
import { seedFaqs } from '@/data/seed/faqs';
import { seedNotices } from '@/data/seed/notices';
import { seedProgramSettings } from '@/data/seed/programSettings';
import { seedStats } from '@/data/seed/stats';
import { clearUserTables, loadUserTable } from './persistence';

/**
 * The in-memory "database". Read-mostly tables come from seed; tables that
 * users mutate (applications, audit log) hydrate from localStorage.
 */
export interface Db {
  settings: ProgramSettings;
  notices: Notice[];
  stats: Statistic[];
  faqs: Faq[];
  applications: Application[];
  auditLog: AuditEntry[];
}

function isApplication(value: unknown): value is Application {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<Application>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.status === 'string' &&
    typeof candidate.createdAt === 'string'
  );
}

function isAuditEntry(value: unknown): value is AuditEntry {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<AuditEntry>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.action === 'string' &&
    typeof candidate.at === 'string'
  );
}

export function createDb(): Db {
  return {
    settings: seedProgramSettings,
    notices: [...seedNotices],
    stats: [...seedStats],
    faqs: [...seedFaqs],
    applications: (loadUserTable('applications', isApplication) as Application[]) ?? [],
    auditLog: (loadUserTable('auditLog', isAuditEntry) as AuditEntry[]) ?? [],
  };
}

/** Wipe persisted user data and return a pristine seed-only DB. */
export function resetDb(): Db {
  clearUserTables();
  return createDb();
}
