export interface appliedJobPayload {
  userId: string;
  jobId: string;
  status: number;
  notes: string;
  _id: string;
  type: string;
  application_status: string;
}

export interface getAppliedJobsPayload {
  _id: string;
  interactedJobIds: [string];
  userId: string;
  jobId: string;
  search: string;
  page: string;
  limit: string;
  type: string;
  startDate: string;
  endDate: string;
  date: string;
}

export interface getFollowJobsPayload {
  _id: string;
  followJobIds: [string];
  userId: string;
  jobId: string;
  search: string;
  page: string;
  limit: string;
  type: string;
  startDate: string;
  endDate: string;
  date: string;
}

export interface getDontAppliedJobsPayload {
  userId: string;
  date?: string;
  search?: string;
  page?: any;
  limit?: number;
  interactedJobIds?: any[];
}

export interface JobSearchParams {
  search_term: string;
  location: string;
  results_wanted: number;
  site_name: string[];
  distance: number;
  job_type: string;
  is_remote: boolean;
  linkedin_fetch_description: boolean;
  hours_old: number;
}

export interface IJob {
  id: string;
  site: string;
  job_url: string;
  job_url_direct: string;
  title: string;
  company: string;
  location: string;
  job_type: string;
  date_posted: string;
  salary_source: string;
  interval: string;
  min_amount: number;
  max_amount: number;
  currency: string;
  is_remote: boolean;
  job_level: string;
  job_function: string;
  company_industry: string;
  listing_type: string;
  // emails: string[];
  description: string;
  company_url: string;
  company_url_direct: string;
  // company_addresses: string;
  company_num_employees: string;
  company_revenue: string;
  company_description: string;
  logo_photo_url: string;
  banner_photo_url: string;
  ceo_name: string;
  ceo_photo_url: string;
}

export interface JobsSearchPayload {
  title: string;
  location?: string;
  isRemote?: boolean;
  publishedAt?: string;
  workType?: string;
}

// src/types/job.types.ts
export interface JobQueryParams {
  userId: string;
  page?: string;
  limit?: string;
  date?: string;
  startDate?: string;
  endDate?: string;
  type?: number; // For job action type/status
  search?: string;
  // filtere params
  primaryJobTitle?: string;
  secondaryJobTitle?: string;
  avoidedJobTitleWords?: string;
  excludedCompanies?: string;
  specificIndustriesTechnologies?: string;
  excludedIndustriesTechnologies?: string;
  jobLocationPreference?: string;
  jobLocations?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
  skip: number;
}

export interface ServiceResponse {
  status: number;
  status_code: number;
  message: string;
  data: any;
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
