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
                v-if="componentToRender"
                :is="componentToRender"
                :cat="cat"
                :is-mobile="isMobile">
            </component>
        </section>
    </div>
</template>

<script setup lang="ts">
import { computed, defineAsyncComponent } from "vue";
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
const { catById, isMobile } = storeToRefs(cat$);

const router$ = useRouter();

const cat = computed(() => id ? catById.value(id) : undefined);
const componentToRender = computed(() => {
    const c = cat.value;
    if (!c || c.type == null) return null;
    return components[c.type];
});
const images = computed(() => {
    const c = cat.value;
    let allImages: string[] = [];
    const refUrls: string[] = c?.referenceUrls ?? [];
    const galUrls: string[] = c?.galleryUrls ?? [];

    if (refUrls.length) {
        allImages.push(...refUrls);
    }

    if (galUrls.length) {
        allImages.push(...galUrls);
    }

    return allImages;
});

function onBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        const c = cat.value;
        if (!c) {
            router$.push({ name: RouteNames.Home });
            return;
        }

        switch (c.type) {
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