<style lang="scss" scoped src="./primary-carousel.scss"></style>

<template>
  <div class="embla">
    <div class="embla__viewport" ref="emblaRef">
      <div class="embla__container">
        <div
            class="primary-carousel-slide"
            v-for="slide in slides"
            :class="[slide.className]">
            <div
                class="carousel-item"
                v-for="(image, index) in slide.imageUrls"
                :key="index">
                <Skeleton
                    v-if="imageLoadingStates[index]"
                    width="100%"
                    height="343px">
                </Skeleton>
                <DeferredContent class="deferred-content">
                    <Image 
                        :src="image" 
                        preview
                        alt="cat image" 
                        imageClass="cat-ref-img"
                        :data-loading="imageLoadingStates[index]"
                        @load="onImageLoaded(index)"
                        ref="slideImageRefs"/>
                </DeferredContent>
            </div>
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

      <div class="embla__dots" v-if="slides?.length > 1">
        <button
            v-for="(slide, index) in slides"
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
import Skeleton from 'primevue/skeleton';
import { CarouselSlide } from "@/models/carousel-slide.model";

const { images } = defineProps<{
  images?: string[];
}>();

const INITIAL_PAGE_SIZE = 5;
const PAGE_SIZE = 10;

const imageLoadingStates = $ref([]);
const slideImageRefs = $ref([]);
const slides = $ref<CarouselSlide[]>([]);

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
  if (!dotNodes) {
    return;
  }

  const previous = emblaApi.previousScrollSnap();
  const selected = emblaApi.selectedScrollSnap();
  dotNodes[previous].classList.remove('embla__dot--selected');
  dotNodes[selected].classList.add('embla__dot--selected');
}

function onImageLoaded(index: number) {
  imageLoadingStates[index] = false;
}

onMounted(() => {
  images.forEach((_, index) => {
    imageLoadingStates[index] = true;
  });

  const pageOneImages = images.slice(0, INITIAL_PAGE_SIZE);
  const remainingImages = images.slice(INITIAL_PAGE_SIZE);
  if (pageOneImages.length) {
    slides.push({
        imageUrls: pageOneImages,
        className: `images-${pageOneImages.length} hero`
    });
  }

  if (remainingImages.length) {
    for (let i = 0; i < remainingImages.length; i += PAGE_SIZE) {
        const chunk = remainingImages.slice(i, i + PAGE_SIZE);
        slides.push({
            imageUrls: chunk,
            className: 'images-10'
        });
    }
  }

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
