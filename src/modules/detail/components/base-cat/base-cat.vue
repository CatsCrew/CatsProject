<style lang="scss" scoped src="./base-cat.scss"></style>

<template>
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
        <slot name="kpi"></slot>
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
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue';
import { Cat } from '@/models/cat.model';
import Menu from 'primevue/menu';
import { useToast } from "primevue/usetoast";

const { cat, isMobile } = defineProps<{
    cat: Cat;
    isMobile?: boolean;
}>();

const toast = useToast();

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

const toggle = (event: Event) => {
    menu.toggle(event);
};
</script>