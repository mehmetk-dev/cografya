/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL?: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  readonly VITE_E2E_AUTH_BYPASS?: string;
  readonly VITE_PUBLIC_ACCESS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
