import { CatType } from "./cat-type.enum";
import { Creator } from "./creator.model";

export interface Cat {
    id?: string;
    creator?: Creator;
    name?: string;
    type?: CatType;
    model?: string;
    faction?: string;
    description?: string;
    thumbnail?: string;
    referenceUrls?: string[];
    galleryUrls?: string[];
}