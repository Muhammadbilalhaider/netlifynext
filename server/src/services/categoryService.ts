import { RESPONSE_CODES, Collection } from "../config/constants";
// import { count, find, findOne, insert, update, updateMany, } from '../utils/DAO';
import { RESPONSE } from "../interfaces/commonInterfaces";
import moment from "moment-timezone";
import { ObjectId } from "mongodb";
import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import {
  addCategoryPayload,
  editCategoryPayload,
  getCategoryPayload,
} from "../interfaces/categoryInterface";
import { Category } from "../models";

// Check category exist
export const isCategoryExist = async (payload: getCategoryPayload) => {
  try {
    let response: RESPONSE;
    let condition = {};

    if (payload.type == "name") {
      condition = {
        // name :  { $regex: payload.name, $options: 'i' },
        name: payload.name.toLowerCase(),
        isDeleted: false,
      };
    } else if (payload.type == "edit") {
      condition = {
        _id: { $ne: new ObjectId(payload._id) },
        name: payload.name.toLowerCase(),
        isDeleted: false,
      };
    } else {
      condition = {
        _id: new ObjectId(payload._id),
        isDeleted: false,
      };
    }

    const categoryInfo = await Category.countDocuments(condition);

    if (categoryInfo) {
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.categoryIdExist,
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

//Add category
export const addCategory = async (payload: addCategoryPayload) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));
    const categoryInfo = {
      name: payload?.name.toLowerCase(),
      count: 0,
      createAt: currentDate,
      isDeleted: false,
      updatedAt: currentDate,
    };
    Category.create(categoryInfo);

    return true;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Get category Detail
export const categoryDetail = async (payload: getCategoryPayload) => {
  try {
    let response: RESPONSE;

    const condition = {
      _id: new ObjectId(payload._id),
      isDeleted: false,
    };

    const categoryInfo = await Category.findOne(condition);
    if (categoryInfo) {
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.categoryDetail,
        data: categoryInfo,
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

// Get all category
export const categoryAll = async (payload?: getCategoryPayload) => {
  try {
    let response: RESPONSE;

    const condition: any = {
      isDeleted: false,
    };

    if (payload.type == "cron") {
      condition.count = { $gt: 0 };
    }

    if (payload?.search) {
      condition.name = { $regex: payload?.search, $options: "i" };
    }

    const pageNo = payload?.page ? payload.page : 1;
    const limit = payload?.limit ? parseInt(payload.limit) : 0;

    const skip = (pageNo - 1) * limit;
    const page = {
      skip: skip,
      limit: limit,
    };

    const sort = {
      updatedAt: -1,
    };

    const categoryInfo = await Category.find(condition)
      .select({ name: 1, isDeleted: 1 }) // field projection
      .skip(page.skip)
      .limit(page.limit)
      //@ts-ignore
      .sort(sort);

    response = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.categoryAll,
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

//Edit category
export const editCategory = async (payload: editCategoryPayload) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));

    const condition = {
      _id: new ObjectId(payload._id),
      isDeleted: false,
    };

    const categoryPayload = {
      name: payload?.name.toLowerCase(),
      updatedAt: currentDate,
    };

    await Category.updateOne(condition, { $set: categoryPayload });

    const response = {
      status: 1,
      status_code: RESPONSE_CODES.POST,
      message: RESPONSE_MESSAGES.categoryUpdate,
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

//Delete category
export const deleteCategory = async (payload: editCategoryPayload) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));

    const condition = {
      _id: new ObjectId(payload._id),
      isDeleted: false,
    };

    const categoryPayload = {
      isDeleted: true,
      updatedAt: currentDate,
    };

    await Category.updateOne(condition, { $set: categoryPayload });

    const response = {
      status: 1,
      status_code: RESPONSE_CODES.POST,
      message: RESPONSE_MESSAGES.categoryDelete,
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

// Update category preference count
export const updateCategoryCount = async (payload: {
  titles: string[];
  action: "increase" | "decrease";
}) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));

    const condition: any = {
      name: {
        $in: payload.titles,
      },
      isDeleted: false,
    };

    if (payload.action === "increase") {
      condition.count = {
        $gte: 0,
      };
    } else {
      condition.count = {
        $gt: 0,
      };
    }

    // Choose the update operation based on the action (increase or decrease)
    const updateAction =
      payload.action === "increase"
        ? { $inc: { count: 1 }, $set: { updatedAt: currentDate } }
        : { $inc: { count: -1 }, $set: { updatedAt: currentDate } };

    // Update the count
    const data = await Category.updateMany(condition, updateAction);

    const response = {
      status: 1,
      status_code: RESPONSE_CODES.POST,
      message: `Category count ${
        payload.action === "increase" ? "increased" : "decreased"
      } successfully`,
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
