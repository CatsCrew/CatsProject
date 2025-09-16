<style lang="scss" scoped src="./proto.scss"></style>

<template>
    <BaseCat
        :cat="cat"
        :is-mobile="isMobile">
        <template #model>
            <div class="model">
                Proto {{ cat.model }}
            </div>
        </template>
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
                            <RouterLink
                                v-if="item.route"
                                :to="item.route"
                                class="kpi-value">
                                {{ item.value }}
                            </RouterLink>
                            <span v-else class="kpi-value">{{ item.value }}</span>
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
import { CatType } from '@/models/cat-type.enum';
import { RouteNames } from '@/app.routes';

const { cat, isMobile } = defineProps<{
    cat: Proto;
    isMobile?: boolean;
}>();

const kpiItems = $computed(() => {
    const kpis: Option[] = [];

    if (cat.faction) {
        kpis.push({
            label: 'Faction',
            value: cat.faction
        });
    }

    if (cat.linkedCats) {
        kpis.push({
            label: 'Assigned CAT',
            value: cat.linkedCats.filter(c => c.type !== CatType.Proto).map(c => c.name).join(', '),
            route: { name: RouteNames.Character, params: { id: cat.linkedCats[0].id }}
        })
    }

    return kpis;
});
</script>