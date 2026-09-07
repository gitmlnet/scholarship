import type {
  Application,
  AuditEntry,
  ContactMessage,
  Faq,
  GradeConfig,
  Notice,
  ProgramSettings,
  ResultYear,
  ResultYearIndexEntry,
  Statistic,
  Syllabus,
} from '@/types';
import { seedFaqs } from '@/data/seed/faqs';
import { seedGrades } from '@/data/seed/grades';
import { seedNotices } from '@/data/seed/notices';
import { seedProgramSettings } from '@/data/seed/programSettings';
import { seedResults, seedResultIndex } from '@/data/seed/results';
import { seedStats } from '@/data/seed/stats';
import { seedSyllabus } from '@/data/seed/syllabus';
import { clearUserTables, loadUserTable } from './persistence';

/**
 * The in-memory "database". Read-mostly tables come from seed; tables that
 * users mutate (applications, audit log, contact inbox) hydrate from
 * localStorage.
 */
export interface Db {
  settings: ProgramSettings;
  notices: Notice[];
  stats: Statistic[];
  faqs: Faq[];
  grades: GradeConfig[];
  syllabus: Syllabus[];
  results: ResultYear[];
  resultIndex: ResultYearIndexEntry[];
  applications: Application[];
  auditLog: AuditEntry[];
  contactMessages: ContactMessage[];
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

function isContactMessage(value: unknown): value is ContactMessage {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Partial<ContactMessage>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.email === 'string' &&
    typeof candidate.createdAt === 'string'
  );
}

export function createDb(): Db {
  return {
    settings: seedProgramSettings,
    notices: [...seedNotices],
    stats: [...seedStats],
    faqs: [...seedFaqs],
    grades: [...seedGrades],
    syllabus: [...seedSyllabus],
    results: [...seedResults],
    resultIndex: [...seedResultIndex],
    applications: (loadUserTable('applications', isApplication) as Application[]) ?? [],
    auditLog: (loadUserTable('auditLog', isAuditEntry) as AuditEntry[]) ?? [],
    contactMessages: (loadUserTable('contactMessages', isContactMessage) as ContactMessage[]) ?? [],
  };
}

/** Wipe persisted user data and return a pristine seed-only DB. */
export function resetDb(): Db {
  clearUserTables();
  return createDb();
}
