<style lang="scss" scoped src="./banner.scss"></style>

<template>
    <div class="banner" :class="[type]">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { BannerType } from '@/models/banner-type.enum';

const { type } = defineProps<{ 
    type?: BannerType;
}>();
</script>