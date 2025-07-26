<style scoped lang="scss" src="./app.scss"></style>

<template>
  <Header></Header>
  <div class="terminal-overlay"></div>
  <div class="scanline"></div>
  <main class="main-content">
    <RouterView></RouterView>
  </main>
  <Footer></Footer>
</template>

<script setup lang="ts">
import Header from './components/header/header.vue';
import Footer from './components/footer/footer.vue';
import { useCatsStore } from './store';

const cats$ = useCatsStore();
cats$.initialize();
</script>


