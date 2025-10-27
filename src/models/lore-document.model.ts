import { Translation } from "./translation.model";

export interface LoreDocument {
    title?: string;
    description?: string;
    languages?: Translation[];
    disabled?: boolean;
}