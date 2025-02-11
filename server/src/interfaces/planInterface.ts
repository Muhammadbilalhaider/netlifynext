export interface addEditPlanPayload {
  id: any;
  _id: string;
  product: string;
  nickname: string;
  metadata: meta;
  title: string;
  unit_amount: number;
  currency: string;
  recurring: recurring;
  type: string;
  status: string;
}

interface meta {
  description: string;
  title: string;
  status: string;
}

interface recurring {
  aggregate_usage: null;
  interval: string;
  intervalCount: number;
  meter: null;
  trial_period_days: null;
  usage_type: string;
}

export interface getPlanPayload {
  nickname: string;
  type: string;
  _id: string;
  page: number;
  limit: string;
  search: string;
  planId: string;
}
