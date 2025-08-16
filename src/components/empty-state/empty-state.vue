<style lang="scss" scoped src="./empty-state.scss"></style>

<template>
    <div class="empty-state-container">
        <img
            class="empty-state-img"
            alt="empty state image" 
            :src="image" />
        <div class="empty-state-content">
            <div
                v-if="title"
                class="header"> 
                {{ title }} 
            </div>
            <div
                v-if="subtitle"
                class="subheader"> 
                {{ subtitle }} 
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const { image, title, subtitle } = defineProps<{
    image?: string;
    title?: string;
    subtitle?: string;
}>();
</script>