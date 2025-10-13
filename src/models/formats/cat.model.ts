import { Equipment } from "../equipment.model";

export interface Cat {
    creator?: string;
    name?: string;
    model?: string;
    description?: string;
    faction?: string;
    weight?: number;
    height?: number;
    equipment?: Equipment[];
    referenceSheetsPath?: string[];
    galleryImagePaths?: string[];
    outdated?: boolean;
}