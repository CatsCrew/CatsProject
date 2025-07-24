<style lang="scss" scoped src="./about.scss"></style>

<template>
    <div class="about-the-species-container">
        <div class="about-content">
            <div class="about-cats">
                <Card>
                    <template #title>
                        <div class="about-card-header">SEMI-OPEN SPECIES</div>
                    </template>
                    <template #content>
                        <p>This species is a semi-open species! We provide all basic features such as general character creation and ownership. However, we kindly ask that you undergo age verification for R18+ content. Please use the C.A.T.S Discord for R18+ content.</p>
                        <Banner :type="BannerType.Error">
                            <p>This species can include a wide range of NSFW and NSFL content such as war machines, disaster relief, rubber textures, and robotics, so it is fundamentally classified as R-18+.</p>
                        </Banner>
                    </template>
                </Card>
                <Card>
                    <template #title>
                        <div class="about-card-header">C.A.T.S</div>
                    </template>
                    <template #content>
                        <div class="header">What are CATS?</div>
                        <p>Within the world setting, CATS are a core species. Originally designed by a research organization called ISEA, they have undergone continuous upgrades and improvements, eventually being deployed across various nations as combat, rescue, and service units.</p>
                        <p>Though initially created as military robots, they gradually evolved into standalone AIs with independent identities, thanks to a unique fluid known as PDG (Padding Goo), a substance akin to their blood. Through major events and incidents within the universe, CATS have grown so prominent that they are now recognized as a distinct species in their own right.</p>
                        <Banner :type="BannerType.Warning">
                            <p>The website serves as an archive. While the creation of CATS characters is open and free, please note that registration on the website is subject to review, only characters that accurately reflect the traits of the species will be approved.</p>
                        </Banner>
                    </template>
                </Card>
            </div>
            <div class="about-creators">
                <Card>
                    <template #title>
                        <div class="header">Species Creators</div>
                    </template>
                    <template #content>
                        <div class="about-creator-content">
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
                            <div class="divider"></div>
                            <div class="discord-container">
                                <div class="discord">
                                    <div class="header">Discord</div>
                                    <p class="sub-text">The Discord server is a space for archive access, light community interaction, and information sharing! Please make sure to read the rules when you join!</p>
                                    <a class="discord-btn" :href="discordUrl">
                                        <i class="pi pi-icon pi-discord"></i>Join C.A.T.S discord
                                    </a>
                                </div>
                                <div class="discord-contacts-container">
                                    <p>Contact Information for website registration and updates</p>
                                    <div class="discord-contacts">
                                        <div class="discord-contact"><i class="pi pi-icon pi-discord"></i>dr.presto</div>
                                        <div class="discord-contact"><i class="pi pi-icon pi-discord"></i>karbine16</div>
                                    </div>
                                </div>
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
import Banner from '@/components/banner/banner.vue';
import { BannerType } from '@/models/banner-type.enum';

const discordUrl = $ref('https://discord.gg/xYm6skrZ3b');
</script>