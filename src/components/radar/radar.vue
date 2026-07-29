<style lang="scss" scoped src="./radar.scss"></style>

<template>
    <div class="radar-container">
        <div class="radar-screen">
            <div
                class="radar-sweep"
                :style="{ transform: 'translateY(-100%) rotate(' + sweepAngle + 'deg)' }">
            </div>
            <div class="radar-grid"></div>
            <div
                v-for="blip in blips"
                :key="blip.id"
                :class="['radar-blip', blip.type, { 
                    detected: blip.isCurrentlyVisible,
                    'fade-out': !blip.isCurrentlyVisible && blip.lastDetectedTime > 0
                }]"
                :style="{ 
                    top: blip.y + '%',
                    left: blip.x + '%'
                }">
            </div>
            </div>
            <div class="radar-info">
                <div class="radar-info-content">
                    <div class="info-line">
                        <span class="info-label">AIRSPACE:</span>
                        <span class="info-value">SECURE</span>
                    </div>
                    <div class="info-line">
                        <span class="info-label">GROUND:</span>
                        <span class="info-value">PATROLLED</span>
                    </div>
                </div>
                <div class="radar-proto">
                    <img
                        class="radar-proto-img"
                        :src="RadarProto"
                        alt="radar proto"/>
                </div>
            </div>
        </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount } from "vue";
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import RadarProto from '@/assets/images/radar-proto.webp';

const cat$ = useCatsStore();
const { aerocats, landcats, protos } = storeToRefs(cat$);

const aerocatsCount = aerocats.value.length;
const landcatsCount = landcats.value.length;
const protosCount = protos.value.length;

const sweepAngle = ref(0); // Current angle of the sweep in degrees
const sweepSpeed = 0.5; // Degrees per frame (adjust for speed)
const detectionRange = 15; // Degrees: how wide the sweep detection "cone" is
const lingerDuration = 1000; // Milliseconds: how long blips stay visible after being hit by sweep
const minBlips = 3; // Minimum amount of blips at once
const maxBlips = 8; // Maximum amount of blips at once
const blipTypes = ['aerocat', 'landcat', 'proto'];
const regenerationInterval = 8000; // How often blips generate
const minDistanceFromCenter = 15; // Minimum distance from center%
const maxDistanceFromCenter = 45; // Maximum distance from center%
const blipLifetime = 12000; // How long a blip lives before i take them out
const fadeOutDuration = 2000; // How long fade-out takes

const animationFrameId = ref(null);
const regenerationTimerId = ref(null);

const blips = reactive([]);

// Choose a blip type proportionally to the available counts
const getTypeFromCounts = () => {
    const counts = [
        aerocatsCount,
        landcatsCount,
        protosCount
    ];

    const total = counts.reduce((s, c) => s + c, 0);
    if (total === 0) {
        return blipTypes[Math.floor(Math.random() * blipTypes.length)];
    }
    
    let r = Math.random() * total;
    for (let i = 0; i < counts.length; i++) {
        if (r < counts[i]) {
            return blipTypes[i];
        }
        r -= counts[i];
    }
    return blipTypes[blipTypes.length - 1];
};

const generateRandomBlips = () => {
    const currentTime = performance.now();
    
    for (let i = blips.length - 1; i >= 0; i--) {
        const blip = blips[i];
        if (currentTime - blip.birthTime > blipLifetime) {
            blips.splice(i, 1);
        }
    }
    
    const targetCount = Math.floor(Math.random() * (maxBlips - minBlips + 1)) + minBlips;
    const currentCount = blips.length;
    const blipsToAdd = Math.max(0, targetCount - currentCount);
    
    for (let i = 0; i < blipsToAdd; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * (maxDistanceFromCenter - minDistanceFromCenter) + minDistanceFromCenter;
        const x = 50 + distance * Math.cos(angle);
        const y = 50 + distance * Math.sin(angle);
        const type = getTypeFromCounts();
        
        blips.push({
            id: `blip-${Date.now()}-${Math.random()}`,
            type: type,
            x: Math.max(5, Math.min(95, x)),
            y: Math.max(5, Math.min(95, y)),
            isCurrentlyVisible: false,
            wasHitBySweep: false,
            lastDetectedTime: 0,
            birthTime: currentTime,
            isExpiring: false
        });
    }
};

