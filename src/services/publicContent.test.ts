import { describe, expect, it } from 'vitest';
import { getFaqs } from './faqs.service';
import { getGrades } from './grades.service';
import { getResultYears, getResults } from './results.service';
import { getSyllabus, getSyllabusForGrade } from './syllabus.service';
import { sendContactMessage } from './contact.service';
import { ApiError } from '@/lib/api/types';

describe('grades service (via mock API)', () => {
  it('returns the seven grade configurations in order', async () => {
    const grades = await getGrades();
    expect(grades.map((grade) => grade.id)).toEqual(['g4', 'g5', 'g6', 'g7', 'g8', 'g9', 'g10']);
  });

  it('keeps subject marks consistent with totalMarks', async () => {
    const grades = await getGrades();
    for (const grade of grades) {
      const sum = grade.subjects.reduce((total, subject) => total + subject.marks, 0);
      expect(sum, grade.id).toBe(grade.totalMarks);
    }
  });
});

describe('syllabus service (via mock API)', () => {
  it('returns the full library, one entry per grade', async () => {
    const syllabus = await getSyllabus();
    expect(syllabus).toHaveLength(7);
    expect(syllabus.every((item) => item.subjects.length >= 3)).toBe(true);
  });

  it('fetches a single grade syllabus with topics', async () => {
    const syllabus = await getSyllabusForGrade('g6');
    expect(syllabus.gradeId).toBe('g6');
    expect(syllabus.subjects[0]?.topics.length).toBeGreaterThanOrEqual(3);
  });

  it('rejects unknown grade ids with 422', async () => {
    const error = await getSyllabusForGrade('g99').catch((err: unknown) => err);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 422, code: 'VALIDATION' });
  });
});

describe('results service (via mock API)', () => {
  it('indexes published years newest-first', async () => {
    const years = await getResultYears();
    expect(years[0]?.year).toBe(2025);
    expect(years[0]?.gradeIds).toEqual(['g5', 'g8', 'g10']);
    expect(years[1]?.year).toBe(2024);
  });

  it('returns a merit list ordered by position', async () => {
    const result = await getResults({ year: 2025, gradeId: 'g8' });
    expect(result.meritList.map((entry) => entry.position)).toEqual([1, 2, 3, 4, 5]);
    expect(result.meritList[0]?.score).toBeGreaterThanOrEqual(result.meritList[1]?.score ?? 0);
  });

  it('filters the merit list by student or school name', async () => {
    const byStudent = await getResults({ year: 2025, gradeId: 'g8', q: 'mehrab' });
    expect(byStudent.meritList).toHaveLength(1);
    expect(byStudent.meritList[0]?.studentName).toBe('Mehrab Hossain');

    const bySchool = await getResults({ year: 2025, gradeId: 'g10', q: 'uttara' });
    expect(bySchool.meritList.every((entry) => entry.schoolName === 'Uttara Model School')).toBe(
      true,
    );
  });

  it('throws 404 for unpublished year/grade combinations', async () => {
    const error = await getResults({ year: 2025, gradeId: 'g6' }).catch((err: unknown) => err);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, code: 'NOT_FOUND' });
  });

  it('validates the year and grade parameters', async () => {
    const badYear = await getResults({ year: 20, gradeId: 'g8' }).catch((err: unknown) => err);
    expect(badYear).toMatchObject({ status: 422, code: 'VALIDATION' });

    const badGrade = await getResults({ year: 2025, gradeId: 'g99' }).catch((err: unknown) => err);
    expect(badGrade).toMatchObject({ status: 422, code: 'VALIDATION' });
  });
});

describe('faqs service (via mock API)', () => {
  it('returns bilingual FAQs across categories', async () => {
    const faqs = await getFaqs();
    expect(faqs.length).toBeGreaterThanOrEqual(5);
    for (const faq of faqs) {
      expect(faq.question.en.length).toBeGreaterThan(0);
      expect(faq.question.bn.length).toBeGreaterThan(0);
      expect(faq.answer.bn.length).toBeGreaterThan(0);
    }
  });
});

describe('contact service (via mock API)', () => {
  const VALID = {
    name: 'Ariana Rahman',
    email: 'ariana@example.test',
    subject: 'Question about the exam',
    message: 'Where can I find the sample syllabus for Grade 6?',
  };

  it('accepts a valid message and returns an id', async () => {
    const result = await sendContactMessage(VALID);
    expect(result.id).toMatch(/^cm-/);
  });

  it('rejects invalid input with field-level errors', async () => {
    const error = await sendContactMessage({
      name: 'A',
      email: 'not-an-email',
      subject: 'Hi',
      message: 'too short',
    }).catch((err: unknown) => err);
    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 422, code: 'VALIDATION' });
    expect(Object.keys((error as ApiError).details ?? {})).toEqual(
      expect.arrayContaining(['name', 'email', 'subject', 'message']),
    );
  });
});
