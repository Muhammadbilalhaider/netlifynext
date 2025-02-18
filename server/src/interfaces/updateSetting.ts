// src/types/settings.types.ts
export interface UpdateSettingsDto {
  resume: string;
  jobPreferences: string;
  excludedJobTitleKeywords: string[];
  excludedTechnologies: string[];
  requiredTechnologies: string[];
  primaryJobTitles: string[];
  secondaryJobTitles: string[];
  workType: string[];
  jobLocations: string[];
  excludedCompanies: string[];
   
   
  // primaryJobTitle: string[];
  // secondaryJobTitle: string[];
  // jobLocationPreference: string[];
  // excludedJobTitleKeywords: string[];
  // avoidedJobTitleWords: string[];
  // excludedCompanies: string[];
  // specificIndustriesTechnologies: string[];
  // excludedIndustriesTechnologies: string[];
  // jobLocations: string[];
}
