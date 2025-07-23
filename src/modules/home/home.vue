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
                                    262
                                </div>
                                <div class="hero-stat-item-value">
                                    Active Units
                                </div>
                            </div>
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
                    <template #header>
                        <div class="logo-container">
                            <img :src="Aerocat" class="cat-logo aerocat"/>
                            <div class="cat-type">AEROCATS</div>
                        </div>
                    </template>
                    <template #content>
                        <p>CATS developed and modified based on aircraft. They first emerged after the collapse of ISEA, as existing flight-type CATS were reconfigured into new forms. Today, they’ve become so diverse that many are now released as complete, standalone units rather than conversions.</p>
                        <Message severity="info">
                            Inspired by aircraft, AEROCATS are capable of performing a wide range of tasks, from military operations to civilian aviation roles.
                        </Message>
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
                    <template #header>
                        <div class="logo-container">
                            <img :src="Landcat" class="cat-logo landcat"/>
                            <div class="cat-type">LANDCATS</div>
                        </div>
                    </template>
                    <template #content>
                        <p>CATS developed and modified based on military and civilian ground vehicles. They first emerged after the collapse of ISEA, created by reconfiguring existing ground-type CATS. Today, they’ve evolved into a wide variety of models, many of which are now released as complete, standalone units rather than modified versions.</p>
                        <Message severity="success">
                            Inspired by wheeled and tracked ground vehicles, LANDCATS operate across both military and civilian service roles.
                        </Message>
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
                    <template #header>
                        <div class="logo-container">
                            <div class="cat-type">PROTOS</div>
                        </div>
                    </template>
                    <template #content>
                        <p>Proto text here</p>
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
import Message from 'primevue/message';
import { RouteNames } from '@/app.routes';
import { CatFilter } from '@/models/cat-filter.enum';
</script>