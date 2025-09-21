<style lang="scss" scoped src="./faq.scss"></style>

<template>
    <div class="faq-container">
        <div class="header">
            Frequently Asked Questions
        </div>
        <div class="faq-content">
            <div v-if="isEmpty">
                No FAQ yet! Come back later!
            </div>
            <Accordion value="0">
                <AccordionPanel
                    v-for="tab in faqItems"
                    :key="tab.question"
                    :value="tab.answer">
                    <AccordionHeader>{{ tab.question }}</AccordionHeader>
                    <AccordionContent>
                        <p class="faq-answer">{{ tab.answer }}</p>
                    </AccordionContent>
                </AccordionPanel>
            </Accordion>
        </div>
    </div>
</template>

<script setup lang="ts">
import faqJson from '@assets/faq.json';
import Accordion from 'primevue/accordion';
import AccordionPanel from 'primevue/accordionpanel';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';

const faqItems = faqJson.faqs;

const isEmpty = $computed(() => faqItems.length === 0);
</script>