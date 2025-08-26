import { defineStore } from 'pinia';
import { CatsState } from './state';
import creatorJson from '@assets/creators.json';
import aerocatJson from '@assets/aerocats.json';
import landcatJson from '@assets/landcats.json';
import protoJson from '@assets/protos.json';
import loreDocumentJson from '@assets/lore.json';
import assetJson from '@assets/assets.json';
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
    speciesSheets: {} as Record<Language, SpeciesSheet>,
    assets: {} as Record<CatType, string[]>,
    loreDocuments: null,
    discordUrl: 'https://discord.gg/xYm6skrZ3b',
    searchTerms: {
      [CatType.Aerocat]: '',
      [CatType.Landcat]: '',
      [CatType.Proto]: '',
    },
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
      return (catType: CatType, language: Language): string[] => {
        const speciesSheet = speciesSheets[catType];
        switch (language) {
          case Language.English:
            return speciesSheet.englishImagePaths;
          case Language.Japanese:
            return speciesSheet.japeneseImagePaths;
          case Language.Korean:
            return speciesSheet.koreanImagePaths;
        }
      }
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
      })

      this.loreDocuments = loreDocumentJson.documents;
      this.fetchSpeciesSheets();
      this.fetchAssets();

      this.cats = [...this.aerocats, ...this.landcats, ...this.protos];
    },
    fetchSpeciesSheets(): void {
      const speciesSheetsGlob = import.meta.glob<ModuleImportInterface>('/src/assets/images/species-sheets/**/*', { eager: true });
      const groupedLanguageAssets = this.groupSpeciesSheetAssetUrls(speciesSheetsGlob);
      Object.keys(groupedLanguageAssets || {}).forEach((key) => {
        const value = groupedLanguageAssets[key];
        switch(key) {
          case CatType.Aerocat:
            this.speciesSheets[CatType.Aerocat] = value;
          case CatType.Landcat:
            this.speciesSheets[CatType.Landcat] = value;
          case CatType.Proto:
            this.speciesSheets[CatType.Proto] = value;
        }
      });
    },
    fetchAssets(): void {
      assetJson.assets.forEach(a => {
        this.assets[a.type] = a.assets.map(x => UrlHelper.buildAssetPath(a.type as CatType, x));
      });
    },
    groupSpeciesSheetAssetUrls(globRecord: Record<string, ModuleImportInterface>): Record<string, SpeciesSheet> {
      const initialGroupedUrls: Record<string, string[]> = {};
      const urlHashRecord: Record<string, string> = {};

      for (const [assetPath, assetHashedPath] of Object.entries(globRecord)) {
        urlHashRecord[assetPath] = assetHashedPath.default as string;
      }

      for (const url of Object.keys(globRecord)) {
        const parts = url.split('/');
    
        // We need at least 3 parts from the right for the grouping directory
        // plus the filename and its parent directory. So a total of 5 parts minimum.
        if (parts.length >= 5) {
          // The third part from the right is at index `parts.length - 3`
          const groupKey = parts[parts.length - 3];
    
          if (initialGroupedUrls[groupKey]) {
            initialGroupedUrls[groupKey].push(url);
          } else {
            initialGroupedUrls[groupKey] = [url];
          }
        }
      }

      const groupedAssetsByName: Record<string, SpeciesSheet> = {};
      for (const groupKey in initialGroupedUrls) {
        groupedAssetsByName[groupKey] = {
          englishImagePaths: [],
          japeneseImagePaths: [],
          koreanImagePaths: []
        };

        const urlsInGroup = initialGroupedUrls[groupKey];

        for (const url of urlsInGroup) {
          const parts = url.split('/');

          if (parts.length >= 2) { // Ensure there's at least a subdirectory and a filename
            const language = parts[parts.length - 2];

            switch (language) {
              case Language.English:
                if (groupedAssetsByName[groupKey].englishImagePaths) {
                  groupedAssetsByName[groupKey].englishImagePaths.push(urlHashRecord[url])
                } else {
                  groupedAssetsByName[groupKey].englishImagePaths = [urlHashRecord[url]];
                }
                break;
              case Language.Korean: 
                if (groupedAssetsByName[groupKey].koreanImagePaths) {
                  groupedAssetsByName[groupKey].koreanImagePaths.push(urlHashRecord[url])
                } else {
                  groupedAssetsByName[groupKey].koreanImagePaths = [urlHashRecord[url]];
                }
                break;
              case Language.Japanese:
                if (groupedAssetsByName[groupKey].japeneseImagePaths) {
                  groupedAssetsByName[groupKey].japeneseImagePaths.push(urlHashRecord[url])
                } else {
                  groupedAssetsByName[groupKey].japeneseImagePaths = [urlHashRecord[url]];
                }
                break;
            }
          }
        }
      }

      return groupedAssetsByName;
    },
    sortFileByNumberName(a: string, b: string): number {
      // Extract the filename from each URL
      const filenameA = a.split('/').pop() || '';
      const filenameB = b.split('/').pop() || '';

      // Remove the file extension
      const nameA = filenameA.split('.')[0];
      const nameB = filenameB.split('.')[0];

      // Convert to numbers for comparison
      const numA = parseInt(nameA, 10);
      const numB = parseInt(nameB, 10);

      // Handle cases where names might not be purely numeric
      if (isNaN(numA) || isNaN(numB)) {
          // If either is not a number, fall back to alphabetical sort
          return nameA.localeCompare(nameB);
      } else {
          // Otherwise, perform numerical sort
          return numA - numB;
      }
    }
  },
});
