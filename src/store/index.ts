import { defineStore } from 'pinia';
import { CatsState } from './state';
import creatorJson from '@assets/creators.json';
import aerocatJson from '@assets/aerocats.json';
import landcatJson from '@assets/landcats.json';
import protoJson from '@assets/protos.json';
import loreDocumentJson from '@assets/lore.json';
import { GroupedAssets } from '@/models/grouped-assets.model';
import { CatType } from '@/models/cat-type.enum';
import { CatFilter } from '@/models/cat-filter.enum';
import { Cat } from '@/models/cat.model';
import { Language } from '@/models/language.enum';
import { SpeciesSheet } from '@/models/species-sheet.model';

interface ModuleImportInterface {
  default: Object;
}

export const useCatsStore = defineStore('cats', {
  state: (): CatsState => ({
    creators: null,
    aerocats: null,
    landcats: null,
    protos: null,
    cats: null,
    speciesSheets: {} as Record<Language, SpeciesSheet>,
    loreDocuments: null
  }),
  getters: {
    isMobile: () => {
        return window.innerWidth <= 600;
    },
    filterCats(state: CatsState) {
      const { aerocats, landcats, protos } = state;
      return (filter: CatFilter): Cat[] => {
        switch (filter) {
          case CatFilter.Aerocats:
            return aerocats;
          case CatFilter.Landcats:
            return landcats;
          case CatFilter.Protos:
            return protos;
        }
      }
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
    }
  },
  actions: {
    initialize() {
      this.creators = creatorJson.creators;
      this.aerocats = aerocatJson.aerocats;
      this.landcats = landcatJson.landcats;
      this.protos = protoJson.protos;
      this.loreDocuments = loreDocumentJson.documents;

      this.fetchAerocats();
      this.fetchLandcats();
      this.fetchProtos();
      this.fetchSpeciesSheets();

      this.cats = [...this.aerocats, ...this.landcats, ...this.protos];
    },
    fetchAerocats(): void {
      const aerocatGlob = import.meta.glob<ModuleImportInterface>('/src/assets/images/aerocats/**/*', { eager: true });
      const groupedAerocatAssetUrls = this.groupAssetUrls(aerocatGlob);
      this.aerocats?.forEach(a => {
        const formattedName = a.name.toLowerCase().replaceAll(' ', '_');
        a.type = CatType.Aerocat;
        a.galleryImagePaths = groupedAerocatAssetUrls[formattedName]?.galleryImagePaths;
        a.referenceSheetsPath = groupedAerocatAssetUrls[formattedName]?.referenceSheetImagePaths;
      });
    },
    fetchLandcats(): void {
      const landcatGlob = import.meta.glob<ModuleImportInterface>('/src/assets/images/landcats/**/*', { eager: true});
      const groupedLandcatAssetUrls = this.groupAssetUrls(landcatGlob);
      this.landcats?.forEach(l => {
        const formattedName = l.name.toLowerCase().replaceAll(' ', '_');
        l.type = CatType.Landcat;
        l.galleryImagePaths = groupedLandcatAssetUrls[formattedName]?.galleryImagePaths;
        l.referenceSheetsPath = groupedLandcatAssetUrls[formattedName]?.referenceSheetImagePaths;
      });
    },
    fetchProtos(): void {
      const protoGlob = import.meta.glob<ModuleImportInterface>('/src/assets/images/protos/**/*', { eager: true });
      const groupedProtoAssetUrls = this.groupAssetUrls(protoGlob);
      this.protos?.forEach(p => {
        const formattedName = p.name.toLowerCase().replaceAll(' ', '_');
        p.type = CatType.Proto;
        p.galleryImagePaths = groupedProtoAssetUrls[formattedName]?.galleryImagePaths;
        p.referenceSheetsPath = groupedProtoAssetUrls[formattedName]?.referenceSheetImagePaths;
      });
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
    groupAssetUrls(globRecord: Record<string, ModuleImportInterface>): Record<string, GroupedAssets> {
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

      const groupedAssetsByName: Record<string, GroupedAssets> = {};
      for (const groupKey in initialGroupedUrls) {
        groupedAssetsByName[groupKey] = {
          galleryImagePaths: [],
          referenceSheetImagePaths: []
        };
        const urlsInGroup = initialGroupedUrls[groupKey];

        for (const url of urlsInGroup) {
          const parts = url.split('/');
          // The subdirectory before the filename is at index `parts.length - 2`
          if (parts.length >= 2) { // Ensure there's at least a subdirectory and a filename
              const folderKey = parts[parts.length - 2];
              
              if (folderKey === 'gallery') {
                if (groupedAssetsByName[groupKey].galleryImagePaths) {
                  groupedAssetsByName[groupKey].galleryImagePaths.push(urlHashRecord[url]);
                } else {
                  groupedAssetsByName[groupKey].galleryImagePaths = [urlHashRecord[url]];
                }
              } else if (folderKey === 'reference_sheets') {
                if (groupedAssetsByName[groupKey].referenceSheetImagePaths) {
                  groupedAssetsByName[groupKey].referenceSheetImagePaths.push(urlHashRecord[url]);
                } else {
                  groupedAssetsByName[groupKey].referenceSheetImagePaths = [urlHashRecord[url]];
                }
              }
          }

          

          groupedAssetsByName[groupKey].galleryImagePaths?.sort(this.sortFileByNumberName);
          groupedAssetsByName[groupKey].referenceSheetImagePaths?.sort(this.sortFileByNumberName);
        }
      }
    
      return groupedAssetsByName;
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
