<style lang="scss" scoped src="./landcat.scss"></style>

<template>
    <BaseCat
        :cat="cat"
        :is-mobile="isMobile">
        <template
            v-if="kpiItems?.length"
            #kpi>
            <div class="kpi-container">
                <div class="divider"></div>
                <div class="kpi">
                    <template
                        v-for="(item, index) in kpiItems"
                        :key="item.label">
                        <div class="kpi-item">
                            <span class="kpi-header">{{ item.label }}</span>
                            <span class="kpi-value">{{ item.value }}</span>
                        </div>
                        <div
                            v-if="index < kpiItems.length - 1"
                            class="divider vertical">
                        </div>
                    </template>
                </div>
                <div class="divider"></div>
            </div>
        </template>
    </BaseCat>
</template>

<script setup lang="ts">
import { Option } from '@/models/option.model';
import BaseCat from '../base-cat/base-cat.vue';
import { Proto } from '@/models/proto.model';

const { cat, isMobile } = defineProps<{
    cat: Proto;
    isMobile?: boolean;
}>();

const kpiItems = $computed(() => {
    const kpis: Option[] = [];

    // todo

    return kpis;
});
</script>