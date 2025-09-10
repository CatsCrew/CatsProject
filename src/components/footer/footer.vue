<style lang="scss" scoped src="./footer.scss"></style>

<template>
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <h5 class="footer-header">QUICK ACCESS</h5>
                <div class="quick-links">
                    <router-link :to="{ name: RouteNames.Home }">Home</router-link>
                    <router-link :to="{ name: RouteNames.About }">About</router-link>
                    <router-link :to="{ name: RouteNames.SpeciesSheet }">Species Sheet</router-link>
                    <router-link :to="{ name: RouteNames.Lore }">Lore</router-link>
                </div>
            </div>
            <div class="footer-section">
                <h5 class="footer-header">SYSTEM INFO</h5>
                <div class="footer-text">
                    <div class="sub-text">Last Updated: {{ formattedDate }}</div>
                    <div class="sub-text">System Version: {{ version }}</div>
                    <div class="sub-text">Made by: Zephyr</div>
                    <div class="sub-text">Design: MeFinity</div>
                    <div class="sub-text">C.A.T.S Created by: Dr.Presto and Dr.Karbine</div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup lang="ts">
import { RouteNames } from '../../app.routes';

const updatedDate = new Date('2025-09-09');
const version = '1.0.1';

const formattedDate = new Intl.DateTimeFormat(navigator.language).format(updatedDate);
</script>