<style lang="scss" scoped src="./character-card.scss"></style>

<template>
    <Card class="cat-card" @click="onAerocatClicked">
        <template #header>
            <div class="image-container">
                <Skeleton
                    v-if="loading"
                    width="100%"
                    height="100%">
                </Skeleton>
                <img
                    class="cat-card-img"
                    alt="aerocat profile image"
                    :src="cat.galleryImagePaths[0]"
                    :data-loading="loading"
                    @load="onImageLoad"/>
            </div>
        </template>
        <template #title>
            <div class="cat-model">
                {{ cat?.model }}
            </div>
        </template>
        <template #subtitle>
            <div class="cat-name">
                {{ cat?.name }}
            </div>
        </template>
        <template #footer>
            <div
                v-if="cat?.creator"
                class="creator">
                <img class="creator-img" alt="creator profile image" :src="creatorAsset"/>
                <span class="creator-name"> {{ cat?.creator }} </span>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from '@/components/card/card.vue';
import Skeleton from 'primevue/skeleton';
import { Cat } from '@/models/cat.model';

const { cat } = defineProps<{
    cat?: Cat;
}>();

const emit = defineEmits<{
    (e: 'cat-selected', cat: Cat): void;
}>();

let loading = $ref(true);
const creatorAsset = $computed(() => {
    if (!cat?.creator) 
        return null;

    return new URL(`/src/assets/images/creators/${cat.creator.toLowerCase().replaceAll(' ', '_')}.png`, import.meta.url).href;
});

function onAerocatClicked() {
    emit('cat-selected', cat);
}

function onImageLoad() {
    loading = false;
}
</script>