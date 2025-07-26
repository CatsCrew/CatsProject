<style lang="scss" scoped src="./lore.scss"></style>

<template>
    <div class="lore-container">
        <div
            v-for="loreDocument, index in loreDocuments"
            :key="index"
            class="lore-document">
            <Card>
                <template #title>
                    <div class="lore-title">
                        {{ loreDocument.title }}
                    </div>
                </template>
                <template #subtitle>
                    <div class="lore-subtitle">
                        {{ loreDocument.description }}
                    </div>
                </template>
                <template #content>
                    <div class="document-container">
                        <a
                            v-for="document in loreDocument.languages"
                            :key="document.culture"
                            class="document"
                            :href="document.url"
                            target="_blank">
                            <i class="pi pi-icon pi-file-pdf"></i>
                            <div class="culture-info">
                                <span class="culture"> {{ document.culture }} </span>
                                <span class="language"> {{ document.language }} </span>
                            </div>
                        </a>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import Card from '@/components/card/card.vue';

const cats$ = useCatsStore();
const { loreDocuments } = $(storeToRefs(cats$));
</script>