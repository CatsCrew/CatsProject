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
                <div class="cat-right-rail">
                    <div
                        v-if="!isMobile && cat.creator"
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
                    <button
                        class="menu-btn"
                        @click="toggle"
                        aria-haspopup="true"
                        aria-controls="overlay_menu">
                        <i class="pi pi-ellipsis-v"></i>
                    </button>
                    <Menu
                        ref="menu"
                        id="overlay_menu"
                        :model="items"
                        popup>
                    </Menu>
                </div>
            </div>
            <div
                v-if="isMobile && cat.creator"
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
import { defineAsyncComponent, useTemplateRef } from "vue";
import { useCatsStore } from "@/store";
import { storeToRefs } from "pinia";
import Menu from 'primevue/menu';
import { useToast } from "primevue/usetoast";

const PrimaryCarousel = defineAsyncComponent(() => import('@/components/primary-carousel/primary-carousel.vue'));
const GalleryCarousel = defineAsyncComponent(() => import('@/components/gallery-carousel/gallery-carousel.vue'));

const { id } = defineProps<{
    id?: string;
}>();

const cat$ = useCatsStore();
const { catById, isMobile } = $(storeToRefs(cat$));

const toast = useToast();

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

const menu = $(useTemplateRef('menu'));
const items = $ref([
    {
        label: 'Options',
        items: [
            {
                label: 'Copy Link',
                icon: 'pi pi-share-alt',
                command: async () => {
                    await navigator.clipboard.writeText(window.location.href);
                    toast.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Link Copied!',
                        life: 3000,
                        group: isMobile ? 'mobile' : 'desktop'
                    });
                }
            },
        ]
    }
]);

const toggle = (event) => {
    menu.toggle(event);
};
</script>