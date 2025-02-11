// src/types/settings.types.ts
export interface UpdateSettingsDto {
  primaryJobTitle: string[];
  secondaryJobTitle: string[];
  jobLocationPreference: string[];
  excludedJobTitleKeywords: string[];
  avoidedJobTitleWords: string[];
  excludedCompanies: string[];
  specificIndustriesTechnologies: string[];
  excludedIndustriesTechnologies: string[];
  jobLocations: string[];
}
