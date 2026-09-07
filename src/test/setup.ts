import '@testing-library/jest-dom/vitest';
import { afterEach, beforeEach } from 'vitest';
import i18next from '@/i18n';
import { resetMockApi } from '@/mock-api';

beforeEach(() => {
  window.localStorage.clear();
  window.sessionStorage.clear(); // demo-auth sessions + client token
  resetMockApi();
});

afterEach(async () => {
  await i18next.changeLanguage('en');
});
