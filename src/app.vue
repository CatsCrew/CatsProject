<style scoped lang="scss" src="./app.scss"></style>

<template>
  <Header></Header>
  <div class="terminal-overlay"></div>
  <main class="main-content">
    <RouterView></RouterView>
  </main>
  <Footer></Footer>
  <Toast group="desktop"/>
  <Toast position="bottom-center" group="mobile"/>
</template>

<script setup lang="ts">
import Header from './components/header/header.vue';
import Footer from './components/footer/footer.vue';
import { useCatsStore } from './store';
import Toast from 'primevue/toast';

const cats$ = useCatsStore();
cats$.initialize();
</script>


