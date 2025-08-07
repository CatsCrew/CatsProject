<style lang="scss" src="./character-modal.scss"></style>

<template>
  <Dialog
    class="character-modal-container"
    v-model:visible="visible"
    :draggable="false"
    dismissableMask
    modal
    closeOnEscape
    :position="position">
    <template #header>
      <span class="cat-name"> {{ cat?.name }} </span>
    </template>
    <div class="modal-content">
      <div class="cat-content">
        <GalleryCarousel
          :images="images">
        </GalleryCarousel>
        <div class="cat-model">
          {{ cat?.model }}
        </div>
        <span v-if="cat?.description" class="additional-info">
          {{ cat?.description }}
        </span>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
import { onMounted, watch } from "vue";
import { Cat } from "@models/cat.model";
import Dialog from "primevue/dialog";
import GalleryCarousel from "../../../../components/gallery-carousel/gallery-carousel.vue";
import { useCatsStore } from "@/store";
import { storeToRefs } from "pinia";

const { cat } = defineProps<{
  cat?: Cat;
}>();

const emit = defineEmits(['close']);

const cats$ = useCatsStore();
const { isMobile } = $(storeToRefs(cats$));

let visible = $ref(true);
let images = $ref([]);
let position = $computed(() => isMobile ? "bottom": null);

function toggleBodyLock() {
  if (visible) {
    document.body.classList?.add('modal-open');
  } else {
    document.body.classList?.remove('modal-open');
  }
}

watch(() => visible, () => {
  toggleBodyLock();
  emit('close');
});


onMounted(async () => {
  toggleBodyLock();
  let allImages = [];
  if (cat?.referenceUrls?.length) {
    allImages.push(...cat.referenceUrls);
  }

  if (cat?.galleryUrls?.length) {
    allImages.push(...cat.galleryUrls);
  }

  images = allImages;
});
</script>
