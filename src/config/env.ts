/**
 * Public environment configuration (Vite only exposes VITE_* vars).
 * These values are PUBLIC and bundled into the app — never put secrets here.
 * See .env.example.
 */
export const appEnv = {
  /** Base URL of a real backend. Empty string → use the in-browser mock API. */
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL ?? '').trim(),
  /** Whether the mock API simulates network latency. */
  mockLatencyEnabled: import.meta.env.VITE_MOCK_LATENCY !== 'false',
  /** Whether demo-mode labels/disclaimers are shown. */
  demoMode: import.meta.env.VITE_DEMO_MODE !== 'false',
} as const;
