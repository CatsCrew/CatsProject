import { createApp } from "vue";
import App from "./app.vue";
import { createWebHistory, createRouter } from "vue-router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import { routes } from "./app.routes";
import { createPinia } from 'pinia';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBluesky, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons'
import './main.scss';
import 'primeicons/primeicons.css';

library.add(faBluesky, faInstagram, faTwitter);

const router = createRouter({
  history: createWebHistory('/CatsProject/'),
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
