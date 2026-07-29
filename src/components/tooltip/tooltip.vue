<style lang="scss" src="./tooltip.scss"></style>

<template>
    <div
        class="tooltip-container"
        v-tooltip.top.focus="tooltipConfig"
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
import { computed, ref } from 'vue';

const { tooltipText } = defineProps<{
    tooltipText?: string;
}>();

const isHandheldDevice = computed(() => "ontouchstart" in window || navigator.maxTouchPoints > 0);
const showTooltipModal = ref(false);

const tooltipConfig: TooltipOptions = {
    value: tooltipText,
    autoHide: false,
    class: 'custom-tooltip'
};

function onClick() {
    if (isHandheldDevice.value) {
        showTooltipModal.value = !showTooltipModal.value;
    }
}
</script>