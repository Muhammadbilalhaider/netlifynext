export const RESPONSE_CODES = {
    GET: 200,
    PUT: 204,
    POST: 201,
    DELETE: 204,
    NOT_FOUND: 404,
    ERROR: 500,
    UNAUTHORIZED: 401,
    BAD_REQUEST: 400,
    ALREADY_EXIST: 409,
    SSO_ALREADY_EXIST: 408,
    FORBIDDEN: 403,
    INVALID_ACCOUNT_STATUS: 402,
    UNPROCESSABLE_ENTITY: 422
} as const;

export const Collection = {
    userTableName: "users",
    verificationCode: "verificationCode",
    categoryTable: "categories",
    countryTableName: 'countries',
    stateTableName: 'states',
    cityTableName: 'cities',
    companiesTableName: 'companies',
    technologiesTableName: 'technologies',
    globalSettingsTable: "globalSettings",
    configurationsTable: "configurations",
    plansTableName: "plans",
    preferencesTableName: "userPreferences",
    subscriptions: "subscriptions",
    jobsTableName : "jobs",
    jobActionTableName : "jobActions",
    exclusionPreferences: "exclusionPreferences",
    jobPreferences: "jobPreferences"
};

export const expireOtpInMilliseconds = parseInt(process.env.OTP_EXPIRE_TIME) || 300000;

// export const expireOtpInMilliseconds = 300000;

export const otp = function otp() {
    return Math.floor(1000 + Math.random() * 9000)
}

export const TEMPLATE_TYPE = {
    forgotPassword: 1,
    emailVerification: 2
} as const;

export const USER_TYPE = {
    admin: 1,
    user: 2,
} as const;

export const REGISTRATION_STEP = {
    basicInfo: 2,
    preferences: 3,
} as const;

export const SUBSCRIPTION_STATUS = {
    active : 1,
    expired : 2
}

export const JOB_STATUS = {
    applied : 1,
    followed : 2,
    doNotApply : 3,
    dailyJobs: 4,
}