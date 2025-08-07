<style lang="scss" scoped src="./header.scss"></style>

<template>
  <header class="app-header-container">
    <div class="header-container">
      <div class="logo-and-nav">
        <div class="logo-container">
          <div class="logo">
            <router-link :to="{ name: RouteNames.Home }">
                <img class="logo-img" alt="Cats Logo" :src="CatsLogo" />
                <span class="logo-text">PROJECT C.A.T.S</span>
            </router-link>
          </div>
        </div>
        <div
          v-if="isMobile"
          class="header-drawer-container">
          <Drawer
            v-model:visible="visible"
            position="full"
            class="nav-drawer">
            <template #header>
              <div class="logo">
                <router-link :to="{ name: RouteNames.Home }">
                    <img class="logo-img" alt="Cats Logo" :src="CatsLogo" />
                    <span class="logo-text">PROJECT C.A.T.S</span>
                </router-link>
              </div>
            </template>
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
                <router-link :to="{ name: RouteNames.Lore }">
                  Lore
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
          <ul class="nav">
            <template
              v-for="menuItem in menuItems"
              :key="menuItem.label">
              <li 
                @click.stop="toggleDropdown(menuItem.id)"
                v-on-click-outside="closeDropdown"
                :data-dropdown="menuItem.id">
                <template v-if="menuItem.children">
                  {{ menuItem.label }}
                  <i
                    class="pi pi-icon"
                    :class="[openDropdownId === menuItem.id ? 'pi-angle-up' : 'pi-angle-down']"></i>
                  <ul
                    class="submenu"
                    :class="{ 'active': openDropdownId === menuItem.id }">
                    <li
                      v-for="submenuItem, index in menuItem.children"
                      :key="index">
                      <router-link
                        :to="submenuItem.to">
                        {{ submenuItem.label }}
                      </router-link>
                    </li>
                  </ul>
                </template>
                <router-link
                  v-else
                  :to="menuItem.to">
                  {{ menuItem.label }}
                </router-link>
              </li>
            </template>
          </ul>
        </nav>
      </div>
      <div class="status-indicator">
        <div class="indicator-container">
          <div class="status-ring"></div>
          <div class="status-dot active"></div>
        </div>
        <span id="typewriter" class="status-text">SYSTEMS ONLINE</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import CatsLogo from '@assets/images/cats_logo.png';
import { RouteNames } from '../../app.routes';
import Drawer from 'primevue/drawer';
import Button from 'primevue/button';
import Menu from 'primevue/menu';
import { MenuItem } from '@/models/menu-item.model';
import { useCatsStore } from '@/store';
import { storeToRefs } from 'pinia';
import Typewriter from 'typewriter-effect/dist/core';
import { vOnClickOutside } from '@vueuse/components'
import { CatFilter } from '@/models/cat-filter.enum';

const cat$ = useCatsStore();
const { isMobile } = $(storeToRefs(cat$));

let openDropdownId = $ref<number>(null);

const statusMessages = [
  "systems online",
  "communications array online",
  "establishing secure connection",
  "preparing for deployment"
];

const characterMenuItems: MenuItem[] = [
  {
    label: 'Aerocats',
    to: { name: RouteNames.Aerocats },
  },
  {
    label: 'Landcats',
    to: { name: RouteNames.Landcats },
  },
  {
    label: 'Protos',
    to: { name: RouteNames.Protos },
  }
];

const menuItems = $ref<MenuItem[]>([
  {
    id: 1,
    label: 'About',
    to: { name: RouteNames.About }
  },
  {
    id: 2,
    label: 'Species Sheet',
    to: { name: RouteNames.SpeciesSheet }
  },
  {
    id: 3,
    label: 'Lore',
    to: { name: RouteNames.Lore }
  },
  {
    id: 4,
    label: 'Characters',
    children: characterMenuItems
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

function toggleDropdown(id: number) {
  openDropdownId = openDropdownId === id ? null : id;
}

function closeDropdown(e: Event) {
  const element = e.target as HTMLElement;
  if (element.dataset.dropdown === openDropdownId?.toString()) {
    return;
  }
  openDropdownId = null;
}

onMounted(() => {
  new Typewriter('#typewriter', {
    strings: statusMessages,
    autoStart: true,
    loop: true,
  });
});
</script>
 