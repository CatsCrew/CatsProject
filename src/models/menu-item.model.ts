import { RouteLocationRaw } from "vue-router";

export interface MenuItem {
    id?: number;
    label?: string;
    to?: RouteLocationRaw;
    children?: MenuItem[];
}