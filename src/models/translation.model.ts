import { Language } from "./language.enum";

export interface Translation {
    culture?: string;
    language?: Language;
    url?: string;
    credit?: string[];
}