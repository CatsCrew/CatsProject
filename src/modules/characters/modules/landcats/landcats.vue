<style lang="scss" scoped src="./landcats.scss"></style>

<template>
    <div class="characters-container">
        <div class="characters-header">
            <span class="characters-header-title">Garage</span>
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText type="text" v-model="searchTerm" placeholder="Search" />
            </IconField>
        </div>
        <div
            class="characters"
            :class="{ 'empty': searchResultsEmpty }">
            <CharacterCard
                v-for="cat in filteredCats"
                :key="cat.name"
                :cat="cat"
                :hoverable="!isHandheldDevice">
            </CharacterCard>
            <CharacterCard
                v-if="!searchTerm"
                :cat="placeholderCat"
                :hoverable="false">
            </CharacterCard>
            <EmptyState
                v-if="searchResultsEmpty"
                :image="ProtoWhat"
                title="No Results Found!">
            </EmptyState>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import CharacterCard from '../../components/character-card/character-card.vue';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import { Cat } from '@/models/cat.model';
import LandcatPlaceholder from '@assets/images/landcat_placeholder.png';
import ProtoWhat from '@assets/images/proto-what.png';

const EmptyState = defineAsyncComponent(() => import('@/components/empty-state/empty-state.vue'));

let searchTerm = $ref<string>('');

const cats$ = useCatsStore();
const { landcats } = $(storeToRefs(cats$));

const isHandheldDevice = $computed(() => "ontouchstart" in window || navigator.maxTouchPoints > 0);
const searchResultsEmpty = $computed(() => filteredCats?.length === 0 && searchTerm?.length > 0);

const placeholderCat = $computed<Cat>(() => {
    return {
        model: `Your Landcat here!`,
        galleryUrls: [LandcatPlaceholder]
    };
});

const filteredCats = $computed(() => {
    if (!searchTerm) {
        return landcats;
    }

    const formattedSearchTerm = searchTerm.toLowerCase().trim();

    return landcats.filter((cat) => 
        cat.name.toLowerCase().includes(formattedSearchTerm) ||
        cat.model.toLowerCase().includes(formattedSearchTerm) || 
        cat.creator.name.toLowerCase().includes(formattedSearchTerm)
    );
});
</script>