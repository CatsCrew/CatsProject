import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueReactivityTransform from '@vue-macros/reactivity-transform/vite';
import vueDefineModels from '@vue-macros/define-models/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue({
      template: {
        transformAssetUrls: {
          video: ['src', 'poster'],
          source: ['src'],
          img: ['src'],
          image: ['xlink:href', 'href'],
          use: ['xlink:href', 'href']
        }
      }
    }),
    vueReactivityTransform(),
    vueDefineModels()
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@models': fileURLToPath(new URL('./src/models', import.meta.url)),
    },
  }
})
