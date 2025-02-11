export const RESPONSE_MESSAGES = {

    // Error message
    missingAuthToken: 'Authorization token is missing!',
    invalidToken: 'Invalid Token!',
    invalidRequest: "Invalid Request!",
    invalidId: "Invalid id!",
    noDataFound: "No data found!",
    emailNotFound: "Email not found!",
    clickOnForgotPassword: "To reset your password.First you have to forgot password!",
    emailAlreadyExist: "Email already exist!",
    inactiveUser: "Your account has been in-activate by admin.To active again contact Admin!",
    unauthorized: "unauthorized",

    // Auth success
    tokenVerified: 'Token verified.',
    passwordUpdated: "Password updated successfully",
    loginSuccess: "Logged In Successfully.",
    forgotPasswordSuccess: "Forgot password link sent on your email",
    userExist: "User exist on our portal",

    // Auth failure
    wrongPassword: "Password does not match!",

    // User success
    userDetailListing: "User detail listing.",
    registrationCompleted: "User registered successfully.",
    registration2Completed: "Registration step-2 completed.",
    registration3Completed: "Registration step-3 completed.",
    userStatusActive: "User status active.",
    userStatusInActive: "User status in-active.",
    usersAll: "Users listing.",
    preferencesAdded: "User preferences added.",
    userProfileUpdatedSuccessMsg : "User profile updated successfully",
    userDelete: "User deleted successfully.",

    // User failure
    alreadyCompleteStep2: "You have already completed registration step-2",
    alreadyCompleteStep3: "You have already completed registration step-3",
    userNotFound: "User not found!",

    // Category failure
    categoryIdExist: "Category already Exist!",
    categoryNameExist: "Category name already Exist!",

    // Category success
    categoryAdded: "Category added successfully.",
    categoryUpdate: "Category updated successfully.",
    categoryDelete: "Category deleted successfully.",
    categoryDetail: "Category detail listing.",
    categoryAll: "Categories listing.",

    // Company failure
    companyIdExist: "Company already Exist!",
    companyNameExist: "Company name already Exist!",

    // Company success
    companyAdded: "Company added successfully.",
    companyAll: "Companies listing.",

    // Technology failure
    technologyIdExist: "Technology already Exist!",
    technologyNameExist: "Technology name already Exist!",

    // Technology success
    technologyAdded: "Technology added successfully.",
    technologyAll: "Technologies listing.",

    // Country state city
    countryListing: "Country listing.",
    stateListing: "States listing.",
    cityListing: "Cities listing.",
    countryAdded: "Countries added successfully.",
    stateAdded: "States added successfully.",
    cityAdded: "Cities added successfully.",
    allAdded: "All Counties, States, Cities added successfully",

    // Otp Success
    otpDetail: "Otp details.",
    otpSend: "Otp sent on registered email.",
    otpVerified: "Otp verified.",

    // Otp failure
    otpNotVerified: "Otp not verified!",

    // Global settings
    globalSettingsSuccess: `Global settings added or updated successfully.`,
    globalSettingsDetail: `Global settings details.`,

    // Configuration settings
    configurationSuccess: `Configuration added or updated successfully.`,
    configurationAll: `Configuration listing.`,

    // Stripe success
    stripePlanAdded: "Stripe plan added successfully.",
    stripePlanAll: "Stripe plans listing.",
    stripePlanDetail: "Stripe plan details.",
    stripePlanDelete: "Stripe plan deleted successfully.",
    stripePlanUpdate: "Stripe plan updated successfully.",
    stripePlaneStatusChange: "Stripe plan status updated successfully.",
    stripeCheckoutSession: "Checkout-session confirmed successfully",
    graphDataResponse: "Total monthly revenue",

    // Stripe failure
    stripePlanExist: "Stripe plan already Exist!",
    stripePlanNameExist: "Stripe plan name already Exist!",
    stripePlanIdExist: "Stripe plan id already Exist!",
    stripePlanDeleteError: "Stripe plan delete error!",
    InvalidPlanId: "Invalid plan id!",
    InActiveStripePlan : "In-active stripe plan",
    UserHasAlreadyActiveSubscription : "User already has an active subscription.",

    // Dashboard
    countFetchedSuccessMsg : "Count fetched successfully.",

    // Jobs 
    jobFetchedSuccessMsg : "Job fetched successfully.",
    jobAddedSuccessMsg : "Job Added Successfully",
    jobAppliedSuccessMsg : "Job Applied Successfully",
    userAppliedAndFollowedJobRetrieveSuccessMsg : "User's applied and followed jobs retrieved successfully",
    userAppliedAndFollowedSuccessMsg : "User job applied & followed successfully",
    userAlreadyAppliedForThisJob : "User already applied for this job!!",
    jobUpdatedSuccessMsg : "Job updated successfully",
    jobPreferenceUpdatedSuccessMsg : "Job preference updated successfully",
    userInteractedJob: "User interacted jobs.",
    userFollowJob: "User follow-up jobs."
    



} as const;