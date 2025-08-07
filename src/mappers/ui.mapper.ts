import { Creator } from '@/models/creator.model';
import { Aerocat } from '@/models/aerocat.model';
import { Landcat } from '@/models/landcat.model';
import { Proto } from '@/models/proto.model';

import { Creator as FileCreator } from '@/models/formats/creator.model';
import { Aerocat as FileAerocat } from "@/models/formats/aerocat.model";
import { Landcat as FileLandcat } from "@/models/formats/landcat.model";
import { Proto as FileProto } from "@/models/formats/proto.model";
import { UrlHelper } from '@/helper/url.helper';
import { CatType } from '@/models/cat-type.enum';



export class UiMapper {
    public static toCreators(creators: FileCreator[]): Creator[] {
        return creators.map(this.toCreator) || [];
    }

    public static toAerocat(aerocat: FileAerocat, creator: Creator): Aerocat {
        return {
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
            creator,
            type: CatType.Proto,
            name: proto?.name,
            description: proto?.description,
            model: proto?.model,
            referenceUrls: proto?.referenceSheetsPath?.map(r => UrlHelper.buildCharacterPath(CatType.Proto, r)),
            galleryUrls: proto?.galleryImagePaths?.map(g => UrlHelper.buildCharacterPath(CatType.Proto, g))
        };
    }


    private static toCreator(creator: FileCreator): Creator {
        return {
            name: creator.name,
            socials: creator.socials,
            profileUrl: UrlHelper.buildCreatorPath(creator.profileImage)
        }
    }
}