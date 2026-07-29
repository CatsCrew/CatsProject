<style lang="scss" scoped src="./base-cat.scss"></style>

<template>
    <section class="cat-info-container">
        <div class="cat-info-header">
            <div class="cat-info">
                <div class="name">
                    {{ cat?.name }}
                </div>
                <slot name="model">
                    <div class="model">
                        {{ cat?.model || 'Unknown' }}
                    </div>
                </slot>
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
        <div 
            v-if="cat.equipment"
            class="equipment">
            <div class="header">
                Equipment
            </div>
            <DataTable :value="cat.equipment">
                <Column field="name" header="Name"></Column>
                <Column field="description" header="Description"></Column>
            </DataTable>
        </div>
        <div
            v-if="cat.stories && cat.stories.length"
            class="story-container">
            <div class="header">
                Stories
            </div>
            <Accordion
                multiple
                lazy
                v-model:value="activeValues"
                @update:value="onTabChange">
                <AccordionPanel
                    v-for="(story, index) in cat.stories"
                    :key="story.title"
                    :value="index">
                    <AccordionHeader>
                        {{ story.title }}
                    </AccordionHeader>
                    <AccordionContent>
                        <div v-if="story.loaded">
                            <FormattedText
                                class="story-content"
                                :content="story.content || 'No content available.'" />
                        </div>
                        <div v-else>
                            <ProgressSpinner style="width: 50px; height: 50px" />
                        </div>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>
    </section>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import { Cat } from '@/models/cat.model';
import Menu from 'primevue/menu';
import { useToast } from "primevue/usetoast";
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import ProgressSpinner from 'primevue/progressspinner';
import FormattedText from '@/components/formatted-text/formatted-text.vue';

const { cat, isMobile } = defineProps<{
    cat: Cat;
    isMobile?: boolean;
}>();

const toast = useToast();

const menu = useTemplateRef('menu');
const items = ref([
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

const activeValues = ref<number[]>([]);

const toggle = (event: Event) => {
    menu.value?.toggle(event);
};

const onTabChange = async (value: string | string[] | number[] | null | undefined) => {
    if (!value || !cat.stories) {
        return;
    }

    const values = (Array.isArray(value) ? value : [value]).map(Number);

    // Loop over every active index in the array
    for (const index of values) {
        const story = cat.stories[index];

        // Only fetch if the story exists and hasn't been loaded/isn't loading
        if (story && !story.loaded) {
            try {
                const response = await fetch(story.path);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                
                const text = await response.text();
                story.content = text;
                story.loaded = true;
            } catch (error) {
                story.content = "Error loading story content.";
            } finally {
                story.loaded = true;
            }
        }
    }
};


</script>