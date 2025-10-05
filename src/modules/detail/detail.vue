<style lang="scss" scoped src="./detail.scss"></style>

<template>
    <div class="detail-container">
        <div class="back-container">
            <button class="back-btn" @click="onBack">
                <i class="pi pi-icon pi-arrow-left"></i>
            </button>
        </div>
        <section class="carousel-container">
            <GalleryCarousel
                v-if="isMobile"
                :key="`gallery-carousel-${id}`"
                :images="images">
            </GalleryCarousel>
            <PrimaryCarousel
                v-else
                :key="`primary-carousel-${id}`"
                :images="images">
            </PrimaryCarousel>
        </section>
        <section class="cat-info-container">
            <component
                :is="components[cat.type]"
                :cat="cat"
                :is-mobile="isMobile">
            </component>
        </section>
    </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from "vue";
import { useCatsStore } from "@/store";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { CatType } from "@/models/cat-type.enum";
import { RouteNames } from "@/app.routes";

const PrimaryCarousel = defineAsyncComponent(() => import('@/components/primary-carousel/primary-carousel.vue'));
const GalleryCarousel = defineAsyncComponent(() => import('@/components/gallery-carousel/gallery-carousel.vue'));
const Aerocat = defineAsyncComponent(() => import('./components/aerocat/aerocat.vue'));
const Landcat = defineAsyncComponent(() => import('./components/landcat/landcat.vue'));
const Proto = defineAsyncComponent(() => import('./components/proto/proto.vue'));

const { id } = defineProps<{
    id?: string;
}>();

const components = {
    [CatType.Aerocat]: Aerocat,
    [CatType.Landcat]: Landcat,
    [CatType.Proto]: Proto
};

const cat$ = useCatsStore();
const { catById, isMobile } = $(storeToRefs(cat$));

const router$ = useRouter();

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



function onBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        switch (cat.type) {
            case CatType.Aerocat:
                router$.push({ name: RouteNames.Aerocats });
                break;
            case CatType.Landcat:
                router$.push({ name: RouteNames.Landcats });
                break;
            case CatType.Proto:
                router$.push({ name: RouteNames.Protos });
                break;
        }
    }
}
</script>