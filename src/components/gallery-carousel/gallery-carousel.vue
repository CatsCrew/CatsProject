<style lang="scss" scoped src="./gallery-carousel.scss"></style>

<template>
  <div class="embla">
    <div class="embla__viewport" ref="emblaRef">
      <div class="embla__container">
        <div v-for="image in images" :key="image" class="embla__slide">
          <DeferredContent>
            <Image 
              :src="image" 
              preview
              alt="cat image" 
              imageClass="cat-ref-img"/>
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
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import { onMounted, onUnmounted, useTemplateRef } from "vue";
import Image from "primevue/image";
import DeferredContent from 'primevue/deferredcontent';

const { images } = defineProps<{
  images?: string[];
}>();

const [emblaRef, emblaApi] = $(emblaCarouselVue());
const dotNodes = $(useTemplateRef('dotNodes'));

let canScrollPrev = $ref(false);
let canScrollNext = $ref(false);

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

onMounted(() => {
    document.addEventListener("keyup", setupKeyEvents);
    updateButtonVisibility();

    emblaApi
        .on('select', updateButtonVisibility)
        .on('init', toggleDotBtnsActive)
        .on('reInit', toggleDotBtnsActive)
        .on('select', toggleDotBtnsActive);
});

onUnmounted(() => {
    emblaApi.destroy();
    document.removeEventListener("keyup", setupKeyEvents);
});
</script>
