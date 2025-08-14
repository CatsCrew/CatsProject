<style lang="scss" scoped src="./assets.scss"></style>

<template>
    <div class="assets-container">
        <div class="selection-container">
            <div class="select-item">
                <div class="select-header">Species</div>
                <SelectButton
                    v-model="catType"
                    :options="catOptions"
                    @change="onCatTypeSelected"/>
            </div>
        </div>
        <div class="asset-content-container">
            <a
                v-for="asset in assetImageUrls"
                :key="asset"
                :href="asset"
                class="asset-img"
                download>
                <img :src="asset"></img>
                <div class="asset-overlay">
                    <i class="pi pi-icon pi-download"></i>
                </div>
            </a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { CatType } from '@/models/cat-type.enum';
import SelectButton from 'primevue/selectbutton';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';

const cat$ = useCatsStore();
const { assets } = $(storeToRefs(cat$));

const catType = $ref(CatType.Aerocat);
const catOptions = $ref([CatType.Aerocat, CatType.Landcat, CatType.Proto]);

let assetImageUrls = $ref([]);

function onCatTypeSelected() {
    assetImageUrls = assets[catType];
}

onMounted(() => {
    assetImageUrls = assets[catType];
});
</script>