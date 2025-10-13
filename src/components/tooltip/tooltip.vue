<style lang="scss" src="./tooltip.scss"></style>

<template>
    <div
        class="tooltip-container"
        v-tooltip.top="tooltipConfig"
        :v-tooltip.focus="!isHandheldDevice"
        @click.stop.prevent="onClick">
        <slot></slot>
        <Drawer
            v-if="isHandheldDevice"
            v-model:visible="showTooltipModal"
            position="bottom"
            header="Warning">
            {{ tooltipText }}
        </Drawer>
    </div>
</template>

<script setup lang="ts">
import { TooltipOptions } from 'primevue/tooltip';
import Drawer from 'primevue/drawer';

const { tooltipText } = defineProps<{
    tooltipText?: string;
}>();

const isHandheldDevice = $computed(() => "ontouchstart" in window || navigator.maxTouchPoints > 0);
let showTooltipModal = $ref(false);

const tooltipConfig: TooltipOptions = {
    value: tooltipText,
    autoHide: false,
    class: 'custom-tooltip'
};

function onClick() {
    if (isHandheldDevice) {
        showTooltipModal = !showTooltipModal;
    }
}
</script>