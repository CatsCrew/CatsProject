<style lang="scss" scoped src="./aerocats.scss"></style>

<template>
    <div class="characters-container">
        <div class="characters-header">
            <span class="characters-header-title">Hangar</span>
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText type="text" v-model="searchTerm" placeholder="Search" />
            </IconField>
        </div>
        <div class="characters">
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
        </div>
    </div>
</template>

<script setup lang="ts">
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import CharacterCard from '../../components/character-card/character-card.vue';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import { Cat } from '@/models/cat.model';
import AerocatPlaceholder from '@assets/images/aerocat_placeholder.png';

let searchTerm = $ref<string>('');

const cats$ = useCatsStore();
const { aerocats } = $(storeToRefs(cats$));

const isHandheldDevice = $computed(() => "ontouchstart" in window || navigator.maxTouchPoints > 0);

const placeholderCat = $computed<Cat>(() => {
    return {
        model: `Your Aerocat here!`,
        galleryUrls: [AerocatPlaceholder]
    };
});

const filteredCats = $computed(() => {
    if (!searchTerm) {
        return aerocats;
    }

    const formattedSearchTerm = searchTerm.toLowerCase().trim();

    return aerocats.filter((cat) => 
        cat.name.toLowerCase().includes(formattedSearchTerm) ||
        cat.model.toLowerCase().includes(formattedSearchTerm) || 
        cat.creator.name.toLowerCase().includes(formattedSearchTerm)
    );
});

</script>