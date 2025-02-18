import {
  RESPONSE_CODES,
  Collection,
  USER_TYPE,
  REGISTRATION_STEP,
  otp,
  expireOtpInMilliseconds,
  SUBSCRIPTION_STATUS,
  JOB_STATUS,
} from "../config/constants";
import {
  userDetailServicePayload,
  resetPasswordPayload,
  updateUserPayload,
  userRegisterPayload,
  changesStatusPayload,
  getAllUsersPayload,
  JobPreferencesPayload,
  deleteUserPayload,
} from "../interfaces/userInterfaces";
import { RESPONSE } from "../interfaces/commonInterfaces";
import moment from "moment-timezone";
import { generateHash } from "../utils/jwt";
import { ObjectId } from "mongodb";
import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import { OTPPayload } from "../interfaces/authInterfaces";
import { ExclusionPreference, Job, JobPreference, User } from "../models";
import { UpdateSettingsDto } from "../interfaces/updateSetting";

// Get user detail
export const userDetail = async (payload: userDetailServicePayload) => {
  try {
    let user_params: any;
    let response: RESPONSE;

    let project = {};

    if (payload.type == "id") {
      user_params = {
        _id: payload._id
          ? new ObjectId(payload._id)
          : new ObjectId(payload.userId),
        isDeleted: false,
      };
      project = {
        password: 0,
      };
    } else if (payload.type == "number") {
      user_params = {
        number: payload.number,
        isDeleted: false,
      };
    } else if (payload.type == "userId") {
      user_params = {
        id: payload.id,
        isDeleted: false,
      };
      project = {
        id: 1,
        skills: 1,
        noOfProjectAssign: 1,
        assignProjects: 1,
      };
    } else {
      user_params = {
        email: payload.email.toLowerCase(),
        isDeleted: false,
      };
    }

    const user_details = await User.findOne(user_params, project);
    if (user_details) {
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.userDetailListing,
        data: user_details,
      };
    } else {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: payload.type
          ? RESPONSE_MESSAGES.noDataFound
          : RESPONSE_MESSAGES.emailNotFound,
      };
    }

    return response;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Change password
export const changePasswordService = async (payload: resetPasswordPayload) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));
    const password = payload.password;
    const hashPassword = await generateHash(`${password}`);

    const condition = {
      _id: new ObjectId(payload._id),
      isDeleted: false,
    };

    const userUpdateInfo = {
      password: hashPassword,
      updatedAt: currentDate,
      linkHash: null,
    };

    User.updateOne(condition, { $set: userUpdateInfo });

    const response = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.passwordUpdated,
    };

    return response;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Update user linkHash
export const updateLinkHashService = async (payload: updateUserPayload) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));

    const condition = {
      _id: new ObjectId(payload._id),
      isDeleted: false,
    };

    const userUpdateInfo = {
      linkHash: payload.linkHash,
      isVerified: 1,
      updatedAt: currentDate,
    };

    User.updateOne(condition, { $set: userUpdateInfo });

    return true;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

//User register
export const userRegisterService = async (payload: userRegisterPayload) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));
    const password = payload.password;
    const hashPassword = await generateHash(`${password}`);

    const registerPayload = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      // name: `${payload.firstName} ${payload.lastName}`,
      email: payload.email.toLowerCase(),
      password: hashPassword,
      number: payload.number ? payload.number : "",
      // DOB: payload.DOB ? payload.DOB : "",
      // country: payload.country ? payload.country : "",
      status: 1, //REGISTRATION_STEP.basicInfo,
      type: USER_TYPE.user,
      linkHash: null,
      isVerified: 0,
      isSubscribed: 0,
      // createAt: currentDate,
      isDeleted: false,
      // updatedAt: currentDate,
    };
    const userInfo = await User.create(registerPayload);

    const response = {
      status: 1,
      status_code: RESPONSE_CODES.POST,
      message: RESPONSE_MESSAGES.registrationCompleted,
      data: {
        _id: userInfo._id,
        // _id: userInfo.insertedId
      },
    };

    return response;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Change status
export const changesStatusService = async (payload: changesStatusPayload) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));

    const condition = {
      _id: new ObjectId(payload._id),
      isDeleted: false,
      type: USER_TYPE.user,
    };

    let userUpdateInfo: any = {
      status: payload.status,
      updatedAt: currentDate,
    };

    User.updateOne(condition, { $set: userUpdateInfo });

    return true;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Get all users
