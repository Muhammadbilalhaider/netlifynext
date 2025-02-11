import { RESPONSE_CODES, Collection } from "../config/constants";
// import { count, find, insert, update, updateMany } from '../utils/DAO';
import { getAllListingPayload, RESPONSE } from "../interfaces/commonInterfaces";
import moment from "moment-timezone";
import {
  addEditPlanPayload,
  getPlanPayload,
} from "../interfaces/planInterface";
import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import { Plan } from "../models";
import mongoose from "mongoose";

//Add plan service
export const addPlanSInDBService = async (payload: addEditPlanPayload) => {
  console.log("newplanService payload", payload);
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));
    // const planId = payload._id || new mongoose.Types.ObjectId(); // Generate an ObjectId if _id is not available
    const planId = payload.id;

    const planPayload = {
      _id: planId,
      productId: payload.product,
      nickname: payload.nickname,
      description: JSON.parse(payload.metadata.description),
      title: payload.metadata.title,
      amount: payload.unit_amount,
      currency: payload.currency,
      interval: payload.recurring.interval,
      intervalCount: payload.recurring.intervalCount,
      status: parseInt(payload.metadata.status),
      createAt: currentDate,
      isDeleted: false,
      updatedAt: currentDate,
    };

   await Plan.create(planPayload);

    return true;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

//Inactive all plans
export const inactiveAllPlansService = async () => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));

    const condition = {
      isDeleted: false,
      status: 1,
    };

    const updatePayload = {
      $set: {
        status: 0,
        // updatedAt: currentDate
      },
    };

    await Plan.updateMany(condition, updatePayload);

    return true;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Get all plans
export const plansAllListing = async (payload: getAllListingPayload) => {
  try {
    let response: RESPONSE;

    const condition: any = {
      isDeleted: false,
    };

    if (payload.search) {
      condition.$or = [
        { nickname: { $regex: payload.search, $options: "i" } },
        { title: { $regex: payload.search, $options: "i" } },
      ];
    }

    if (payload.status) {
      condition.status = parseInt(payload.status);
    }

    const pageNo = payload.page;
    const limit = payload.limit ? parseInt(payload.limit) : 100;

    const skip = (pageNo - 1) * limit;
    const page = {
      skip: skip,
      limit: limit,
    };

    const sort = {
      updatedAt: -1,
    };

    const Plans = await Plan.find(condition)
      .select({
        id: 1,
        name: 1,
        amount: 1,
        status: 1,
      })
      .skip(page.skip)
      .limit(page.limit)
      //@ts-ignore
      .sort(sort);

    response = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.stripePlanAll,
      data: Plans,
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

// Check plan exist
export const isPlanExist = async (payload: getPlanPayload) => {
  try {
    let response: RESPONSE;
    let condition = {};

    if (payload.type == "name") {
      condition = {
        // name :  { $regex: payload.name, $options: 'i' },
        nickname: payload.nickname.toLowerCase(),
        isDeleted: false,
      };
    } else if (payload.type == "edit") {
      condition = {
        _id: { $ne: payload._id },
        nickname: payload.nickname.toLowerCase(),
        isDeleted: false,
      };
    } else if (payload.type == "status") {
      condition = {
        _id: payload.planId,
        isDeleted: false,
        status: 1,
      };
    } else {
      condition = {
        _id: payload._id,
        isDeleted: false,
      };
    }
    // console.log("condition====", condition);
    const planInfo = await Plan.countDocuments(condition);

    // console.log("planInfo---", planInfo);

    if (planInfo) {
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.stripePlanIdExist,
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

//Add plan service
export const editPlanSInDBService = async (payload: addEditPlanPayload) => {
  console.log("payload in editPlanSInDBService", payload);
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));

    const condition = {
      _id: payload._id,
      isDeleted: false,
    };

    let planUpdatePayload: any = {};

    if (payload.type == "change_status") {
      planUpdatePayload = {
        $set: {
          status: parseInt(payload.status),
          updatedAt: currentDate,
        },
      };
    } else {
      planUpdatePayload = {
        $set: {
          productId: payload.product,
          nickname: payload.nickname,
          description: JSON.parse(payload.metadata.description),
          title: payload.metadata.title,
          updatedAt: currentDate,
        },
      };
    }

    await Plan.updateOne(condition, planUpdatePayload);

    return true;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};
