import { CatType } from "@/models/cat-type.enum";

export class UrlHelper {
    static CLOUDFRONT_URL = 'https://d3f1w0zhip1fpv.cloudfront.net';

    static buildCharacterPath(type: CatType, name: string): string {
        let characterPath = 'characters/';
        switch (type) {
            case CatType.Aerocat:
                characterPath += 'aerocats/';
                break;
            case CatType.Landcat:
                characterPath += 'landcats/';
                break;
            case CatType.Proto: 
                characterPath += 'protos/';
                break;
        }

        characterPath += name;

        return `${this.CLOUDFRONT_URL}/${characterPath}`;
    }
}