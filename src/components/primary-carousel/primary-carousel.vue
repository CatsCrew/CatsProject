<style lang="scss" scoped src="./primary-carousel.scss"></style>

<template>
  <div class="embla">
    <div class="embla__viewport" ref="emblaRef">
      <div class="embla__container">
        <div
            class="primary-carousel-slide"
            v-for="slide in slides"
            :class="[slide.className]"
            ref="emblaSlides">
            <div
                class="carousel-item"
                v-for="image in slide.imageUrls"
                :key="image">
                <Skeleton
                    v-if="imageLoadingStates[image]"
                    width="100%"
                    height="100%">
                </Skeleton>
                <div class="image-container">
                  <img
                    class="cat-ref-img"
                    alt="aerocat profile image"
                    :data-src="image"
                    :data-loading="imageLoadingStates[image]"
                    @load="onImageLoaded(image)"/>
                  <button
                    class="image-overlay"
                    @click="onImageClicked(image)">
                    <i class="pi pi-icon pi-eye"></i>
                  </button>
                </div>
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
    <ImageViewer
      v-if="selectedImage"
      :src="selectedImage" 
      alt="cat image"
      @close="onViewerClosed" />
  </div>
</template>

<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import { onMounted, onUnmounted, useTemplateRef, nextTick, defineAsyncComponent } from "vue";
import Skeleton from 'primevue/skeleton';
import { CarouselSlide } from "@/models/carousel-slide.model";
import { DeferHelper } from "@/helper/defer.helper";

const ImageViewer = defineAsyncComponent(() => import('@/components/image-viewer/image-viewer.vue'));

const { images } = defineProps<{
  images?: string[];
}>();

const INITIAL_PAGE_SIZE = 5;
const PAGE_SIZE = 10;

const imageLoadingStates = $ref({} as Record<string, boolean>);
const slides = $ref<CarouselSlide[]>([]);

const [emblaRef, emblaApi] = $(emblaCarouselVue());

const dotNodes = $(useTemplateRef('dotNodes'));
const slideRefs = $(useTemplateRef('emblaSlides'));

let canScrollPrev = $ref(false);
let canScrollNext = $ref(false);
let selectedImage = $ref('');

function onPageChanged() {
  const selectedIndex = emblaApi?.selectedScrollSnap();
  DeferHelper.defer(slideRefs[selectedIndex]);
}

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
  if (event.code !== 'ArrowLeft' && event.code !== 'ArrowRight') {
    return;
  }

  if (selectedImage) {
    const currentIndex = images.findIndex(i => i === selectedImage);
    const dir = event.code === 'ArrowLeft' ? -1 : 1;
    const newIndex = ((currentIndex + dir) % images.length + images.length) % images.length;
    selectedImage = images[newIndex];
  } else {
    if (!emblaApi) 
      return;

    switch (event.code) {
      case "ArrowLeft":
          scrollPrev();
          break;
      case "ArrowRight":
          scrollNext();
          break;
    }
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

function onImageLoaded(src: string) {
  imageLoadingStates[src] = false;
}

function onImageClicked(image: string) {
  selectedImage = image;
}

function onViewerClosed() {
    selectedImage = null;
}

onMounted(() => {
  images.forEach(i => {
    imageLoadingStates[i] = true;
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

  nextTick(() => {
    DeferHelper.defer(slideRefs[0]);
  });

  document.addEventListener("keyup", setupKeyEvents);

  emblaApi
    .on('select', updateButtonVisibility)
    .on('init', toggleDotBtnsActive)
    .on('init', updateButtonVisibility)
    .on('reInit', toggleDotBtnsActive)
    .on('select', toggleDotBtnsActive)
    .on('select', onPageChanged);
});

onUnmounted(() => {
    emblaApi.destroy();
    document.removeEventListener("keyup", setupKeyEvents);
});
</script>
