<style lang="scss" scoped src="./protos.scss"></style>

<template>
    <div class="characters-container">
        <div class="characters-header">
            <span class="characters-header-title">Lab</span>
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText type="text" v-model="searchTerm" placeholder="Search" />
            </IconField>
        </div>
        <div class="characters">
            <TransitionGroup name="cards">
                <CharacterCard
                    v-for="cat in filteredCats"
                    :key="cat.name"
                    :cat="cat"
                    :hoverable="!isHandheldDevice"
                    @cat-selected="onCatClicked">
                </CharacterCard>
                <CharacterCard
                    v-if="!searchTerm"
                    :cat="placeholderCat"
                    :hoverable="false">
                </CharacterCard>
            </TransitionGroup>
        </div>
    </div>
    <CatModal
        v-if="showModal"
        :cat="selectedCat"
        @close="onModalClosed">
    </CatModal>
</template>

<script setup lang="ts">
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import CharacterCard from '../../components/character-card/character-card.vue';
import CatModal from '../../components/character-modal/character-modal.vue';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import { Cat } from '@/models/cat.model';
import ProtoPlaceholder from '@assets/images/proto_placeholder.png';

let searchTerm = $ref<string>('');
let showModal = $ref(false);
let selectedCat = $ref<Cat>(null);

const cats$ = useCatsStore();
const { protos } = $(storeToRefs(cats$));

const isHandheldDevice = $computed(() => "ontouchstart" in window || navigator.maxTouchPoints > 0);

const placeholderCat = $computed<Cat>(() => {
    return {
        model: `Your Proto here!`,
        galleryUrls: [ProtoPlaceholder]
    };
});

const filteredCats = $computed(() => {
    if (!searchTerm) {
        return protos;
    }

    const formattedSearchTerm = searchTerm.toLowerCase().trim();

    return protos.filter((cat) => 
        cat.name.toLowerCase().includes(formattedSearchTerm) ||
        cat.model.toLowerCase().includes(formattedSearchTerm) || 
        cat.creator.name.toLowerCase().includes(formattedSearchTerm)
    );
});

function onCatClicked(cat: Cat) {
    selectedCat = cat;
    showModal = true;
}

function onModalClosed() {
    showModal = false;
}
</script>