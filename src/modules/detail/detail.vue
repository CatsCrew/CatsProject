<style lang="scss" scoped src="./detail.scss"></style>

<template>
    <div class="detail-container">
        <section class="carousel-container">
            <PrimaryCarousel :images="images">
            </PrimaryCarousel>
        </section>
        <section class="cat-info-container">
            <div class="cat-info">
                <div class="name">
                    {{ cat.name }}
                </div>
                <div class="model">
                    {{ cat.model }}
                </div>
            </div>
            <div
                v-if="cat.description"
                class="about">
                <div class="creator">
                    <img 
                        v-if="cat?.creator?.profileUrl"
                        class="creator-img" 
                        alt="creator profile image" 
                        :src="cat?.creator?.profileUrl"/>
                    <span class="creator-name"> {{ cat?.creator?.name }} </span>
                </div>
                <div class="header">
                    About {{ cat.name}}
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

const PrimaryCarousel = defineAsyncComponent(() => import('@/components/primary-carousel/primary-carousel.vue'));

const { id } = defineProps<{
    id?: string;
}>();


const cat$ = useCatsStore();
const { catById } = $(storeToRefs(cat$));

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