<style lang="scss" scoped src="./character-card.scss"></style>

<template>
    <div class="character-card-container">
        <template v-if="hoverable">
            <router-link
                class="cat-wrapper"
                :to="{ name: RouteNames.Character, params: { id: cat.id || 0 }}">
                <Card
                    class="cat-card"
                    :class="[ cat.type, { hoverable }]"
                    @click="onAerocatClicked"
                    ref="characterCard">
                    <template #header>
                        <div
                            class="image-container"
                            ref="imageContainer">
                            <Skeleton
                                v-if="loading"
                                class="character-card-skeleton">
                            </Skeleton>
                            <img
                                class="cat-card-img"
                                alt="aerocat profile image"
                                :data-src="cat.galleryUrls[0]"
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
                            class="creator"
                            ref="creatorContainer">
                            <img 
                                v-if="cat?.creator?.profileUrl"
                                class="creator-img" 
                                alt="creator profile image" 
                                :data-src="cat?.creator?.profileUrl"/>
                            <span class="creator-name"> {{ cat?.creator?.name }} </span>
                        </div>
                    </template>
                </Card>
            </router-link>
        </template>
        <template v-else>
            <Card
                class="cat-card">
                <template #header>
                    <div
                        class="image-container"
                        ref="imageContainer">
                        <img
                            class="cat-card-img"
                            alt="aerocat profile image"
                            :src="cat.galleryUrls[0]"/>
                    </div>
                </template>
                <template #title>
                    <div class="cat-model">
                        {{ cat?.model }}
                    </div>
                </template>
            </Card>
        </template>
    </div>
</template>

<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue';
import Card from '@/components/card/card.vue';
import Skeleton from 'primevue/skeleton';
import { Cat } from '@/models/cat.model';
import { useRouter } from 'vue-router';
import { RouteNames } from '@/app.routes';
import { DeferHelper } from '@/helper/defer.helper';

const { cat, hoverable = true } = defineProps<{
    cat?: Cat;
    hoverable?: boolean;
}>();

const router$ = useRouter();
const characterCard = $(useTemplateRef('characterCard'));

let loading = $ref(true);

function onAerocatClicked() {
    router$.push({ name: RouteNames.Character, params: { id: cat.id }});
}

function onImageLoad() {
    loading = false;
}

onMounted(() => {
    if (characterCard) {
        DeferHelper.defer(characterCard.$el);
    }
    
});
</script>