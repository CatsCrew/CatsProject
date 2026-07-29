import { defineStore } from 'pinia';
import { CatsState } from './state';
import creatorJson from '@assets/creators.json';
import aerocatJson from '@assets/aerocats.json';
import landcatJson from '@assets/landcats.json';
import protoJson from '@assets/protos.json';
import loreDocumentJson from '@assets/lore.json';
import assetJson from '@assets/assets.json';
import catLinksJson from '@assets/cat-links.json';
import speciesSheetJson from '@assets/species-sheet.json';
import { CatType } from '@/models/cat-type.enum';
import { Language } from '@/models/language.enum';
import { UiMapper } from '@/mappers/ui.mapper';
import { Creator } from '@/models/creator.model';
import type { LoreDocument } from '@/models/lore-document.model';
import { UrlHelper } from '@/helper/url.helper';
import type { Aerocat as FileAerocat } from '@/models/formats/aerocat.model';
import type { Landcat as FileLandcat } from '@/models/formats/landcat.model';
import type { Proto as FileProto } from '@/models/formats/proto.model';

export const useCatsStore = defineStore('cats', {
  state: (): CatsState => ({
    creators: {} as Record<string, Creator>,
    aerocats: [],
    landcats: [],
    protos: [],
    cats: [],
    speciesSheets: {} as Record<CatType, Record<Language, string[]>>,
    assets: {} as Record<CatType, string[]>,
    loreDocuments: [],
    discordUrl: 'https://discord.gg/xYm6skrZ3b',
    searchTerms: {
      [CatType.Aerocat]: '',
      [CatType.Landcat]: '',
      [CatType.Proto]: '',
    },
    pageRecord: {
      [CatType.Aerocat]: 1,
      [CatType.Landcat]: 1,
      [CatType.Proto]: 1,
    }
  }),
  getters: {
    isMobile: () => {
        return window.innerWidth <= 600;
    },
    isHandheldDevice: () => {
      return "ontouchstart" in window || navigator.maxTouchPoints > 0;
    },
    speciesSheetByCatAndLanguage(state: CatsState) {
      const { speciesSheets } = state;
      return (catType: CatType, language: Language): string[] => speciesSheets[catType][language];
    },
    catById(state: CatsState) {
      return (id: string) => state.cats.find(c => c.id === id);
    },
    catByName(state: CatsState) {
      return (name: string, type?: CatType) => {
        const query = name.trim().toLocaleLowerCase();
        if (!query) {
          return undefined;
        }

        const pool = type ? state.cats.filter(c => c.type === type) : state.cats;

        const exact = pool.filter(c => c.name?.toLocaleLowerCase() === query);
        if (exact.length) {
          return exact.length === 1 ? exact[0] : undefined;
        }

        const prefixed = pool.filter(c => c.name?.toLocaleLowerCase().startsWith(query));
        return prefixed.length === 1 ? prefixed[0] : undefined;
      };
    }
  },
  actions: {
    initialize() {
      const mappedCreators = UiMapper.toCreators(creatorJson.creators);
      this.creators = {} as Record<string, Creator>;
      mappedCreators.forEach(c => {
        if (c.name) {
          this.creators[c.name] = c;
        }
      });

      const aerocatList = (aerocatJson?.aerocats ?? []) as FileAerocat[];
      aerocatList.forEach(a => {
        if (!a.creator) return;
        const creator = this.creators[a.creator];
        if (!creator) return;
        this.aerocats.push(UiMapper.toAerocat(a, creator));
      });

      const landcatList = (landcatJson?.landcats ?? []) as FileLandcat[];
      landcatList.forEach(l => {
        if (!l.creator) return;
        const creator = this.creators[l.creator];
        if (!creator) return;
        this.landcats.push(UiMapper.toLandcat(l, creator));
      });

      const protoList = (protoJson?.protos ?? []) as FileProto[];
      protoList.forEach(p => {
        if (!p.creator) return;
        const creator = this.creators[p.creator];
        if (!creator) return;
        this.protos.push(UiMapper.toProto(p, creator));
      });

      this.loreDocuments = loreDocumentJson.documents as LoreDocument[];
      this.fetchSpeciesSheets();
      this.fetchAssets();

      this.cats = [...this.aerocats, ...this.landcats, ...this.protos];

      catLinksJson?.links?.forEach(l => {
        const names = l?.cats;
        names?.forEach(n => {
          const others = names.filter(x => x !== n);
          const targetCat = this.cats.find(c => c.name === n);
          if (targetCat) {
            targetCat.linkedCats = this.cats.filter(c => c.name ? others.includes(c.name) : false);
          }
        });
      });
    },
    fetchSpeciesSheets(): void {
      speciesSheetJson.species.forEach(species => {
        const catType = species.type as CatType;
        const languageMap = this.speciesSheets[catType] ??= {} as Record<Language, string[]>;
        species.languages.forEach(language => {
          const imagePaths: string[] = [];
          const formattedLanguage = language.toLocaleLowerCase() as Language;
          species.sheets.forEach(sheet => {
            imagePaths.push(UrlHelper.buildSpeciesSheetPath(catType, formattedLanguage, sheet));
          });
          languageMap[formattedLanguage] = imagePaths;
        });
      });
    },
    fetchAssets(): void {
      assetJson.assets.forEach(a => {
        this.assets[a.type as CatType] = a.assets.map(x => UrlHelper.buildAssetPath(a.type as CatType, x));
      });
    },
  },
});
