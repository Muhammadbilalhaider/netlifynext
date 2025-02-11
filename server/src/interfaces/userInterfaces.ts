export interface userDetailServicePayload {
  id?: string;
  _id?: string;
  email?: string;
  number?: string;
  type?: string;
  redirectionType?: number;
  userId?: string;
  linkHash?: any;
}

export interface resetPasswordPayload {
  _id: string;
  password: string;
}

export interface updateUserPayload {
  _id: string;
  linkHash: number;
  firstName?: string;
  lastName?: string;
  number?: string;
  DOB?: string;
  country?: string;
}

export interface deleteUserPayload {
  _id: string;
  name: string;
}

export interface addressPayload {
  country: string;
  state: string;
  city: string;
}

export interface userRegisterPayload {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  number: string;
  DOB: string;
  country: string;
  jobTitle: string;
  secondaryJobTitle: string;
  emailPreferences: string;
  step: number;
}

export interface changesStatusPayload {
  _id: string;
  status: string;
  type?: string;
  metadata: metadata;
}

export interface getAllUsersPayload {
  page: number;
  limit: string;
  search: string;
}

export interface OTPPayload {
  email: string;
  type: number;
}

export interface JobPreferencesPayload {
  _id: string;
  jobLocationPreference: string[];
  jobLocations: string[];
  primaryJobTitle: string;
  secondaryJobTitle: string;
  excludedJobTitleKeywords: string[];
  avoidedJobTitleWords: string[];
  excludedCompanies: string[];
  specificIndustriesTechnologies: string[];
  excludedIndustriesTechnologies: string[];
  confidentInResume: "Yes" | "No" | "Maybe";
  personalWebsite: "Yes" | "No" | "Maybe";
  interestedInCommunity: "Yes" | "No" | "Maybe";
}

interface metadata {
  userId: string;
  planId: string;
}
