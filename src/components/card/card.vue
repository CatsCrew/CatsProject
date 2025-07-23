<style lang="scss" scoped src="./card.scss"></style>

<template>
    <div class="card-container">
        <div class="card-header">
            <slot name="header"></slot>
        </div>
        <div class="card-content">
            <slot name="content"></slot>
        </div>
        <div class="card-footer">
            <slot name="footer"></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
</script>