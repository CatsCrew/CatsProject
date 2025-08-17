<style lang="scss" scoped src="./error-page.scss"></style>

<template>
    <div class="error-page-container">
        <h1>404 - Page Not Found</h1>
        <img 
            class="surprised-proto-img"
            :src="ProtoOh" 
            alt="surprised proto"/>
        <p>The page you are looking for does not exist.</p>
        <router-link
            class="gradient-btn"
            :to="{ name: RouteNames.Home }">
            Go Home
        </router-link>
    </div>
</template>

<script setup lang="ts">
import { RouteNames } from '@/app.routes';
import ProtoOh from '@assets/images/proto-oh.png';

</script>