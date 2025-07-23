<style lang="scss" scoped src="./about.scss"></style>

<template>
    <div class="about-the-species-container">
        <div class="about-content">
            <div class="about-cats">
                <Card>
                    <template #header>
                        SEMI-OPEN SPECIES
                    </template>
                    <template #content>
                        This species is a semi-open species! We provide all basic features such as general character creation and ownership. However, we kindly ask that you undergo age verification for R18+ content. Please use the C.A.T.S Discord for R18+ content.
                    </template>
                </Card>
                <Card>
                    <template #header>
                        C.A.T.S
                    </template>
                    <template #content>
                        <div class="header">What are CATS?</div>
                        <p>Within the world setting, CATS are a core species. Originally designed by a research organization called ISEA, they have undergone continuous upgrades and improvements, eventually being deployed across various nations as combat, rescue, and service units.</p>
                        <p>Though initially created as military robots, they gradually evolved into standalone AIs with independent identities, thanks to a unique fluid known as PDG (Padding Goo), a substance akin to their blood. Through major events and incidents within the universe, CATS have grown so prominent that they are now recognized as a distinct species in their own right.</p>
                    </template>
                </Card>
            </div>
            <div class="about-creators">
                <Card>
                    <template #header>
                        Species Creators
                    </template>
                    <template #content>
                        <div class="creators-grid">
                            <div class="creator">
                                <div class="creator-avatar">
                                    <img :src="Presto" class="creator-img"/>
                                </div>
                                <div class="creator-info">
                                    <div class="title">Species Owner</div>
                                    <div>Dr. Presto</div>
                                </div>
                            </div>
                            <div class="creator">
                                <div class="creator-avatar">
                                    <img :src="Karbine" class="creator-img"/>
                                </div>
                                <div class="creator-info">
                                    <div class="title">Species Owner</div>
                                    <div>Dr. Karbine</div>
                                </div>
                            </div>
                        </div>
                        <div class="discord-container">
                            <div class="discord">
                                <button>
                                    <i class="pi pi-icon pi-discord"></i><a :href="discordUrl">Join C.A.T.S Discord</a>
                                </button>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Presto from '@assets/images/creators/presto.png';
import Karbine from '@assets/images/creators/karbine.png';
import Card from '@/components/card/card.vue';

const discordUrl = $ref('https://discord.gg/xYm6skrZ3b');
</script>