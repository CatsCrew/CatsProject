<style lang="scss" scoped src="./gallery-carousel.scss"></style>

<template>
  <div class="embla">
    <div class="embla__viewport" ref="emblaRef">
      <div class="embla__container">
        <div v-for="image, index in images" :key="image" class="embla__slide">
            <Skeleton
              v-if="imageLoadingStates[index]"
              width="100%"
              height="343px">
            </Skeleton>
            <DeferredContent>
              <img 
                :src="image" 
                alt="cat image" 
                class="cat-ref-img"
                :data-loading="imageLoadingStates[index]"
                @load="onImageLoaded(index)"
                @click="onImageClicked(image)"/>
            </DeferredContent>
        </div>
      </div>
    </div>
    <div class="embla__controls">
      <div class="embla__buttons">
        <button
          v-if="canScrollPrev"
          @click="scrollPrev"
          class="embla__button embla__button--prev">
          <i class="pi pi-chevron-left"></i>
        </button>
        <button
          v-if="canScrollNext"
          @click="scrollNext"
          class="embla__button embla__button--next">
          <i class="pi pi-chevron-right"></i>
        </button>
      </div>

      <div class="embla__dots" v-if="images?.length > 1">
        <button
            v-for="(image, index) in images"
            :key="index"
            ref="dotNodes"
            class="embla__dot"
            @click="dotClicked(index)">
        </button>
      </div>
    </div>
    <ImageViewer
      v-if="selectedImage"
      :src="selectedImage" 
      alt="cat image"
      @close="onViewerClosed" />
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import { onMounted, onUnmounted, useTemplateRef, defineAsyncComponent } from "vue";
import DeferredContent from 'primevue/deferredcontent';
import Skeleton from 'primevue/skeleton';

const ImageViewer = defineAsyncComponent(() => import('@/components/image-viewer/image-viewer.vue'));

const { images } = defineProps<{
  images?: string[];
}>();

const imageLoadingStates = $ref([]);

const [emblaRef, emblaApi] = $(emblaCarouselVue());
const dotNodes = $(useTemplateRef('dotNodes'));

let canScrollPrev = $ref(false);
let canScrollNext = $ref(false);
let selectedImage = $ref('');

function scrollNext() {
  emblaApi?.scrollNext();
}

function scrollPrev() {
  emblaApi?.scrollPrev();
}

function updateButtonVisibility() {
  if (emblaApi) {
    canScrollPrev = emblaApi.canScrollPrev();
    canScrollNext = emblaApi.canScrollNext();
  }
}

function setupKeyEvents(event: KeyboardEvent) {
    if (!emblaApi) 
        return;
    switch (event.code) {
    case "ArrowLeft":
        emblaApi.scrollPrev();
        break;
    case "ArrowRight":
        emblaApi.scrollNext();
        break;
    }
}

function dotClicked(index: number) {
    emblaApi.scrollTo(index);
}

function toggleDotBtnsActive() {
    const previous = emblaApi.previousScrollSnap();
    const selected = emblaApi.selectedScrollSnap();
    dotNodes[previous].classList.remove('embla__dot--selected');
    dotNodes[selected].classList.add('embla__dot--selected');
}

function onImageLoaded(index: number) {
  imageLoadingStates[index] = false;
}

function onImageClicked(image: string) {
  selectedImage = image;
}

function onViewerClosed() {
    selectedImage = null;
}

onMounted(() => {
  images.forEach((_, index) => {
    imageLoadingStates[index] = true;
  });

  document.addEventListener("keyup", setupKeyEvents);
  updateButtonVisibility();

  emblaApi
      .on('select', updateButtonVisibility)
      .on('init', toggleDotBtnsActive)
      .on('reInit', toggleDotBtnsActive)
      .on('select', toggleDotBtnsActive);

  emblaApi.reInit();
});

onUnmounted(() => {
    emblaApi.destroy();
    document.removeEventListener("keyup", setupKeyEvents);
});
</script>