const generateInitialBlips = () => {
    const currentTime = performance.now();
    const blipCount = Math.floor(Math.random() * (maxBlips - minBlips + 1)) + minBlips;
    
    for (let i = 0; i < blipCount; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const distance = Math.random() * (maxDistanceFromCenter - minDistanceFromCenter) + minDistanceFromCenter;
        const x = 50 + distance * Math.cos(angle);
        const y = 50 + distance * Math.sin(angle);
        const type = getTypeFromCounts();
        
        blips.push({
            id: `blip-${Date.now()}-${Math.random()}`,
            type: type,
            x: Math.max(5, Math.min(95, x)),
            y: Math.max(5, Math.min(95, y)),
            isCurrentlyVisible: false,
            wasHitBySweep: false,
            lastDetectedTime: 0,
            birthTime: currentTime,
            isExpiring: false
        });
    }
};

// --- Methods ---

const animateRadar = () => {
    const currentTime = performance.now(); // Get current high-resolution time

    // Update sweep angle
    sweepAngle.value = (sweepAngle.value + sweepSpeed) % 360;

    // Check for new intersections and update lastDetectedTime
    checkIntersections(currentTime);

    // Update visibility based on hit status and linger duration
    blips.forEach((blip) => {
        const age = currentTime - blip.birthTime;
        if (age > blipLifetime - fadeOutDuration && !blip.isExpiring) {
            blip.isExpiring = true;
        }

        if (blip.wasHitBySweep && !blip.isExpiring) {
            blip.isCurrentlyVisible = true;
        } else {
            if (blip.lastDetectedTime > 0 && 
                (currentTime - blip.lastDetectedTime > lingerDuration || blip.isExpiring)) {
                blip.isCurrentlyVisible = false;
            }
        }
    });

    animationFrameId.value = requestAnimationFrame(animateRadar);
};

const checkIntersections = (currentTime) => {
    const radarCenterX = 50; // In percentage
    const radarCenterY = 50; // In percentage

    let normalizedSweepAngle = (sweepAngle.value % 360 + 360) % 360;

    blips.forEach((blip) => {
        const blipRelX = blip.x - radarCenterX;
        const blipRelY = blip.y - radarCenterY;

        let blipAngleRad = Math.atan2(blipRelY, blipRelX);
        let blipAngleDeg = blipAngleRad * (180 / Math.PI);
        blipAngleDeg = (blipAngleDeg + 360) % 360;

        let detectionStart =
            (normalizedSweepAngle - detectionRange / 2 + 360) % 360;
        let detectionEnd = (normalizedSweepAngle + detectionRange / 2) % 360;

        let isIntersectingNow = false;
        if (detectionStart <= detectionEnd) {
            isIntersectingNow =
                blipAngleDeg >= detectionStart && blipAngleDeg <= detectionEnd;
        } else {
            isIntersectingNow =
                blipAngleDeg >= detectionStart || blipAngleDeg <= detectionEnd;
        }

        // Update blip's direct hit status and last detected time
        if (isIntersectingNow) {
            blip.wasHitBySweep = true;
            blip.lastDetectedTime = currentTime;
        } else {
            blip.wasHitBySweep = false;
        }
        // The `isCurrentlyVisible` property is handled in `animateRadar` loop
    });
};

// --- Lifecycle Hooks ---

onMounted(() => {
    generateInitialBlips();
    animationFrameId.value = requestAnimationFrame(animateRadar);
    regenerationTimerId.value = setInterval(() => {
        generateRandomBlips();
    }, regenerationInterval);
});

onBeforeUnmount(() => {
    if (animationFrameId.value) {
        cancelAnimationFrame(animationFrameId.value);
    }
    if (regenerationTimerId.value) {
        clearInterval(regenerationTimerId.value);
    }
});
</script>