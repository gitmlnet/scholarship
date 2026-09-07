/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Base URL of a real backend API; empty → in-browser mock API. */
  readonly VITE_API_BASE_URL?: string;
  /** 'false' disables simulated mock-API latency. */
  readonly VITE_MOCK_LATENCY?: string;
  /** 'false' hides demo-mode labels/disclaimers. */
  readonly VITE_DEMO_MODE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
