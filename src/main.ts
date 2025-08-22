import { createApp } from "vue";
import App from "./app.vue";
import { createWebHistory, createRouter } from "vue-router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { routes } from "./app.routes";
import { createPinia } from 'pinia';
import './main.scss';
import 'primeicons/primeicons.css';
import ToastService from 'primevue/toastservice';

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
    // Default theme configuration
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark-app',
      },
    },
  })
  .mount("#app");
