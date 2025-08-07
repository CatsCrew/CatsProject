import { CatType } from "./cat-type.enum";
import { Creator } from "./creator.model";

export interface Cat {
    creator?: Creator;
    name?: string;
    type?: CatType;
    model?: string;
    description?: string;
    referenceUrls?: string[];
    galleryUrls?: string[];
}