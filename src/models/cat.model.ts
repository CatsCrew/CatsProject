import { CatImage } from "./cat-image.model";
import { CatType } from "./cat-type.enum";
import { Creator } from "./creator.model";
import { Equipment } from "./equipment.model";
import { RedactionField } from "./redaction-field.model";
import { RedactionStyle } from "./redaction-style.enum";
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
    referenceUrls?: CatImage[];
    galleryUrls?: CatImage[];
    linkedCats?: Cat[];
    outdated?: boolean;
    stories?: Story[];
    redaction?: Partial<Record<RedactionField, RedactionStyle>>;
}