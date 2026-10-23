import { CatImage } from "../cat-image.model";
import { Equipment } from "../equipment.model";
import { Story } from "../story.model";

export interface Cat {
    creator?: string;
    name?: string;
    model?: string;
    description?: string;
    faction?: string;
    weight?: number;
    height?: number;
    equipment?: Equipment[];
    referenceSheetsPath?: CatImage[];
    galleryImagePaths?: CatImage[];
    outdated?: boolean;
    stories?: Story[];
}