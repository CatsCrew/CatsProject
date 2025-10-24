import { CatType } from "@/models/cat-type.enum";

export class UrlHelper {
    static CLOUDFRONT_URL = 'https://d3f1w0zhip1fpv.cloudfront.net';

    static buildCharacterPath(type: CatType, name: string): string {
        return `${this.CLOUDFRONT_URL}/characters/${this.getCatFolderFromType(type)}/${name}`;
    }

    static buildCreatorPath(name: string): string {
        return `${this.CLOUDFRONT_URL}/profiles/${name}`;
    }

    static buildAssetPath(type: CatType, name: string): string {
        return `${this.CLOUDFRONT_URL}/assets/${this.getCatFolderFromType(type)}/${name}`;
    }

    static buildSpeciesSheetPath(type: CatType, language: string, name: string): string {
        return `${this.CLOUDFRONT_URL}/species_reference_sheets/${this.getCatFolderFromType(type)}/${language}/${name}`;
    }

    static getCatFolderFromType(type: CatType): string {
        switch (type) {
            case CatType.Aerocat:
                return 'aerocats';
            case CatType.Landcat:
                return 'landcats';
            case CatType.Proto: 
                return 'protos';
        }
    }
}