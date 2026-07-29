<style lang="scss" scoped src="./gallery-carousel.scss"></style>

<template>
  <div class="embla">
    <div class="embla__viewport" :ref="(el) => emblaRef = el as HTMLElement">
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
import { onMounted, onUnmounted, ref, useTemplateRef, defineAsyncComponent } from "vue";
import DeferredContent from 'primevue/deferredcontent';
import Skeleton from 'primevue/skeleton';

const ImageViewer = defineAsyncComponent(() => import('@/components/image-viewer/image-viewer.vue'));

const { images } = defineProps<{
  images?: string[];
}>();
const imgs = images ?? [];

const imageLoadingStates = ref<boolean[]>([]);

const [emblaRef, emblaApi] = emblaCarouselVue();
const dotNodes = useTemplateRef('dotNodes');

const canScrollPrev = ref(false);
const canScrollNext = ref(false);
const selectedImage = ref('');

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
    if (!emblaApi.value)
        return;
    switch (event.code) {
      case "ArrowLeft":
          emblaApi.value.scrollPrev();
          break;
      case "ArrowRight":
          emblaApi.value.scrollNext();
          break;
    }
}

function dotClicked(index: number) {
  emblaApi.value?.scrollTo(index);
}

function toggleDotBtnsActive() {
  if (!emblaApi.value || !dotNodes.value) return;
  const previous = emblaApi.value.previousScrollSnap();
  const selected = emblaApi.value.selectedScrollSnap();
  if (previous == null || selected == null) return;
  const prevNode = dotNodes.value[previous] as Element | undefined;
  const selNode = dotNodes.value[selected] as Element | undefined;
  prevNode?.classList.remove('embla__dot--selected');
  selNode?.classList.add('embla__dot--selected');
}

function onImageLoaded(index: number) {
  imageLoadingStates.value[index] = false;
}

function onImageClicked(image: string) {
  selectedImage.value = image;
}

function onViewerClosed() {
    selectedImage.value = '';
}

onMounted(() => {
  imgs.forEach((_, index) => {
    imageLoadingStates.value[index] = true;
  });

  document.addEventListener("keyup", setupKeyEvents);
  updateButtonVisibility();

  if (emblaApi.value) {
    emblaApi.value
      .on('select', updateButtonVisibility)
      .on('init', toggleDotBtnsActive)
      .on('reInit', toggleDotBtnsActive)
      .on('select', toggleDotBtnsActive);

    emblaApi.value.reInit();
  }
});

onUnmounted(() => {
    emblaApi.value?.destroy();
    document.removeEventListener("keyup", setupKeyEvents);
});
</script>
