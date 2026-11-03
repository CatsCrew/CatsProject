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

const BLOCKED = ['KKK', 'NGR', 'NGG', 'FGT', 'FG', 'CNT', 'FCK', 'SHT', 'SS', 'HH', '88'];

function isClean(text: string): boolean {
    const squashed = text.replace(/[^A-Z0-9]/g, '');
    return !BLOCKED.some(bad => squashed.includes(bad));
}

function generateText(): string {
    return Array.from({length}, () => randomChar('BCDFGHJKLMNPQRSTVWZ26789#%&?', Math.random)).join('');
}

function nextText(): string {
    if (style === RedactionStyle.Box) {
        return '█'.repeat(length);
    }

    let generated = generateText();
    for (let i = 0; i < 10 && !isClean(generated); i++) {
        generated = generateText();
    }

    return generated;
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