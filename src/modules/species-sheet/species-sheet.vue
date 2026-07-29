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
                    option-disabled="disabled"
                    option-label="name"
                    option-value="value"
                    :allow-empty="false"
                    @change="onLanguageSelected"/>
            </div>
        </div>
        <div class="species-sheet-content-container">
            <div class="embla">
                <div class="embla__viewport" :ref="(el) => emblaRef = el as HTMLElement">
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
import { computed, onMounted, onUnmounted, ref, useTemplateRef, defineAsyncComponent } from 'vue';
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
const { speciesSheets, speciesSheetByCatAndLanguage } = storeToRefs(cat$);

const router$ = useRouter();
const route$ = useRoute();

const [emblaRef, emblaApi] = emblaCarouselVue({}, [ClassNames()]);
const dotNodes = useTemplateRef('dotNodes');

const catType = ref(CatType.Aerocat);
const language = ref(Language.English);
const canScrollPrev = ref(false);
const canScrollNext = ref(false);
const prevCatType = ref(CatType.Aerocat);
const images = ref<string[]>([]);
const selectedImage = ref('');

const catOptions = ref(Object.values(CatType));
const wipLanguagesPerCatType = {
    [CatType.Aerocat]: [],
    [CatType.Landcat]: [],
    [CatType.Proto]: [],
};

const languageOptions = computed(() => {
    const options = [];
    const sheetsForType = speciesSheets.value[catType.value as CatType] ?? {};
    Object.keys(sheetsForType).forEach(k => {
        options.push({ name: k, value: k, disabled: false });
    });

    (wipLanguagesPerCatType[catType.value as CatType] ?? []).forEach(l => {
        options.push({ name: l, value: l, disabled: true });
    });

    return options;
});

function hasLanguageSupport(catType: CatType) {
    const sheetsForType = speciesSheets.value[catType] ?? {};
    return Object.values(sheetsForType).length > 1;
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
        const currentIndex = images.value.findIndex(i => i === selectedImage.value);
        const dir = event.code === 'ArrowLeft' ? -1 : 1;
        const newIndex = ((currentIndex + dir) % images.value.length + images.value.length) % images.value.length;
        selectedImage.value = images.value[newIndex];
        emblaApi.value.scrollTo(newIndex);
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
    emblaApi.value.scrollTo(index);
}

function toggleDotBtnsActive() {
    if (!dotNodes.value) {
        return;
    }

    const previous = emblaApi.value.previousScrollSnap();
    const selected = emblaApi.value.selectedScrollSnap();
    dotNodes.value[previous].classList?.remove('embla__dot--selected');
    dotNodes.value[selected].classList?.add('embla__dot--selected');
}

function updateRouteQuery() {
    router$.replace({
        query: {
            c: catType.value,
            l: language.value
        }
    });
}

function onLanguageSelected(): void {
    if (catType.value !== prevCatType.value) {
        emblaApi.value.scrollTo(0);
        language.value = Language.English;
    }
    prevCatType.value = catType.value;
    images.value = speciesSheetByCatAndLanguage.value(catType.value as CatType, language.value as Language);

    updateRouteQuery();
}

function onImageClicked(image: string) {
    selectedImage.value = image;
}

function onViewerClosed() {
    selectedImage.value = '';
}

onMounted(() => {
    document.addEventListener("keyup", setupKeyEvents);
    updateButtonVisibility();

    const validCatTypes = Object.values(CatType);
    const validLanguages = Object.values(Language);

    const queryCat = route$.query.c;
    const queryLang = route$.query.l;

    if (validCatTypes.includes(queryCat as CatType)) {
        catType.value = queryCat as CatType;
        prevCatType.value = catType.value;
    }
    if (validLanguages.includes(queryLang as Language)) {
        language.value = queryLang as Language;
    }

    images.value = speciesSheetByCatAndLanguage.value(catType.value as CatType, language.value as Language);

    emblaApi.value
        .on('select', updateButtonVisibility)
        .on('init', toggleDotBtnsActive)
        .on('init', updateButtonVisibility)
        .on('reInit', toggleDotBtnsActive)
        .on('reInit', updateButtonVisibility)
        .on('select', toggleDotBtnsActive);
});

onUnmounted(() => {
    emblaApi.value.destroy();
    document.removeEventListener("keyup", setupKeyEvents);
});
</script>