import { CatType } from "./cat-type.enum";
import { Creator } from "./creator.model";
import { Equipment } from "./equipment.model";
import { Story } from "./story.model";

export interface Cat {
    id?: string;
    creator?: Creator;
    name?: string;
    type?: CatType;
    model?: string;
    faction?: string;
    description?: string;
    weight?: string;
    height?: string;
    equipment?: Equipment[];
    thumbnail?: string;
    referenceUrls?: string[];
    galleryUrls?: string[];
    linkedCats?: Cat[];
    outdated?: boolean;
    stories?: Story[];
}