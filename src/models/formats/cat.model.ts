import { CatType } from "../cat-type.enum";

export interface Cat {
    creator?: string;
    name?: string;
    type?: CatType;
    model?: string;
    description?: string;
    referenceSheetsPath?: string[];
    galleryImagePaths?: string[];
}