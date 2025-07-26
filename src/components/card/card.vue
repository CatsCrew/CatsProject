<style lang="scss" scoped src="./card.scss"></style>

<template>
    <div class="card-container">
        <div class="card-header">
            <slot name="header"></slot>
        </div>
        <div class="card-body">
            <div
                v-if="hasTitle"
                class="card-caption">
                <div class="card-title">
                    <slot name="title"></slot>
                </div>
                <div class="card-subtitle">
                    <slot name="subtitle"></slot>
                </div>
            </div>
            <slot name="content"></slot>
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useSlots } from 'vue';


const slots = useSlots();
const hasTitle = $computed(() => slots.title);

</script>