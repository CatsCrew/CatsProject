import { Creator } from '@/models/creator.model';
import { Aerocat } from '@/models/aerocat.model';
import { Landcat } from '@/models/landcat.model';
import { Proto } from '@/models/proto.model';

import { Creator as FileCreator } from '@/models/formats/creator.model';
import { Aerocat as FileAerocat } from "@/models/formats/aerocat.model";
import { Landcat as FileLandcat } from "@/models/formats/landcat.model";
import { Cat as FileCat } from "@/models/formats/cat.model";
import { Proto as FileProto } from "@/models/formats/proto.model";
import { UrlHelper } from '@/helper/url.helper';
import { CatType } from '@/models/cat-type.enum';
import Sqids from 'sqids';
import hash from "object-hash";

const sqids = new Sqids({
    alphabet: 'bPqYthvRnlXJQWLxyo45FEgadiMcf7Vzr0UO6IAmpHwBDkGeCsT9u32KjZ8S1N',
    minLength: 10
});

export class UiMapper {
    static index = 1;

    public static toCreators(creators: FileCreator[]): Creator[] {
        return creators.map(this.toCreator) || [];
    }

    public static toAerocat(aerocat: FileAerocat, creator: Creator): Aerocat {
        return {
            id: this.hashCat(aerocat),
            creator,
            type: CatType.Aerocat,
            name: aerocat?.name,
            description: aerocat?.description,
            model: aerocat?.model,
            referenceUrls: aerocat?.referenceSheetsPath?.map(r => UrlHelper.buildCharacterPath(CatType.Aerocat, r)),
            galleryUrls: aerocat?.galleryImagePaths?.map(g => UrlHelper.buildCharacterPath(CatType.Aerocat, g))
        };
    }

    public static toLandcat(landcat: FileLandcat, creator: Creator): Landcat {
        return {
            id: this.hashCat(landcat),
            creator,
            type: CatType.Landcat,
            name: landcat?.name,
            description: landcat?.description,
            model: landcat?.model,
            referenceUrls: landcat?.referenceSheetsPath?.map(r => UrlHelper.buildCharacterPath(CatType.Landcat, r)),
            galleryUrls: landcat?.galleryImagePaths?.map(g => UrlHelper.buildCharacterPath(CatType.Landcat, g))
        };
    }

    public static toProto(proto: FileProto, creator: Creator): Proto {
        return {
            id: this.hashCat(proto),
            creator,
            type: CatType.Proto,
            name: proto?.name,
            description: proto?.description,
            model: proto?.model,
            referenceUrls: proto?.referenceSheetsPath?.map(r => UrlHelper.buildCharacterPath(CatType.Proto, r)),
            galleryUrls: proto?.galleryImagePaths?.map(g => UrlHelper.buildCharacterPath(CatType.Proto, g))
        };
    }

    private static hashCat(cat: FileCat): string {
        const hashValue = hash({
            name: cat.name,
            type: cat.type,
            model: cat.model,
            creator: cat.creator
         } as FileCat, { algorithm: "md5" });

        // Take the first 13 hexadecimal characters (52 bits) to ensure it fits
        // perfectly within JavaScript's Number.MAX_SAFE_INTEGER (53 bits).
        // 13 hex chars = 13 * 4 = 52 bits.
        const truncatedHashHex = hashValue.substring(0, 13);
        const numericId = parseInt(truncatedHashHex, 16);

        return sqids.encode([numericId]);
    }


    private static toCreator(creator: FileCreator): Creator {
        return {
            name: creator.name,
            profileUrl: UrlHelper.buildCreatorPath(creator.profileImage)
        }
    }
}