export const usersAllService = async (payload: getAllUsersPayload) => {
  try {
    let response: RESPONSE;

    const condition: any = {
      type: USER_TYPE.user,
      isDeleted: false,
    };

    if (payload.search) {
      condition.$or = [
        { name: { $regex: payload.search, $options: "i" } },
        { email: { $regex: payload.search, $options: "i" } },
        { number: { $regex: payload.search, $options: "i" } },
        { country: { $regex: payload.search, $options: "i" } },
      ];
    }

    const pageNo = payload.page;
    const limit = payload.limit ? parseInt(payload.limit) : 100;

    const skip = (pageNo - 1) * limit;
    const page = {
      skip: skip,
      limit: limit,
    };

    const projection = {
      password: 0,
      linkHash: 0,
      isVerified: 0,
    };

    const sort = {
      updatedAt: -1,
    };

    // const categoryInfo = await User.find(condition, projection, page, sort);
    const categoryInfo = await User.find(condition, projection)
      .skip(skip)
      .limit(limit)
      //@ts-ignore
      .sort(sort);

    response = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.usersAll,
      data: categoryInfo,
    };

    return response;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// // Send opt
// export const sendVerificationCode = async (payload: OTPPayload) => {
//     try {
//         const currentTime = parseInt(moment().tz(process.env.Timezone).format("x"));

//         let condition = {
//             email: payload.email.toLowerCase(),
//             isDeleted: false
//         };

//         const updateData: any = {
//             updatedAt: currentTime,
//             isVerified: false,
//             otp: otp(),
//             expiryTime: moment().valueOf() + expireOtpInMilliseconds,
//         };

//         const insertData: any = {
//             createAt: currentTime,
//             isDeleted: false,
//         };

//         const options = {
//             upsert: true,
//         };

//         User.updateOne(condition, { $set: updateData, $setOnInsert: insertData }, options);

//         return updateData.otp;
//     } catch (error) {
//         throw {
//             status: 0,
//             status_code: RESPONSE_CODES.ERROR,
//             message: error.message,
//         };
//     }
// };
export const sendVerificationCode = async (payload: OTPPayload) => {
  try {
    const currentTime = parseInt(moment().tz(process.env.Timezone).format("x"));

    let condition = {
      email: payload.email.toLowerCase(),
      isDeleted: false,
    };

    const otpCode = otp(); // Generate OTP

    const updateData: any = {
      updatedAt: currentTime,
      isVerified: false,
      otp: otpCode, // Update OTP here
      expiryTime: moment().valueOf() + expireOtpInMilliseconds, // Set expiry time
    };

    const insertData: any = {
      createdAt: currentTime, // Make sure createdAt is set properly
      isDeleted: false,
    };

    const options = {
      upsert: true,
    };

    // Ensure the operation is awaited
    await User.updateOne(
      condition,
      { $set: updateData, $setOnInsert: insertData },
      options
    );

    return otpCode; // Return the OTP that was sent to the user
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// // Get otp details
// export const getOtpDetail = async (payload: OTPPayload) => {
//     try {
//         let response = {};

//         const condition = {
//             email: payload.email.toLowerCase(),
//             isVerified: 0,
//             isDeleted: false,
//         };

//         const projection = { otp: 1, userId: 1, _id: 1, expiryTime: 1, email: 1 };

//         const otpDetails = await User.findOne(condition, projection);
//         console.log('OTP Details:', otpDetails);

//         if (otpDetails) {
//             response = {
//                 status: 1,
//                 status_code: RESPONSE_CODES.GET,
//                 message: RESPONSE_MESSAGES.otpDetail,
//                 data: otpDetails,
//             };
//         } else {
//             response = {
//                 status: 0,
//                 status_code: RESPONSE_CODES.NOT_FOUND,
//                 message: RESPONSE_MESSAGES.noDataFound,
//             };
//         }

//         return response;
//     } catch (error) {
//         throw {
//             status: 0,
//             status_code: RESPONSE_CODES.ERROR,
//             message: error.message,
//         };
//     }
// };

export const getOtpDetail = async (payload: OTPPayload) => {
  try {
    let response = {};

    const condition = {
      email: payload.email.toLowerCase(),
      isVerified: false,
      isDeleted: false,
    };

    const projection = { otp: 1, userId: 1, _id: 1, expiryTime: 1, email: 1 };

    const otpDetails = await User.findOne(condition, projection);
    if (otpDetails) {
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.otpDetail,
        data: otpDetails,
      };
    } else {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.noDataFound,
      };
    }

    return response;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Update otp status
// export const updateOtpStatus = async (payload: OTPPayload) => {
//     try {
//         const currentTime = parseInt(moment().tz(process.env.Timezone).format("x"));

//         let condition = {
//             email: payload.email,
//         };

//         const updateData: any = {
//             updatedAt: currentTime,
//             isVerified: true,
//         };

//         const options = {};

//         User.updateOne(condition, { $set: updateData }, options);

//         return true;
//     } catch (error) {
//         throw {
//             status: 0,
//             status_code: RESPONSE_CODES.ERROR,
//             message: error.message,
//         };
//     }
// };
export const updateOtpStatus = async (payload: OTPPayload) => {
  try {
    const currentTime = parseInt(moment().tz(process.env.Timezone).format("x"));

    let condition = {
      email: payload.email,
    };

    const updateData: any = {
      updatedAt: currentTime,
      isVerified: true,
    };

    const options = {};

    // Ensure we await the update operation to complete
    await User.updateOne(condition, { $set: updateData }, options);

    return true;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Update user status
export const updateUserStatusService = async (
  payload: changesStatusPayload
) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));
    let condition: any;

    let userUpdateInfo: any = {
      updatedAt: currentDate,
    };

    if (payload.type == "active_subscription") {
      condition = {
        _id: new ObjectId(payload.metadata.userId),
        isDeleted: false,
      };
      userUpdateInfo.isSubscribed = 1;
    } else if (payload.type == "expired_subscription") {
      condition = {
        _id: new ObjectId(payload.metadata.userId),
        isDeleted: false,
      };
      userUpdateInfo.isSubscribed = 0;
    } else {
      condition = {
        _id: new ObjectId(payload._id),
        isDeleted: false,
        type: USER_TYPE.user,
      };
      userUpdateInfo.isVerified = 1;
    }

    User.updateOne(condition, { $set: userUpdateInfo });

    return true;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Add Job Preferences
export const addJobPreferencesService = async (
  payload: JobPreferencesPayload
) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));

    const condition = {
      _id: new ObjectId(payload._id),
      isDeleted: false,
      type: USER_TYPE.user,
    };

    const preferencesPayload = {
      jobLocationPreference: payload.jobLocationPreference,
      jobLocations: payload.jobLocations,
      primaryJobTitle: payload.primaryJobTitle,
      secondaryJobTitle: payload.secondaryJobTitle,
      excludedJobTitleKeywords: payload.excludedJobTitleKeywords,
      avoidedJobTitleWords: payload.avoidedJobTitleWords,
      excludedCompanies: payload.excludedCompanies,
      specificIndustriesTechnologies: payload.specificIndustriesTechnologies,
      excludedIndustriesTechnologies: payload.excludedIndustriesTechnologies,
      // confidentInResume: payload.confidentInResume,
      // personalWebsite: payload.personalWebsite,
      // interestedInCommunity: payload.interestedInCommunity,
      status: 1,
      updatedAt: currentDate,
    };

    User.updateOne(condition, { $set: preferencesPayload });

    return true;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Update User Profile
export const updateUserProfileService = async (payload: updateUserPayload) => {
  console.log("payload in updateUserProfileService", payload);
  try {
    const condition = {
      _id: new ObjectId(payload._id),
      isDeleted: false,
    };

    const updateData = {
      firstName: payload.firstName,
      lastName: payload.lastName,
      name: `${payload.firstName} ${payload.lastName}`,
      // number: payload.number,
      // DOB: payload.DOB,
      // country: payload.country
    };

    await User.updateOne(condition, { $set: updateData });

    return true;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

//Delete user
export const deleteUser = async (payload: deleteUserPayload) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));

    const condition = {
      _id: new ObjectId(payload._id),
      isDeleted: false,
    };

    const userPayload = {
      isDeleted: true,
      updatedAt: currentDate,
    };

    User.updateOne(condition, { $set: userPayload });

    const response = {
      status: 1,
      status_code: RESPONSE_CODES.POST,
      message: RESPONSE_MESSAGES.userDelete,
    };

    return response;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// // Get User Profile
export const userProfileDetail = async (
  payload: userDetailServicePayload
): Promise<RESPONSE> => {
  try {
    const userAggregation = [
      {
        $match: {
          _id: new ObjectId(payload._id),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: Collection.jobPreferences,
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] },
                // isDeleted: false,
              },
            },
          ],
          as: "jobPreferences",
        },
      },
      {
        $unwind: { path: "$jobPreferences", preserveNullAndEmptyArrays: true },
      },

      {
        $lookup: {
          from: Collection.exclusionPreferences,
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] },
                // isDeleted: false,
              },
            },
          ],
          as: "exclusionPreferences",
        },
      },
      {
        $unwind: {
          path: "$exclusionPreferences",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "subscriptions",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] },
                // isDeleted: false,
                // status: 1,
              },
            },
            {
              $project: {
                _id: 1,
                planId: 1,
                currentPeriodStart: 1,
                currentPeriodEnd: 1,
              },
            },
          ],
          as: "subscriptions",
        },
      },
      { $unwind: { path: "$subscriptions", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "plans",
          let: { planId: "$subscriptions.planId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$planId"] },
                isDeleted: false,
              },
            },
            {
              $project: {
                _id: 1,
                nickname: 1,
                amount: 1,
                interval: 1,
                intervalCount: 1,
              },
            },
          ],
          as: "plans",
        },
      },
      { $unwind: { path: "$plans", preserveNullAndEmptyArrays: true } },

      {
        $lookup: {
          from: "jobactions",
          let: { userId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] },
                isDeleted: false,
              },
            },
            {
              $project: {
                status: 1,
              },
            },
          ],
          as: "jobActions",
        },
      },

      {
        $addFields: {
          name: { $concat: ["$firstName", " ", "$lastName"] },
          primaryJobTitle: {
            $ifNull: ["$jobPreferences.primaryJobTitles", []],
          },
          secondaryJobTitle: {
            $ifNull: ["$jobPreferences.secondaryJobTitles", []],
          },
          jobLocationPreference: {
            $ifNull: ["$jobPreferences.jobLocationPreferences", []],
          },
          jobLocations: {
            $ifNull: ["$jobPreferences.jobLocations", []],
          },
          excludedJobTitleKeywords: {
            $ifNull: ["$exclusionPreferences.excludedJobTitleKeywords", []],
          },
          excludedCompanies: {
            $ifNull: ["$exclusionPreferences.excludedCompanies", []],
          },
          excludedIndustriesTechnologies: {
            $ifNull: ["$exclusionPreferences.excludedDescriptionKeywords", []],
          },
          specificIndustriesTechnologies: {
            $ifNull: ["$exclusionPreferences.requiredDescriptionKeywords", []],
          },
          avoidedJobTitleWords: {
            $ifNull: ["$exclusionPreferences.avoidedJobTitleWords", []],
          },
          // avoidedJobTitleWords: [
          //     "Junior", "Chief", "Vice President", "VP", "Coordinator",
          //     "Intern", "Graduate", "Chief", "Executive", "Supervisor",
          //     "Early Career"
          // ],
          applied_count: {
            $size: {
              $filter: {
                input: "$jobActions",
                as: "action",
                cond: { $eq: ["$$action.status", 1] },
              },
            },
          },
          followup_count: {
            $size: {
              $filter: {
                input: "$jobActions",
                as: "action",
                cond: { $eq: ["$$action.status", 2] },
              },
            },
          },
          createAt: "$createdAt",
        },
      },

      // First remove unwanted fields
      {
        $project: {
          jobPreferences: 0,
          exclusionPreferences: 0,
          jobActions: 0,
          password: 0,
          createdAt: 0,
        },
      },

      // Then include needed fields
      {
        $project: {
          _id: 1,
          firstName: 1,
          lastName: 1,
          name: 1,
          email: 1,
          status: 1,
          type: 1,
          linkHash: 1,
          isVerified: 1,
          isSubscribed: 1,
          createAt: 1,
          isDeleted: 1,
          updatedAt: 1,
          primaryJobTitle: 1,
          secondaryJobTitle: 1,
          jobLocationPreference: 1,
          jobLocations: 1,
          excludedJobTitleKeywords: 1,
          excludedCompanies: 1,
          excludedIndustriesTechnologies: 1,
          specificIndustriesTechnologies: 1,
          avoidedJobTitleWords: 1,
          subscription: 1,
          plans: 1,
          applied_count: 1,
          followup_count: 1,
        },
      },
    ];

    const [userDetails] = await User.aggregate(userAggregation);
    if (userDetails) {
      return {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.userDetailListing,
        data: userDetails,
      };
    }

    return {
      status: 0,
      status_code: RESPONSE_CODES.NOT_FOUND,
      message: payload.type
        ? RESPONSE_MESSAGES.noDataFound
        : RESPONSE_MESSAGES.emailNotFound,
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// avoidedJobTitleWords
export const updateSettings = async ( userId: string, settings: UpdateSettingsDto) => {
  console.log("settings ==>", settings);
  try {
    // Update JobPreference
    console.log("with respect to user Id", userId);
    const jobPreference = await JobPreference.findOneAndUpdate(
      { userId },
      {
        $set: {
          resumeContent: settings.resume,
          jobpreference: settings.jobPreferences,
          primaryJobTitles: settings.primaryJobTitles,
          secondaryJobTitles: settings.secondaryJobTitles,
          workType: settings.workType,
          jobLocations: settings.jobLocations,
        },
      },
      { new: true, upsert: true }
    );

    // Update ExclusionPreference
    const exclusionPreference = await ExclusionPreference.findOneAndUpdate(
      { userId },
      {
        $set: {
          excludedJobTitleKeywords: [
            //   ...settings.excludedJobTitleKeywords,
            ...settings.excludedJobTitleKeywords,
          ],
          excludedCompanies: settings.excludedCompanies,
          excludedTechnologies: settings.excludedTechnologies,
          requiredTechnologies: settings.requiredTechnologies,
        },
      },
      { new: true, upsert: true }
    );

    return {
      jobPreference,
      exclusionPreference,
    };
  } catch (error) {
    throw new Error(`Failed to update settings: ${error.message}`);
  }
};
