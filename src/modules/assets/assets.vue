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
        <Banner :type="BannerType.Info">
            <div class="asset-banner">
                Interested in seeing other assets available? Check out the <a class="asset-studio" href="https://discord.com/channels/1326595987749470299/1384102985998794823" target="_blank">#asset-studio</a>discord channel for more!
            </div>
        </Banner>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { CatType } from '@/models/cat-type.enum';
import SelectButton from 'primevue/selectbutton';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import Banner from '@/components/banner/banner.vue';
import { BannerType } from '@/models/banner-type.enum';

const cat$ = useCatsStore();
const { assets } = $(storeToRefs(cat$));

const router$ = useRouter();
const route$ = useRoute();

const catOptions = $ref([CatType.Aerocat, CatType.Landcat, CatType.Proto]);

let catType = $ref(CatType.Aerocat);
let assetImageUrls = $ref([]);

function updateRouteQuery() {
    router$.replace({
        query: {
            c: catType
        }
    });
}

function onCatTypeSelected() {
    assetImageUrls = assets[catType];
    updateRouteQuery();
}

onMounted(() => {
    const validCatTypes = Object.values(CatType);

    const queryCat = route$.query.c;
    if (validCatTypes.includes(queryCat as CatType)) {
        catType = queryCat as CatType;
    }

    assetImageUrls = assets[catType];
});
</script>