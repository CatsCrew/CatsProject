<style lang="scss" scoped src="./species-sheet.scss"></style>

<template>
    <div class="species-sheet-container">
        <div class="selection-container">
            <div class="select-item">
                <div class="select-header">Species</div>
                <SelectButton
                    v-model="catType"
                    :options="catOptions"
                    :allow-empty="false"
                    @change="onLanguageSelected"/>
            </div>
            <div
                v-if="hasLanguageSupport(catType)"
                class="select-item">
                <div class="select-header">Language</div>
                <SelectButton
                    v-model="language"
                    :options="languageOptions"
                    :allow-empty="false"
                    @change="onLanguageSelected"/>
            </div>
        </div>
        <div class="species-sheet-content-container">
            <div class="embla">
                <div class="embla__viewport" ref="emblaRef">
                    <div class="embla__container">
                        <div
                            v-for="image in images"
                            :key="image"
                            class="embla__slide"
                            :class="catType">
                            <div class="image-container">
                                <img
                                    class="ref-sheet-img"
                                    alt="species sheet image"
                                    :src="image"
                                    @click="onImageClicked(image)"/>
                                <button
                                    class="image-overlay"
                                    @click="onImageClicked(image)">
                                    <i class="pi pi-icon pi-eye"></i>
                                </button>
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
        </div>
        <ImageViewer
            v-if="selectedImage"
            :src="selectedImage"
            alt="Selected Cat Image"
            @close="onViewerClosed" />
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, defineAsyncComponent } from 'vue';
import SelectButton from 'primevue/selectbutton';
import { Language } from '@models/language.enum';
import { CatType } from '@/models/cat-type.enum';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import emblaCarouselVue from "embla-carousel-vue";
import ClassNames from 'embla-carousel-class-names';
import { useRoute, useRouter } from 'vue-router';

const ImageViewer = defineAsyncComponent(() => import('@/components/image-viewer/image-viewer.vue'));

const cat$ = useCatsStore();
const { speciesSheets, speciesSheetByCatAndLanguage } = $(storeToRefs(cat$));

const router$ = useRouter();
const route$ = useRoute();

const catOptions = $ref(Object.values(CatType));
const languageOptions = $ref([Language.English, Language.Korean]);

const [emblaRef, emblaApi] = $(emblaCarouselVue({}, [ClassNames()]));
const dotNodes = $(useTemplateRef('dotNodes'));

let catType = $ref(CatType.Aerocat);
let language = $ref(Language.English);
let canScrollPrev = $ref(false);
let canScrollNext = $ref(false);
let prevCatType = $ref(null);
let images = $ref([]);
let selectedImage = $ref('');

function hasLanguageSupport(catType: CatType) {
    return Object.values(speciesSheets[catType])?.length > 1;
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
        emblaApi.scrollTo(newIndex);
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
    dotNodes[previous].classList?.remove('embla__dot--selected');
    dotNodes[selected].classList?.add('embla__dot--selected');
}

function updateRouteQuery() {
    router$.replace({
        query: {
            c: catType,
            l: language
        }
    });
}

function onLanguageSelected(): void {
    if (catType !== prevCatType) {
        emblaApi.scrollTo(0);
        language = Language.English;
    }
    prevCatType = catType;
    images = speciesSheetByCatAndLanguage(catType, language);

    updateRouteQuery();
}

function onImageClicked(image: string) {
    selectedImage = image;
}

function onViewerClosed() {
    selectedImage = null;
}

onMounted(() => {
    document.addEventListener("keyup", setupKeyEvents);
    updateButtonVisibility();

    const validCatTypes = Object.values(CatType);
    const validLanguages = Object.values(Language);

    const queryCat = route$.query.c;
    const queryLang = route$.query.l;

    if (validCatTypes.includes(queryCat as CatType)) {
        catType = queryCat as CatType;
        prevCatType = catType;
    }
    if (validLanguages.includes(queryLang as Language)) {
        language = queryLang as Language;
    }

    images = speciesSheetByCatAndLanguage(catType, language);

    emblaApi
        .on('select', updateButtonVisibility)
        .on('init', toggleDotBtnsActive)
        .on('init', updateButtonVisibility)
        .on('reInit', toggleDotBtnsActive)
        .on('reInit', updateButtonVisibility)
        .on('select', toggleDotBtnsActive);
});

onUnmounted(() => {
    emblaApi.destroy();
    document.removeEventListener("keyup", setupKeyEvents);
});
</script>