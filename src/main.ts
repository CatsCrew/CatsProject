import { createApp } from "vue";
import App from "./app.vue";
import { createWebHistory, createRouter } from "vue-router";
import PrimeVue from "primevue/config";
// aura-compat keeps PrimeVue 4's 14px-root sizing; plain "aura" recalibrates to a 16px root,
// which would shrink every component ~12% since this app doesn't set a root font-size.
import Aura from "@primeuix/themes/aura-compat";
import { routes } from "./app.routes";
import { createPinia } from 'pinia';
import './main.scss';
import 'primeicons/primeicons.css';
import 'viewerjs/dist/viewer.css';
import ToastService from 'primevue/toastservice';
import Tooltip from 'primevue/tooltip';
import './extensions';

const router = createRouter({
  history: createWebHistory(),
  routes,
    scrollBehavior(_to, _from, savedPosition) {
      if (savedPosition) {
        return savedPosition;
      }
      return { top: 0, left: 0 };
    }
});

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(ToastService)
  .use(PrimeVue, {
    license: import.meta.env.VITE_PRIMEUI_LICENSE,
    // Default theme configuration
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark-app',
      },
    }
  })
  .directive('tooltip', Tooltip)
  .mount("#app");
