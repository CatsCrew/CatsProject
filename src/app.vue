<style scoped lang="scss" src="./app.scss"></style>

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
</template>

<script setup lang="ts">
import Header from './components/header/header.vue';
import Footer from './components/footer/footer.vue';
import Button from 'primevue/button';
import { useCatsStore } from './store';
import Toast from 'primevue/toast';
import { useRouter } from 'vue-router';

const router$ = useRouter();

const cats$ = useCatsStore();
cats$.initialize();

let showNewVersionOverlay = $ref(false);

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
</script>


