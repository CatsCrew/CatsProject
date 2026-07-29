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
                                <div class="hero-stat-item-label active-units">
                                    0
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
                            <MeterGroup
                                :value="catMetergroupItems"
                                aria-label="C.A.T.S composition by species">
                                <template #label="{ value }">
                                    <ol class="markers">
                                        <li
                                            class="marker-label"
                                            v-for="meterItem in value"
                                            :key="meterItem.label">
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
                <Card class="cat-card">
                    <template #title>
                        <div class="logo-container">
                            <img :src="Aerocat" alt="Aerocat Logo" width="240" height="240" class="cat-logo aerocat"/>
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
                        <router-link class="gradient-btn" :to="{ name: RouteNames.Aerocats }">
                            Access Database <i class="pi pi-icon pi-arrow-right"></i>
                        </router-link>
                    </template>
                </Card>
                <Card class="cat-card">
                    <template #title>
                        <div class="logo-container">
                            <img :src="Landcat" alt="Landcat Logo" width="344" height="320" class="cat-logo landcat"/>
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
                        <router-link class="gradient-btn" :to="{ name: RouteNames.Landcats }">
                            Access Database <i class="pi pi-icon pi-arrow-right"></i>
                        </router-link>
                    </template>
                </Card>
                <Card class="cat-card">
                    <template #title>
                        <div class="logo-container">
                            <img :src="Proto" alt="Proto Logo" width="240" height="240" class="cat-logo proto"/>
                            <div class="cat-type">PROTOS</div>
                        </div>
                    </template>
                    <template #content>
                        <p>PROTOs were developed before the CATS and served as the foundation for many of their technologies. In the world's setting, they function as support robots. They are a sub-species, not a main species.</p>
                    </template>
                    <template #footer>
                        <router-link class="gradient-btn" :to="{ name: RouteNames.Protos }">
                            Access Database <i class="pi pi-icon pi-arrow-right"></i>
                        </router-link>
                    </template>
                </Card>
                <Card>
                    <template #title>
                        <div class="title">
                            Available Communication
                        </div>
                    </template>
                    <template #content>
                        <div class="communication-container">
                            <div class="communication-item">
                                <div class="communication-content">
                                    <div class="communication-header">
                                        <div class="communication-title">
                                            Discord Server
                                        </div>
                                        <div class="communication-subtitle">
                                            C.A.T.S
                                        </div>
                                    </div>
                                    <a class="discord-btn" :href="discordUrl" target="_blank">
                                        <i class="pi pi-icon pi-discord"></i>
                                        Join
                                    </a>
                                </div>
                                <Banner :type="BannerType.Warning">
                                    Only users 20+ will be accepted
                                </Banner>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import Radar from '@/components/radar/radar.vue';
import Card from '@/components/card/card.vue';
import Aerocat from '@assets/images/aerocats_logo.avif';
import Landcat from '@assets/images/landcats_logo.avif';
import Proto from '@assets/images/proto_logo.avif';
import { RouteNames } from '@/app.routes';
import Banner from '@/components/banner/banner.vue';
import { BannerType } from '@/models/banner-type.enum';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import MeterGroup, { MeterItem } from 'primevue/metergroup';
import { gsap } from 'gsap';

const cat$ = useCatsStore();
const { cats, aerocats, landcats, protos, discordUrl } = storeToRefs(cat$);

const catMetergroupItems = computed<MeterItem[]>(() => {
    const meterItems: MeterItem[] = [];

    const totalCats = cats.value?.length ?? 1;

    meterItems.push({
        label: 'Aerocats',
        value: aerocats.value?.length / totalCats * 100,
        color: '#00aaff'
    });

    meterItems.push({
        label: 'Landcats',
        value: landcats.value?.length / totalCats * 100,
        color: '#00ff88'
    });

    meterItems.push({
        label: 'Protos',
        value: protos.value?.length / totalCats * 100,
        color: '#C0C0C0'
    });

    return meterItems;
});

onMounted(() => {
    gsap.to('.active-units', {
        innerText: cats.value?.length,
        duration: 2,
        ease: 'power1.out',
        snap: {
            innerText: 1
        }
    });
});
</script>