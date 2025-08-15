import { createApp } from "vue";
import App from "./app.vue";
import { createWebHistory, createRouter } from "vue-router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { routes } from "./app.routes";
import { createPinia } from 'pinia';
import './main.scss';
import 'primeicons/primeicons.css';

const router = createRouter({
  history: createWebHistory(),
  routes,
});

const pinia = createPinia();

createApp(App)
  .use(router)
  .use(pinia)
  .use(PrimeVue, {
    // Default theme configuration
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: true,
      },
    },
  })
  .mount("#app");
