import { Translation } from "./translation.model";

export interface LoreDocument {
    title?: string;
    description?: string;
    category?: string;
    lastUpdated?: string;
    languages?: Translation[];
}