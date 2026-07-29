<style lang="scss" scoped src="./formatted-text.scss"></style>

<template>
    <div class="formatted-text">
        <template
            v-for="(block, index) in blocks"
            :key="index">
            <hr
                v-if="block.type === 'divider'"
                class="divider" />
            <div
                v-else-if="block.type === 'heading'"
                class="block-heading"
                :class="`level-${block.level}`">
                <InlineTokens :tokens="block.tokens" />
            </div>
            <blockquote
                v-else-if="block.type === 'quote'"
                class="quote">
                <InlineTokens :tokens="block.tokens" />
            </blockquote>
            <p
                v-else
                class="paragraph">
                <InlineTokens :tokens="block.tokens" />
            </p>
        </template>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { parseStory } from '@/helper/story-format.helper';
import InlineTokens from './inline-tokens.vue';

const { content } = defineProps<{
    content?: string;
}>();

const blocks = computed(() => parseStory(content ?? ''));
</script>
