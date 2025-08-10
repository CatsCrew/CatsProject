import { RouteRecordRaw } from "vue-router";
import { CatFilter } from "./models/cat-filter.enum";

export enum RouteNames {
    Home = 'home',
    About = 'about',
    SpeciesSheet = 'species-sheet',
    Characters = 'characters',
    Character = 'character',
    Aerocats = 'aerocats',
    Landcats = 'landcats',
    Protos = 'protos',
    Lore = 'lore'
}

const RoutePathNames = {
    [RouteNames.Home]: '/',
    [RouteNames.About]: '/about',
    [RouteNames.SpeciesSheet]: '/species-sheet',
    [RouteNames.Characters]: '/characters',
    [RouteNames.Character]: '/character/:id',
    [RouteNames.Lore]: '/lore'
}

export const routes: RouteRecordRaw[] = [
    {
        path: RoutePathNames[RouteNames.Home],
        name: RouteNames.Home,
        component: () => import('./modules/home/home.vue')
    } as RouteRecordRaw,
    {
        path: RoutePathNames[RouteNames.About],
        name: RouteNames.About,
        component: () => import('./modules/about/about.vue')
    } as RouteRecordRaw,
    {
        path: RoutePathNames[RouteNames.SpeciesSheet],
        name: RouteNames.SpeciesSheet,
        component: () => import('./modules/species-sheet/species-sheet.vue')
    } as RouteRecordRaw,
    {
        path: RoutePathNames[RouteNames.Characters],
        name: RouteNames.Characters,
        component: () => import('./modules/characters/characters.vue'),
        props: { category: CatFilter.Aerocats },
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
    } as RouteRecordRaw,
    {
        path: RoutePathNames[RouteNames.Character],
        name: RouteNames.Character,
        component: () => import('./modules/detail/detail.vue'),
        props: true,
    } as RouteRecordRaw,
    {
        path: RoutePathNames[RouteNames.Lore],
        name: RouteNames.Lore,
        component: () => import('./modules/lore/lore.vue')
    } as RouteRecordRaw,
];