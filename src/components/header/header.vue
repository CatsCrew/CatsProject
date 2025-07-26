<style lang="scss" scoped src="./header.scss"></style>

<template>
  <header class="app-header-container">
    <div class="header-container">
      <div class="logo-container">
        <div class="logo">
          <router-link :to="{ name: RouteNames.Home }">
              <img class="logo-img" :src="CatsLogo" />
              <span class="logo-text">PROJECT C.A.T.S</span>
          </router-link>
        </div>
        <div class="status-indicator">
          <div class="indicator-container">
            <div class="status-ring"></div>
            <div class="status-dot active"></div>
          </div>
          <span id="typewriter" class="status-text">SYSTEMS ONLINE</span>
        </div>
      </div>
      <div
        v-if="isMobile"
        class="header-drawer-container">
        <Drawer
          v-model:visible="visible"
          header="CATS"
          position="full"
          class="nav-drawer">
          <ul class="nav-links">
            <li @click="onDrawerItemClicked">
              <router-link :to="{ name: RouteNames.About }">
                About
              </router-link>
            </li>
            <li @click="onDrawerItemClicked">
              <router-link :to="{ name: RouteNames.SpeciesSheet }">
                Species Sheet
              </router-link>
            </li>
            <li @click="onDrawerItemClicked">
              <Button @click.stop.prevent="toggleMobileMenu">
                <span>Characters</span>
                <i
                  class="menu-toggle-icon pi"
                  :class="[ mobileMenuExpanded ? 'pi-angle-up' : 'pi-angle-down' ]"></i>
              </Button>
              <Menu
                class="sub-menu"
                v-if="mobileMenuExpanded"
                :model="mobileCharacterMenuItems">
                <template #item="{ item }">
                  <router-link :to="item.to">
                    <span> {{ item.label }}</span>
                  </router-link>
                </template>
              </Menu>
            </li>
          </ul>
        </Drawer>
        <Button icon="pi pi-bars" @click="onDrawerClick">
        </Button>
      </div>
      <nav class="nav-links-container" v-else>
        <Menubar :model="menuItems">
          <template #item="{ item, props, hasSubmenu }">
                <router-link v-if="item.to" v-slot="{ href, navigate }" :to="item.to">
                    <a :href="href" v-bind="props.action" @click="navigate">
                        <span class="menu-item">{{ item.label }}</span>
                    </a>
                </router-link>
                <a v-else :href="item.url" :target="item.target" v-bind="props.action">
                    <span class="menu-item">{{ item.label }}</span>
                    <span v-if="hasSubmenu" class="pi pi-fw pi-angle-down"> </span>
                </a>
            </template>
        </Menubar>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import CatsLogo from '@assets/images/cats_logo.png';
import { RouteNames } from '../../app.routes';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import Menubar from 'primevue/menubar';
import Menu from 'primevue/menu';
import { MenuItem } from 'primevue/menuitem';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import { CatFilter } from '@/models/cat-filter.enum';
import Typewriter from 'typewriter-effect/dist/core';

const cat$ = useCatsStore();
const { isMobile } = $(storeToRefs(cat$));

const statusMessages = [
  "systems online",
  "communications array online",
  "establishing secure connection",
  "preparing for deployment"
];

const characterMenuItems = [
  {
    label: 'Aerocats',
    to: { name: RouteNames.Characters, query: { t: CatFilter.Aerocats } },
  },
  {
    label: 'Landcats',
    to: { name: RouteNames.Characters, query: { t: CatFilter.Landcats } },
  },
  {
    label: 'Protos',
    to: { name: RouteNames.Characters, query: { t: CatFilter.Protos } },
  }
];

const menuItems = $ref<MenuItem[]>([
  {
    label: 'About',
    to: { name: RouteNames.About }
  },
  {
    label: 'Species Sheet',
    to: { name: RouteNames.SpeciesSheet }
  },
  {
    label: 'Lore',
    to: { name: RouteNames.Lore }
  },
  {
    label: 'Characters',
    items: characterMenuItems
  }
]);

const mobileCharacterMenuItems = $ref<MenuItem[]>(characterMenuItems);

let visible = $ref(false);
let mobileMenuExpanded = $ref(false);

function onDrawerClick() {
  visible = true;
}

function onDrawerItemClicked() {
  visible = false;
  mobileMenuExpanded = false;
}

function toggleMobileMenu() {
  mobileMenuExpanded = !mobileMenuExpanded;
}

onMounted(() => {
  new Typewriter('#typewriter', {
    strings: statusMessages,
    autoStart: true,
    loop: true,
  });
});
</script>
