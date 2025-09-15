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
import { SpeciesSheet } from '@/models/species-sheet.model';
import { UiMapper } from '@/mappers/ui.mapper';
import { Creator } from '@/models/creator.model';
import { UrlHelper } from '@/helper/url.helper';

interface ModuleImportInterface {
  default: Object;
}

export const useCatsStore = defineStore('cats', {
  state: (): CatsState => ({
    creators: null,
    aerocats: [],
    landcats: [],
    protos: [],
    cats: null,
    speciesSheets: {} as Record<CatType, Record<Language, string[]>>,
    assets: {} as Record<CatType, string[]>,
    loreDocuments: null,
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
    }
  },
  actions: {
    initialize() {
      const mappedCreators = UiMapper.toCreators(creatorJson.creators);
      this.creators = {} as Record<string, Creator>;
      mappedCreators.forEach(c => {
        this.creators[c.name] = c;
      });

      aerocatJson?.aerocats?.forEach(a => {
        const creator = this.creators[a.creator];
        this.aerocats.push(UiMapper.toAerocat(a, creator));
      });

      landcatJson?.landcats?.forEach(l => {
        const creator = this.creators[l.creator];
        this.landcats.push(UiMapper.toLandcat(l, creator));
      });

      protoJson?.protos?.forEach(p => {
        const creator = this.creators[p.creator];
        this.protos.push(UiMapper.toProto(p, creator));
      });

      this.loreDocuments = loreDocumentJson.documents;
      this.fetchSpeciesSheets();
      this.fetchAssets();

      this.cats = [...this.aerocats, ...this.landcats, ...this.protos];

      catLinksJson?.links?.forEach(l => {
        const names = l?.cats;
        names?.forEach(n => {
          const others = names.filter(x => x !== n);
          const targetCat = this.cats.find(c => c.name === n);
          if (targetCat) {
            targetCat.linkedCats = this.cats.filter(c => others.includes(c.name));
          }
        });
      });
    },
    fetchSpeciesSheets(): void {
      speciesSheetJson.species.forEach(species => {
        this.speciesSheets[species.type] = {} as Record<Language, string[]>;
        species.languages.forEach(language => {
          const imagePaths = [];
          const formattedLanguage = language.toLocaleLowerCase();
          species.sheets.forEach(sheet => {
            imagePaths.push(UrlHelper.buildSpeciesSheetPath(species.type as CatType, formattedLanguage, sheet));
          });
          this.speciesSheets[species.type][formattedLanguage] = imagePaths;
        });
      });
    },
    fetchAssets(): void {
      assetJson.assets.forEach(a => {
        this.assets[a.type] = a.assets.map(x => UrlHelper.buildAssetPath(a.type as CatType, x));
      });
    },
  },
});
