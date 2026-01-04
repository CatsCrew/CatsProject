<style lang="scss" scoped src="./character-card.scss"></style>

<template>
    <div class="character-card-container">
        <template v-if="isPlaceholder">
            <Card
                class="cat-card">
                <template #header>
                    <div
                        class="image-container"
                        ref="imageContainer">
                        <img
                            class="cat-card-img"
                            alt="aerocat profile image"
                            :src="cat.thumbnail"/>
                    </div>
                </template>
                <template #title>
                    <div class="cat-model">
                        {{ cat?.model }}
                    </div>
                </template>
            </Card>  
        </template>
        <template v-else>
            <router-link
                class="cat-wrapper"
                :to="{ name: RouteNames.Character, params: { id: cat.id }}">
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
                                :data-src="cat.thumbnail"
                                :data-loading="loading"
                                @load="onImageLoad"/>
                            <div class="overlay">
                                <slot name="overlay-content"></slot>
                            </div>
                        </div>
                    </template>
                    <template #pills>
                        <slot name="pills"></slot>
                    </template>
                    <template #title>
                        <slot name="title">
                            <div class="cat-model">
                                {{ cat?.model }}
                            </div>
                        </slot>
                    </template>
                    <template #subtitle>
                        <slot name="subtitle">
                            <div class="cat-name">
                                {{ cat?.name }}
                            </div>
                        </slot>
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

const { cat, hoverable = true, isPlaceholder = false } = defineProps<{
    cat?: Cat;
    hoverable?: boolean;
    isPlaceholder?: boolean;
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