<style lang="scss" scoped src="./scramble-text.scss"></style>

<template>
    <span ref="scrambleRef" :key="cycle"/>
</template>

<script setup lang="ts">
import { RedactionStyle } from '@/models/redaction-style.enum';
import { useScramble } from '@scrambl/vue';
import { randomChar } from '@scrambl/core';
import { ref, watch } from 'vue';

const {
    style = RedactionStyle.Numbers,
    length = 6
} = defineProps<{
    style?: RedactionStyle;
    length?: number;
}>();

const cycle = ref(0);

function nextText() {
    if (style === RedactionStyle.Box) {
        return '█'.repeat(length);
    }

    return Array.from({length}, () => randomChar('ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&@$!?', Math.random)).join('');
}

const { ref: scrambleRef, replay } = useScramble({
    from: 'random',
    chars: 'blocks',
    duration: 1500,
    renderMode: 'cells',
    override: '',
    playOnMount: false,
    onComplete: () => {
        setTimeout(() => cycle.value++, 2500);
    }
});

watch(scrambleRef, (node) => {
    if (!node) {
        return;
    }

    node.textContent = nextText();
    replay();
}, { immediate: true });
</script>