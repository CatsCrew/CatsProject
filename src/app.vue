<style  lang="scss" src="./app.scss"></style>

<template>
  <Header></Header>
  <div class="terminal-overlay"></div>
  <main class="main-content">
    <RouterView></RouterView>
    <div
      v-if="showNewVersionOverlay"
      class="new-version-overlay">
      <p class="new-version-text">
        A new update is available. Please refresh to get the latest version.
      </p>
      <Button @click="reloadApp">Refresh Now</Button>
    </div>
  </main>
  <Footer></Footer>
  <Toast group="desktop"/>
  <Toast position="bottom-center" group="mobile"/>
  <Dialog
    v-model:visible="showWarningModal"
    :closable="false"
    :close-on-escape="false"
    class="warning-dialog"
    pt:mask:style="backdrop-filter: blur(8px)"
    :position="position">
    <template #header>
      <div class="warning-title">
        NSFW Warning
      </div>
    </template>
    <div class="warning-modal-content">
      <span>
        This species can include a wide range of NSFW and NSFL content such as war machines, disaster relief, rubber textures, and robotics, so it is fundamentally classified as R-18+.
      </span>
      <div class="consent-form">
         <Checkbox
          v-model="consented"
          input-id="age-consent"
          binary>
        </Checkbox>
        <label for="age-consent"> I am 18 years or older </label>
      </div>
      <div class="actions">
        <Button
          :disabled="!consented"
          @click="finishWarning">Finish</Button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import Header from './components/header/header.vue';
import Footer from './components/footer/footer.vue';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useCatsStore } from './store';
import { useRouter } from 'vue-router';
import { useStorage } from '@vueuse/core';
import Dialog from 'primevue/dialog';
import Checkbox from 'primevue/checkbox';
import { storeToRefs } from 'pinia';

const router$ = useRouter();

const cats$ = useCatsStore();
const { isMobile } = $(storeToRefs(cats$));
cats$.initialize();

let showNewVersionOverlay = $ref(false);
let acceptedWarning = $(useStorage('accepted-warning', false));
let showWarningModal = $ref(!acceptedWarning);
let consented = $ref(false);
let position = $computed(() => isMobile ? "bottom": null);

router$.onError((error) => {
  const isChunkLoadError =
    error.name === 'ChunkLoadError' ||
    (error.message &&
      (error.message.includes('Failed to fetch dynamically imported module') ||
        error.message.includes(
          "'text/html' is not a valid JavaScript MIME type",
        ) ||
        // For Webpack:
        error.message.includes('Loading chunk failed')));

  if (isChunkLoadError) {
    showNewVersionOverlay = true;
  }
});

function reloadApp() {
  window.location.reload();
}

function finishWarning() {
  acceptedWarning = true;
  showWarningModal = false;
}
</script>


