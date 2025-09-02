<style lang="scss" scoped src="./aerocat.scss"></style>

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
import { Aerocat } from '@/models/aerocat.model';

const { cat, isMobile } = defineProps<{
    cat: Aerocat;
    isMobile?: boolean;
}>();

const kpiItems = $computed(() => {
    const kpis: Option[] = [];

    if (cat.copilot) {
        kpis.push({
            label: 'Copilot',
            value: cat.copilot
        });
    }

    if (cat.faction) {
        kpis.push({
            label: 'Faction',
            value: cat.faction
        });
    }

    return kpis;
});
</script>