<style lang="scss" scoped src="./protos.scss"></style>

<template>
    <div class="characters-container">
        <div class="characters-header">
            <span class="characters-header-title">Lab</span>
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText type="text" v-model="searchTerms[CatType.Proto]" placeholder="Search" />
            </IconField>
        </div>
        <div
            class="characters"
            :class="{ 'empty': searchResultsEmpty }">
            <CharacterCard
                v-for="cat in pagedCats"
                :key="cat.name"
                :cat="cat"
                :hoverable="!isHandheldDevice">
            </CharacterCard>
            <CharacterCard
                v-if="!searchTerm && pagedCats.length === filteredCats.length"
                :cat="placeholderCat"
                :hoverable="false"
                :is-placeholder="true">
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
import { defineAsyncComponent, computed, watch, onMounted, onUnmounted } from 'vue';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import CharacterCard from '../../components/character-card/character-card.vue';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import { Cat } from '@/models/cat.model';
import ProtoPlaceholder from '@assets/images/proto_placeholder.png';
import ProtoWhat from '@assets/images/proto-what.png';
import { CatType } from '@/models/cat-type.enum';

const EmptyState = defineAsyncComponent(() => import('@/components/empty-state/empty-state.vue'));

const cats$ = useCatsStore();
const { protos, searchTerms } = $(storeToRefs(cats$));

const isHandheldDevice = computed(() => "ontouchstart" in window || navigator.maxTouchPoints > 0);
const PAGE_SIZE = 24;
const searchTerm = $computed(() => searchTerms[CatType.Proto]);
let currentPage = $ref(1);

const placeholderCat = $computed<Cat>(() => ({
    model: `Your Proto here!`,
    galleryUrls: [ProtoPlaceholder]
}));

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

const pagedCats = computed(() => filteredCats.slice(0, currentPage * PAGE_SIZE));
const searchResultsEmpty = computed(() => filteredCats.length === 0 && searchTerm.length > 0);

function onScroll() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;

    // Check if the user has scrolled near the bottom (e.g., within 200px)
    if (scrollTop + clientHeight >= scrollHeight - 200) {
        currentPage++;
    }
}

watch(() => searchTerm, () => {
    currentPage = 1;
});

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});

</script>