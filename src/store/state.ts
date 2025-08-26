import type { CatType } from "@/models/cat-type.enum";
import type { Cat } from "@/models/cat.model";
import type { Creator } from "@/models/creator.model";
import type { Landcat } from "@/models/landcat.model";
import type { Language } from "@/models/language.enum";
import type { LoreDocument } from "@/models/lore-document.model";
import type { Proto } from "@/models/proto.model";
import type { SpeciesSheet } from "@/models/species-sheet.model";
import type { Aerocat } from "@models/aerocat.model";

export interface CatsState {
    creators?: Record<string, Creator>;
    cats?: Cat[];
    aerocats?: Aerocat[];
    landcats?: Landcat[];
    protos?: Proto[];
    speciesSheets?: Record<Language, SpeciesSheet>;
    assets?: Record<CatType, string[]>;
    loreDocuments?: LoreDocument[];
    discordUrl?: string;
    searchTerms?: Record<CatType, string>;
}