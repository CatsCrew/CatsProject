<style lang="scss" scoped src="./character-card.scss"></style>

<template>
    <Card
        class="cat-card"
        :class="[ cat.type, { hoverable }]"
        @click="onAerocatClicked">
        <template #header>
            <div class="image-container">
                <Skeleton
                    v-if="loading"
                    class="character-card-skeleton">
                </Skeleton>
                <DeferredContent
                    class="deferred-content">
                    <img
                        class="cat-card-img"
                        alt="aerocat profile image"
                        :src="cat.galleryUrls[0]"
                        :data-loading="loading"
                        @load="onImageLoad"/>
                </DeferredContent>
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
                <img 
                    v-if="cat?.creator?.profileUrl"
                    class="creator-img" 
                    alt="creator profile image" 
                    :src="cat?.creator?.profileUrl"/>
                <span class="creator-name"> {{ cat?.creator?.name }} </span>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from '@/components/card/card.vue';
import Skeleton from 'primevue/skeleton';
import { Cat } from '@/models/cat.model';
import DeferredContent from 'primevue/deferredcontent';

const { cat, hoverable = true } = defineProps<{
    cat?: Cat;
    hoverable?: boolean;
}>();

const emit = defineEmits<{
    (e: 'cat-selected', cat: Cat): void;
}>();

let loading = $ref(true);

function onAerocatClicked() {
    emit('cat-selected', cat);
}

function onImageLoad() {
    loading = false;
}
</script>