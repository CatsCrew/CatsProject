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
                :class="['radar-blip', blip.type, { detected: blip.isCurrentlyVisible }]"
                :style="{ 
                    top: blip.y + '%',
                    left: blip.x + '%',
                    opacity: blip.isCurrentlyVisible ? 1 : 0 
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
import RadarProto from '@/assets/images/radar-proto.webp';

let sweepAngle = $ref(0); // Current angle of the sweep in degrees
const sweepSpeed = 0.5; // Degrees per frame (adjust for speed)
const detectionRange = 15; // Degrees: how wide the sweep detection "cone" is
const lingerDuration = 1000; // Milliseconds: how long blips stay visible after being hit by sweep

let animationFrameId = $ref(null);

const blips = reactive([
    {
        id: 'aerocat',
        type: 'aerocat',
        x: 40,
        y: 30,
        isCurrentlyVisible: false, // Controls v-show (for actual visibility)
        wasHitBySweep: false, // Indicates if the sweep is currently over it
        lastDetectedTime: 0, // Timestamp when it was last directly hit by sweep
    },
    {
        id: 'landcat',
        type: 'landcat',
        x: 60,
        y: 20,
        isCurrentlyVisible: false,
        wasHitBySweep: false,
        lastDetectedTime: 0,
    },
    {
        id: 'proto',
        type: 'proto',
        x: 60,
        y: 70,
        isCurrentlyVisible: false,
        wasHitBySweep: false,
        lastDetectedTime: 0
    }
]);

// --- Methods ---

const animateRadar = () => {
    const currentTime = performance.now(); // Get current high-resolution time

    // Update sweep angle
    sweepAngle = (sweepAngle + sweepSpeed) % 360;

    // Check for new intersections and update lastDetectedTime
    checkIntersections(currentTime);

    // Update visibility based on hit status and linger duration
    blips.forEach((blip) => {
        if (blip.wasHitBySweep) {
            blip.isCurrentlyVisible = true; // Always visible if sweep is directly on it
        } else {
            // If not currently hit by sweep, check if linger duration has passed
            if (currentTime - blip.lastDetectedTime > lingerDuration) {
                blip.isCurrentlyVisible = false; // Set to false to trigger fade-out
            }
            // Else, remain visible due to linger effect
        }
    });

    animationFrameId = requestAnimationFrame(animateRadar);
};

const checkIntersections = (currentTime) => {
    const radarCenterX = 50; // In percentage
    const radarCenterY = 50; // In percentage

    let normalizedSweepAngle = (sweepAngle % 360 + 360) % 360;

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
    animationFrameId = requestAnimationFrame(animateRadar);
});

onBeforeUnmount(() => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }
});
</script>