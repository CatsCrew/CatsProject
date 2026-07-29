/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** PrimeVue 5 commercial license key. Set in .env (gitignored), never committed. */
  readonly VITE_PRIMEUI_LICENSE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
