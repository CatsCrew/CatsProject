import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vitest/config';

// The helpers under test are plain TypeScript, so this config deliberately skips
// the Vue plugin and devtools from vite.config.ts - it only needs path aliases.
export default defineConfig({
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
            '@models': fileURLToPath(new URL('./src/models', import.meta.url)),
        },
    },
    test: {
        environment: 'node',
        include: ['src/**/*.spec.ts']
    }
});
