<style lang="scss" scoped src="./landcats.scss"></style>

<template>
    <div class="characters-container">
        <div class="characters-header">
            <span class="characters-header-title">Garage</span>
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText type="text" v-model="searchTerms[CatType.Landcat]" placeholder="Search" />
            </IconField>
        </div>
        <div
            class="characters"
            :class="{ 'empty': searchResultsEmpty }">
            <CharacterCard
                v-for="filteredCat in pagedCats"
                :key="filteredCat.cat.name"
                :cat="filteredCat.cat"
                :hoverable="!isHandheldDevice">
                <template
                    v-if="filteredCat.cat.outdated"
                    #overlay-content>
                    <Tooltip :tooltip-text="tooltipText">
                        <div
                            class="outdated-warning">
                            <img
                                class="outdated-img" 
                                :src="OutdatedLandcatLogo"/>
                        </div>
                    </Tooltip>
                </template>
                <template 
                    v-if="filteredCat.matchType"
                    #pills>
                    <Badge severity="secondary">{{ filteredCat.matchType.toProperCase() }} match</Badge>
                </template>
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
import Badge from 'primevue/badge';
import CharacterCard from '../../components/character-card/character-card.vue';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import { Cat } from '@/models/cat.model';
import LandcatPlaceholder from '@assets/images/landcat_placeholder.png';
import ProtoWhat from '@assets/images/proto-what.png';
import { CatType } from '@/models/cat-type.enum';
import OutdatedLandcatLogo from '@assets/images/outdated_logo_lc.webp';
import { FilteredCat } from '@/models/filtered-cat.model';
import { MatchType } from '@/models/match-type.enum';

const EmptyState = defineAsyncComponent(() => import('@/components/empty-state/empty-state.vue'));
const Tooltip = defineAsyncComponent(() => import('@/components/tooltip/tooltip.vue'));

const cats$ = useCatsStore();
const { landcats, searchTerms, pageRecord } = $(storeToRefs(cats$));

const isHandheldDevice = computed(() => "ontouchstart" in window || navigator.maxTouchPoints > 0);
const PAGE_SIZE = 24;
const searchTerm = $computed(() => searchTerms[CatType.Landcat]);

const tooltipText = 'This character was made under the old registration standards, and may not reflect our current rules.';

const placeholderCat = $computed<Cat>(() => ({
    model: `Your Landcat here!`,
    thumbnail: LandcatPlaceholder
}));

const filteredCats = $computed<FilteredCat[]>(() => {
    if (!searchTerm) {
        return landcats.map(cat => {
            return {
                cat
            } as FilteredCat;
        });
    }

    const formattedSearchTerm = searchTerm.toLowerCase().trim();

    return landcats.map(cat => {
        let matchType = MatchType.Unknown;
        if (cat?.name?.toLowerCase()?.includes(formattedSearchTerm)) {
            matchType = MatchType.Name;
        } else if (cat?.model?.toLowerCase()?.includes(formattedSearchTerm)) {
            matchType = MatchType.Model;
        } else if (cat?.creator?.name?.toLowerCase()?.includes(formattedSearchTerm)) {
            matchType = MatchType.Creator;
        } else if (cat?.faction?.toLowerCase()?.includes(formattedSearchTerm)) {
            matchType = MatchType.Faction;
        }

        return {
            cat,
            matchType
        } as FilteredCat;
    }).filter(filtered => filtered.matchType !== MatchType.Unknown);
});

const pagedCats = computed(() => filteredCats.slice(0, pageRecord[CatType.Landcat] * PAGE_SIZE));
const searchResultsEmpty = computed(() => filteredCats.length === 0 && searchTerm?.length > 0);

function onScroll() {
  const scrollHeight = document.documentElement.scrollHeight;
  const scrollTop = document.documentElement.scrollTop;
  const clientHeight = document.documentElement.clientHeight;
  const maxPage = Math.max(1, Math.ceil(filteredCats.length / PAGE_SIZE));

    // Check if the user has scrolled near the bottom (e.g., within 200px)
    if (scrollTop + clientHeight >= scrollHeight - 200 && pageRecord[CatType.Landcat] < maxPage) {
        pageRecord[CatType.Landcat]++;
    }
}

watch(() => searchTerm, () => {
    pageRecord[CatType.Landcat] = 1;
});

onMounted(() => {
  window.addEventListener('scroll', onScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});

</script>