<style lang="scss" scoped src="./character-card.scss"></style>

<template>
    <Card class="cat-card" @click="onAerocatClicked">
        <template #header>
            <DeferredContent>
                <img class="cat-card-img" alt="aerocat profile image" :src="cat.galleryImagePaths[0]"/>
            </DeferredContent>
        </template>
        <template #content>
            <div class="cat-content-container">
                <div class="cat-content">
                    <div class="cat-model">
                        {{ cat?.model }}
                    </div>
                    <div class="cat-name">
                        {{ cat?.name }}
                    </div>
                </div>
                <div
                    v-if="cat?.creator"
                    class="creator">
                    <img class="creator-img" alt="creator profile image" :src="creatorAsset"/>
                    <span class="creator-name"> {{ cat?.creator }} </span>
                </div>
            </div>
        </template>
    </Card>
</template>

<script setup lang="ts">
import Card from 'primevue/card';
import { Cat } from '@/models/cat.model';
import DeferredContent from 'primevue/deferredcontent';

const { cat } = defineProps<{
    cat?: Cat;
}>();

const emit = defineEmits<{
    (e: 'cat-selected', cat: Cat): void;
}>();

const creatorAsset = $computed(() => {
    if (!cat?.creator) 
        return null;

    return new URL(`/src/assets/images/creators/${cat.creator.toLowerCase().replaceAll(' ', '_')}.png`, import.meta.url).href;
});

function onAerocatClicked() {
    emit('cat-selected', cat);
}
</script>