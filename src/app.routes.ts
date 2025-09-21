import { RouteRecordRaw } from "vue-router";
import { useCatsStore } from '@/store';
import { NavigationGuardNext, RouteLocationNormalized } from 'vue-router';

export enum RouteNames {
    Home = 'home',
    About = 'about',
    SpeciesSheet = 'species-sheet',
    Assets = 'assets',
    Characters = 'characters',
    Character = 'character',
    Aerocats = 'aerocats',
    Landcats = 'landcats',
    Protos = 'protos',
    Lore = 'lore',
    FAQ = 'faq',
    Error = 'error'
}

const RoutePathNames = {
    [RouteNames.Home]: '/',
    [RouteNames.About]: '/about',
    [RouteNames.SpeciesSheet]: '/species-sheet',
    [RouteNames.Assets]: '/assets',
    [RouteNames.Characters]: '/characters',
    [RouteNames.Character]: '/character/:id',
    [RouteNames.Lore]: '/lore',
    [RouteNames.FAQ]: '/faq'
}

function onBeforeEnterDetail(to: RouteLocationNormalized, from: RouteLocationNormalized, next: NavigationGuardNext) {
    const catStore = useCatsStore();
    const id = to.params.id as string;
    const cat = catStore.catById(id);

    if (!cat) {
        next({ name: RouteNames.Error });
    } else {
        next();
    }
}

export const routes: RouteRecordRaw[] = [
    {
        path: RoutePathNames[RouteNames.Home],
        name: RouteNames.Home,
        component: () => import('./modules/home/home.vue')
    },
    {
        path: RoutePathNames[RouteNames.About],
        name: RouteNames.About,
        component: () => import('./modules/about/about.vue')
    },
    {
        path: RoutePathNames[RouteNames.SpeciesSheet],
        name: RouteNames.SpeciesSheet,
        component: () => import('./modules/species-sheet/species-sheet.vue')
    },
    {
        path: RoutePathNames[RouteNames.Assets],
        name: RouteNames.Assets,
        component: () => import('./modules/assets/assets.vue')
    },
    {
        path: RoutePathNames[RouteNames.Characters],
        name: RouteNames.Characters,
        component: () => import('./modules/characters/characters.vue'),
        children: [
            {
                path: RouteNames.Aerocats,
                name: RouteNames.Aerocats,
                component: () => import('./modules/characters/modules/aerocats/aerocats.vue'),
            },
            {
                path: RouteNames.Landcats,
                name: RouteNames.Landcats,
                component: () => import('./modules/characters/modules/landcats/landcats.vue'),
            },
            {
                path: RouteNames.Protos,
                name: RouteNames.Protos,
                component: () => import('./modules/characters/modules/protos/protos.vue'),
            }
        ]
    },
    {
        path: RoutePathNames[RouteNames.Character],
        name: RouteNames.Character,
        component: () => import('./modules/detail/detail.vue'),
        beforeEnter: onBeforeEnterDetail,
        props: true,
    },
    {
        path: RoutePathNames[RouteNames.Lore],
        name: RouteNames.Lore,
        component: () => import('./modules/lore/lore.vue')
    },
    {
        path: RoutePathNames[RouteNames.FAQ],
        name: RouteNames.FAQ,
        component: () => import('./modules/faq/faq.vue')
    },
    {
        // Catch-all route for Vue 3
        path: '/:pathMatch(.*)*',
        name: RouteNames.Error,
        component: () => import('./components/error-page/error-page.vue')
    }
];