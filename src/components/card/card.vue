<style lang="scss" scoped src="./card.scss"></style>

<template>
    <div class="card-container">
        <div class="card-header">
            <slot name="header"></slot>
        </div>
        <div class="card-body">
            <div class="card-caption">
                <slot name="title"></slot>
                <slot name="subtitle"></slot>
            </div>
            <slot name="content"></slot>
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>