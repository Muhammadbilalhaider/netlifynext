// src/models/index.ts
import { User } from './user.model';
import { JobPreference } from './job-preference.model';
import { ExclusionPreference } from './exclusionPreference.model';
import { Job } from './job.model';
import { JobAction } from './job-action.model';
import { Plan } from './plan.model';
import { Subscription } from './subscription.model';
import { Category } from './category.model';
import { Country } from './country.model';
import { City } from './city.model';
import { State } from './state.model';
import { Company } from './company.model';
import { GlobalSetting } from './global-setting.model';


export {
  User,
  JobPreference,
  ExclusionPreference,
  Job,
  JobAction,
  Plan,
  Subscription,
  Category,
  Country,
  City,
  State,
  Company,
  GlobalSetting
};

export type {
  IUser 
} from './user.model';
export type {
  IJobPreferences 
} from './job-preference.model';
export type {
  IExclusionPreference
} from './exclusionPreference.model';
export type {
  IJob 
} from './job.model';
export type {
  IJobAction 
} from './job-action.model';
export type {
  IPlan 
} from './plan.model';
export type {
  ISubscription 
} from './subscription.model';
export type {
  ICountry 
} from './country.model';
export type {
  ICity 
} from './city.model';
export type {
  IState 
} from './state.model';