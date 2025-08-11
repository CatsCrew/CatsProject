<style lang="scss" scoped src="./detail.scss"></style>

<template>
    <div class="detail-container">
        <section class="carousel-container">
            <GalleryCarousel
                v-if="isMobile"
                :images="images">
            </GalleryCarousel>
            <PrimaryCarousel
                v-else
                :images="images">
            </PrimaryCarousel>
        </section>
        <section class="cat-info-container">
            <div class="cat-info-header">
                <div class="cat-info">
                    <div class="name">
                        {{ cat?.name }}
                    </div>
                    <div class="model">
                        {{ cat?.model || 'Unknown' }}
                    </div>
                </div>
                <div
                    v-if="cat.creator"
                    class="creator-info">
                    <div class="creator">
                        <img 
                            v-if="cat?.creator?.profileUrl"
                            class="creator-img" 
                            alt="creator profile image" 
                            :src="cat?.creator?.profileUrl"/>
                        <span class="creator-name"> {{ cat?.creator?.name }} </span>
                    </div>
                </div>
            </div>
            <div
                v-if="cat.description"
                class="about">
                <div class="header">
                    About
                </div>
                <p class="description">
                    {{ cat.description }}
                </p>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useCatsStore } from "@/store";
import { storeToRefs } from "pinia";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

const PrimaryCarousel = defineAsyncComponent(() => import('@/components/primary-carousel/primary-carousel.vue'));
const GalleryCarousel = defineAsyncComponent(() => import('@/components/gallery-carousel/gallery-carousel.vue'));

const { id } = defineProps<{
    id?: string;
}>();

const cat$ = useCatsStore();
const { catById, isMobile } = $(storeToRefs(cat$));

const cat = $computed(() => catById(id));
const images = $computed(() => {
    let allImages = [];
    if (cat?.referenceUrls?.length) {
        allImages.push(...cat.referenceUrls);
    }

    if (cat?.galleryUrls?.length) {
        allImages.push(...cat.galleryUrls);
    }

    return allImages;
});
</script>