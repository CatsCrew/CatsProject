<style lang="scss" scoped src="./home.scss"></style>

<template>
    <div class="homepage-container">
        <div class="hero-container">
            <div class="hero-content">
                <div class="classification-badge">
                    <div class="status">SPECIES STATUS</div>
                    <div class="availability">SEMI-OPEN</div>
                </div>
                <h2 class="hero-title">CONTROLLED AUTONOMIC TACTICAL SYSTEMS</h2>
                <div class="hero-description">
                    <p class="hero-subtext">This species is a semi-open species! We provide all basic features such as general character creation and ownership. However, we kindly ask that you undergo age verification for R18+ content. Please use the C.A.T.S Discord for R18+ content.</p>
                    <div class="warning">This species can include a wide range of NSFW and NSFL content such as war machines, disaster relief, rubber textures, and robotics, so it is fundamentally classified as R-18+.</div>
                </div>
                <div class="hero-stats">
                    <Card>
                        <template #content>
                            <div class="hero-stat-item">
                                <div class="hero-stat-item-label">
                                    {{ cats?.length }}
                                </div>
                                <div class="hero-stat-item-value">
                                    Active Units
                                </div>
                            </div>
                        </template>
                    </Card>
                    <Card>
                        <template #title>
                            <div class="composition-title">
                                Composition
                            </div>
                        </template>
                        <template #content>
                            <MeterGroup :value="catMetergroupItems">
                                <template #label="{ value }">
                                    <ol class="markers">
                                        <li
                                            class="marker-label"
                                            v-for="meterItem in value">
                                            <span class="marker" :style="{ 'background-color': meterItem.color }"></span>
                                            <span>{{ meterItem.label }}</span>
                                        </li>
                                    </ol>
                                </template>
                            </MeterGroup>
                        </template>
                    </Card>
                </div>
            </div>
            <div class="hero-visual">
                <Radar></Radar>
            </div>
        </div>
        <div class="species-overview">
            <div class="species-header">
                <h3 class="header-text">SPECIES CLASSIFICATIONS</h3>
                <div class="divider"></div>
            </div>
            <div class="species-grid">
                <Card>
                    <template #title>
                        <div class="logo-container">
                            <img :src="Aerocat" class="cat-logo aerocat"/>
                            <div class="cat-type">AEROCATS</div>
                        </div>
                    </template>
                    <template #content>
                        <p>CATS developed and modified based on aircraft. They first emerged after the collapse of ISEA, as existing flight-type CATS were reconfigured into new forms. Today, they’ve become so diverse that many are now released as complete, standalone units rather than conversions.</p>
                        <Banner :type="BannerType.Info">
                            Inspired by aircraft, AEROCATS are capable of performing a wide range of tasks, from military operations to civilian aviation roles.
                        </Banner>
                    </template>
                    <template #footer>
                        <button class="gradient-btn">
                            <router-link :to="{ name: RouteNames.Characters, query: { t: CatFilter.Aerocats } }">
                                Access Database <i class="pi pi-icon pi-arrow-right"></i>
                            </router-link>
                        </button>
                    </template>
                </Card>
                <Card>
                    <template #title>
                        <div class="logo-container">
                            <img :src="Landcat" class="cat-logo landcat"/>
                            <div class="cat-type">LANDCATS</div>
                        </div>
                    </template>
                    <template #content>
                        <p>CATS developed and modified based on military and civilian ground vehicles. They first emerged after the collapse of ISEA, created by reconfiguring existing ground-type CATS. Today, they’ve evolved into a wide variety of models, many of which are now released as complete, standalone units rather than modified versions.</p>
                        <Banner :type="BannerType.Success">
                            Inspired by wheeled and tracked ground vehicles, LANDCATS operate across both military and civilian service roles.
                        </Banner>
                    </template>
                    <template #footer>
                        <button class="gradient-btn">
                            <router-link :to="{ name: RouteNames.Characters, query: { t: CatFilter.Landcats } }">
                                Access Database <i class="pi pi-icon pi-arrow-right"></i>
                            </router-link>
                        </button>
                    </template>
                </Card>
                <Card>
                    <template #title>
                        <div class="logo-container">
                            <img :src="Proto" class="cat-logo proto"/>
                            <div class="cat-type">PROTOS</div>
                        </div>
                    </template>
                    <template #content>
                        <p>PROTOs were developed before the CATS and served as the foundation for many of their technologies. In the world's setting, they function as support robots. They are a sub-species, not a main species.</p>
                    </template>
                    <template #footer>
                        <button class="gradient-btn">
                            <router-link :to="{ name: RouteNames.Characters, query: { t: CatFilter.Protos } }">
                                Access Database <i class="pi pi-icon pi-arrow-right"></i>
                            </router-link>
                        </button>
                    </template>
                </Card>
                <Card>

                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Radar from '@/components/radar/radar.vue';
import Card from '@/components/card/card.vue';
import Aerocat from '@assets/images/aerocats_logo.png';
import Landcat from '@assets/images/landcats_logo.png';
import Proto from '@assets/images/proto_logo.png';
import { RouteNames } from '@/app.routes';
import { CatFilter } from '@/models/cat-filter.enum';
import Banner from '@/components/banner/banner.vue';
import { BannerType } from '@/models/banner-type.enum';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import MeterGroup, { MeterItem } from 'primevue/metergroup';

const cat$ = useCatsStore();
const { cats, aerocats, landcats, protos } = $(storeToRefs(cat$));

const catMetergroupItems = $computed<MeterItem[]>(() => {
    const meterItems: MeterItem[] = [];

    const totalCats = cats?.length ?? 1;

    meterItems.push({
        label: 'Aerocats',
        value: Math.floor(aerocats?.length / totalCats * 100) ?? 0,
        color: '#00aaff'
    });

    meterItems.push({
        label: 'Landcats',
        value: Math.floor(landcats?.length / totalCats * 100) ?? 0,
        color: '#ff8800'
    });

    meterItems.push({
        label: 'Protos',
        value: Math.floor(protos?.length / totalCats * 100) ?? 0,
        color: '#00ff88'
    });

    return meterItems;
});
</script>