export interface stripePlanAddEditPayload {
    _id: string,
    type: string,
    nickname: string,
    description: [string],
    title: string,
    amount: number,
    status: string, //0.In-Active, 1. Active
    currency: string,
    interval: string,
    intervalCount: number
}

export interface stripePlanDetailPayload {
    planId: string,
}

export interface SubscriptionAddUpdatePayload {
    metadata: metadata
    plan: plan
    id: string;
    subscription: string;
    customer: string;
    status: number;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    type? : string
}

interface metadata {
    userId: string,
    planId: string,
}
interface plan {
    id: string,
}

export interface transactionPayload {
    metadata : metadata
}

export interface getTransactionPayload {
    page : string ,
    limit : string ,
    search : string,
    status : string ,
    userId : string,
    startDate : string ,
    endDate : string
}