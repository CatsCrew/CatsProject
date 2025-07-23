<style lang="scss" scoped src="./radar.scss"></style>

<template>
    <div class="radar-container">
        <div class="radar-screen">
            <div class="radar-sweep"></div>
            <div class="radar-grid"></div>
            <div class="radar-blip aerocat" style="top: 30%; left: 40%;"></div>
            <div class="radar-blip landcat" style="top: 70%; left: 60%;"></div>
        </div>
        <div class="radar-info">
            <div class="info-line">
                <span class="info-label">AIRSPACE:</span>
                <span class="info-value">SECURE</span>
            </div>
            <div class="info-line">
                <span class="info-label">GROUND:</span>
                <span class="info-value">PATROLLED</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>