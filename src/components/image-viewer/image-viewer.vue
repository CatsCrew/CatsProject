<style lang="scss" scoped src="./image-viewer.scss"></style>

<template>
    <div class="image-container">
        <img
            class="viewer-image"
            :src="src"
            :alt="alt"
            ref="image"/>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, watch, nextTick } from 'vue';
import Viewer from 'viewerjs';

const { src, alt, caption } = defineProps<{
    src: string;
    alt: string;
    caption?: string;
}>();

const emit = defineEmits<{
    (e: 'close'): void;
}>();

const image = useTemplateRef('image');
let viewerInstance: Viewer | null = null;

function cleanupViewer() {
    if (viewerInstance) {
        viewerInstance.destroy();
        viewerInstance = null;
    }
}

function initializeViewer(transition: boolean = true) {
    cleanupViewer();

    const toolBarShow: Viewer.ToolbarOption = { show: true, size: 'large' };

    if (image.value) {
        viewerInstance = new Viewer(image.value, {
            inline: false,
            className: 'cat-image-viewer',
            transition,
            movable: true,
            zoomable: true,
            title: caption ? () => caption : false,
            toolbar: {
                zoomIn: toolBarShow,
                zoomOut: toolBarShow,
                oneToOne: toolBarShow,
                reset: toolBarShow
            },
            hidden: function() {
                emit('close');
            },
        });

        viewerInstance.show();
    }
}

onMounted(() => {
  initializeViewer();
});

onUnmounted(() => {
    cleanupViewer();
});

watch(
  () => src,
  () => {
    nextTick(() => {
        initializeViewer(false);
    });
  },
);
</script>