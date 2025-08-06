export interface MenuItem {
    id?: number;
    label?: string;
    to?: any;
    children?: MenuItem[];
}