import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist', 'coverage', 'node_modules'] },

  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },

  // ── Architecture boundaries ────────────────────────────────────────────────
  // The UI layer (app, components, features, hooks, pages) must consume
  // services — never the API transport, the mock server, or seed data directly.
  // Test files are exempt: they verify integration across layers.
  {
    files: ['src/app/**', 'src/components/**', 'src/features/**', 'src/hooks/**', 'src/pages/**'],
    ignores: ['src/**/*.test.*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/lib/api', '@/lib/api/**', '@/mock-api', '@/mock-api/**', '@/data/**'],
              message: 'UI layers must use src/services — the API/mock layers are services-only.',
            },
          ],
        },
      ],
    },
  },
  {
    files: ['src/services/**'],
    ignores: ['src/services/**/*.test.*'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/mock-api', '@/mock-api/**', '@/data/**'],
              message:
                'Services talk to the ApiClient abstraction (src/lib/api) — never directly to the mock server or seeds.',
            },
          ],
        },
      ],
    },
  },
);
