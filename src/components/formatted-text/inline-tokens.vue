<style lang="scss" scoped src="./inline-tokens.scss"></style>

<template>
    <template
        v-for="(token, index) in resolvedTokens"
        :key="index">
        <router-link
            v-if="token.linkId"
            class="cat-link"
            :class="token.marks"
            :to="{ name: RouteNames.Character, params: { id: token.linkId } }">{{ token.text }}</router-link>
        <span
            v-else
            :class="token.marks">{{ token.text }}</span>
    </template>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { InlineToken } from '@/helper/story-format.helper';
import { RouteNames } from '@/app.routes';
import { useCatsStore } from '@/store';

const { tokens } = defineProps<{
    tokens: InlineToken[];
}>();

const store = useCatsStore();

// A name that matches no cat - or more than one - falls back to plain text
// rather than a dead or wrong link.
const resolvedTokens = computed(() => tokens.map(token => {
    const cat = token.catId
        ? store.catById(token.catId)
        : token.catName ? store.catByName(token.catName, token.catType) : undefined;

    return {
        ...token,
        text: token.text || cat?.name || token.catName || '',
        linkId: cat?.id
    };
}));
</script>
