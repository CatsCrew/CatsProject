<style lang="scss" scoped src="./primary-carousel.scss"></style>

<template>
  <div class="embla">
    <div class="embla__viewport" :ref="(el) => emblaRef = el as HTMLElement">
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
import { onMounted, onUnmounted, ref, useTemplateRef, nextTick, defineAsyncComponent } from "vue";
import Skeleton from 'primevue/skeleton';
import { CarouselSlide } from "@/models/carousel-slide.model";
import { DeferHelper } from "@/helper/defer.helper";

const ImageViewer = defineAsyncComponent(() => import('@/components/image-viewer/image-viewer.vue'));

const { images } = defineProps<{
  images?: string[];
}>();
const imgs = images ?? [];

const INITIAL_PAGE_SIZE = 5;
const PAGE_SIZE = 10;

const imageLoadingStates = ref({} as Record<string, boolean>);
const slides = ref<CarouselSlide[]>([]);

const [emblaRef, emblaApi] = emblaCarouselVue();

const dotNodes = useTemplateRef('dotNodes');
const slideRefs = useTemplateRef('emblaSlides');

const canScrollPrev = ref(false);
const canScrollNext = ref(false);
const selectedImage = ref('');

function onPageChanged() {
  const selectedIndex = emblaApi.value?.selectedScrollSnap();
  if (selectedIndex == null || !slideRefs.value) return;
  const node = slideRefs.value[selectedIndex] as HTMLElement | undefined;
  if (node) DeferHelper.defer(node);
}

function scrollNext() {
  emblaApi.value?.scrollNext();
}

function scrollPrev() {
  emblaApi.value?.scrollPrev();
}

function updateButtonVisibility() {
  if (emblaApi.value) {
    canScrollPrev.value = emblaApi.value.canScrollPrev();
    canScrollNext.value = emblaApi.value.canScrollNext();
  }
}

function setupKeyEvents(event: KeyboardEvent) {
  if (event.code !== 'ArrowLeft' && event.code !== 'ArrowRight') {
    return;
  }

  if (selectedImage.value) {
    const currentIndex = imgs.findIndex(i => i === selectedImage.value);
    const dir = event.code === 'ArrowLeft' ? -1 : 1;
    const newIndex = ((currentIndex + dir) % imgs.length + imgs.length) % imgs.length;
    selectedImage.value = imgs[newIndex];
  } else {
    if (!emblaApi.value)
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
  emblaApi.value?.scrollTo(index);
}

function toggleDotBtnsActive() {
  if (!dotNodes.value || !emblaApi.value) return;
  const previous = emblaApi.value.previousScrollSnap();
  const selected = emblaApi.value.selectedScrollSnap();
  if (previous == null || selected == null) return;
  const prevNode = dotNodes.value[previous] as Element | undefined;
  const selNode = dotNodes.value[selected] as Element | undefined;
  prevNode?.classList.remove('embla__dot--selected');
  selNode?.classList.add('embla__dot--selected');
}

function onImageLoaded(src: string) {
  imageLoadingStates.value[src] = false;
}

function onImageClicked(image: string) {
  selectedImage.value = image;
}

function onViewerClosed() {
  selectedImage.value = '';
}

onMounted(() => {
  imgs.forEach(i => {
    imageLoadingStates.value[i] = true;
  });

  const pageOneImages = imgs.slice(0, INITIAL_PAGE_SIZE);
  const remainingImages = imgs.slice(INITIAL_PAGE_SIZE);
  if (pageOneImages.length) {
    slides.value.push({
        imageUrls: pageOneImages,
        className: `images-${pageOneImages.length} hero`
    });
  }

  if (remainingImages.length) {
    for (let i = 0; i < remainingImages.length; i += PAGE_SIZE) {
        const chunk = remainingImages.slice(i, i + PAGE_SIZE);
        slides.value.push({
            imageUrls: chunk,
            className: 'images-10'
        });
    }
  }

  nextTick(() => {
    if (slideRefs.value && slideRefs.value[0]) {
      const first = slideRefs.value[0] as HTMLElement | undefined;
      if (first) DeferHelper.defer(first);
    }
  });

  document.addEventListener("keyup", setupKeyEvents);

  if (emblaApi.value) {
    emblaApi.value
      .on('select', updateButtonVisibility)
      .on('init', toggleDotBtnsActive)
      .on('init', updateButtonVisibility)
      .on('reInit', toggleDotBtnsActive)
      .on('select', toggleDotBtnsActive)
      .on('select', onPageChanged);
  }
});

onUnmounted(() => {
    emblaApi.value?.destroy();
    document.removeEventListener("keyup", setupKeyEvents);
});
</script>
