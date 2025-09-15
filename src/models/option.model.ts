import type { RouteLocationRaw } from 'vue-router';

export interface Option {
    label?: string;
    value?: string;
    route?: RouteLocationRaw;
}