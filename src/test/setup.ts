import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import i18next from '@/i18n';
import { resetMockApi } from '@/mock-api';

beforeEach(() => {
  window.localStorage.clear();
  resetMockApi();
});

afterEach(async () => {
  await i18next.changeLanguage('en');
});
