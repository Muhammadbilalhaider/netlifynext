import moment from "moment-timezone";
import stripePackage from "stripe";

import {
  RESPONSE_CODES,
  Collection,
  SUBSCRIPTION_STATUS,
} from "../config/constants";
import { RESPONSE } from "../interfaces/commonInterfaces";
import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import {
  getTransactionPayload,
  stripePlanAddEditPayload,
  stripePlanDetailPayload,
  SubscriptionAddUpdatePayload,
  transactionPayload,
} from "../interfaces/stripePlanInterfaces";
// import { aggregate, findOneAndUpdate, insert, update } from '../utils/DAO';
import { ObjectId } from "mongodb";
import { Subscription, User } from "../models";
import dotenv from "dotenv";
dotenv.config();

const stripe = new stripePackage(process.env.STRIPE_SECRET_KEY);
// Add plan
export const addStripePlanService = async (
  payload: stripePlanAddEditPayload
) => {
  console.log("payload in addStripePlanService", payload);
  try {
    const addPriceInfo: any = {
      unit_amount: payload.amount * 100, // Amount in cents
      currency: payload.currency,
      recurring: {
        interval: payload.interval,
        interval_count: payload.intervalCount,
      },
      product: process.env.PRODUCT_ID,
      nickname: payload.nickname.toLowerCase(),
      metadata: {
        description: JSON.stringify(payload.description),
        title: payload.title,
        status: payload.status,
      },
    };

    await stripe.prices.create(addPriceInfo);

    const response = {
      status: 1,
      status_code: RESPONSE_CODES.POST,
      message: RESPONSE_MESSAGES.stripePlanAdded,
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

// Edit plan
export const editStripePlanService = async (
  payload: stripePlanAddEditPayload
) => {
  console.log("edit StripPlanService payload", payload);
  try {
    let updatePlanInfo: any = {
      nickname: payload?.nickname?.toLowerCase(),
      metadata: {
        description: JSON.stringify(payload.description),
        title: payload.title,
      },
    };

    if (payload.type == "change_status") {
      updatePlanInfo = {
        metadata: {
          status: JSON.stringify(payload.status),
        },
      };
    }

    const plans = await stripe.prices.update(payload._id, updatePlanInfo);

    const response = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.stripePlanUpdate,
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

// Create checkout session service
export const checkoutSessionService = async (
  payload: stripePlanDetailPayload,
  userInfo: any
) => {
  try {
    let response: RESPONSE;

    const plan = await stripe.prices.retrieve(payload.planId);

    if (plan) {
      let success_url = `${process.env.stripe_web_base_url}?success=true`;
      let cancel_url = `${process.env.stripe_web_base_url}?canceled=true`;

      let options: any = {
        line_items: [
          {
            price: payload.planId,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${success_url}`,
        cancel_url: `${cancel_url}`,
        metadata: {
          userId: `${userInfo._id}`,
          planId: payload.planId,
        },
      };

      const session = await stripe.checkout.sessions.create(options);

      response = {
        status: 1,
        status_code: RESPONSE_CODES.POST,
        message: RESPONSE_MESSAGES.stripeCheckoutSession,
        data: {
          session_url: `${session.url}`,
        },
      };
    }

    return response;
  } catch (error) {
    console.log("error", error);
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Add subscription service
export const addSubscriptionService = async (
  payload: SubscriptionAddUpdatePayload
) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));

    const subscriptionPayload = {
      userId: null,
      planId: payload.plan.id,
      subscriptionId: payload.id,
      customerId: payload.customer,
      status: 1,
      currentPeriodStart: (payload.currentPeriodStart *= 1000),
      currentPeriodEnd: (payload.currentPeriodEnd *= 1000),
      createAt: currentDate,
      isDeleted: false,
      updatedAt: currentDate,
    };

    await Subscription.create(subscriptionPayload);

    return true;
  } catch (err) {
    return {
      status: 0,
      statusCode: RESPONSE_CODES.ERROR,
      message: err.message,
    };
  }
};

// Update subscription service
export const addAndUpdateSubscriptionService = async (
  payload: SubscriptionAddUpdatePayload
) => {
  try {
    const currentDate = parseInt(moment().tz(process.env.Timezone).format("x"));

    const condition = {
      subscriptionId: payload.subscription ? payload.subscription : payload.id,
      isDeleted: false,
    };
    const updatePayload: any = {
      updatedAt: currentDate,
      status: SUBSCRIPTION_STATUS.active,
    };
    console.log("payload", updatePayload);
    const insertPayload = {
      planId: payload.plan?.id ? payload.plan.id : payload.metadata.planId,
      subscriptionId: payload.subscription ? payload.subscription : payload.id,
      customerId: payload.customer,
      createdAt: currentDate,
      isDeleted: false,
    };
    console.log("insertPayload", insertPayload);

    if (payload.metadata?.userId) {
      updatePayload.userId = new ObjectId(payload.metadata.userId);
    }
    if (payload.currentPeriodStart) {
      updatePayload.currentPeriodStart = payload.currentPeriodStart *= 1000;
    }
    if (payload.currentPeriodEnd) {
      updatePayload.currentPeriodEnd = payload.currentPeriodEnd *= 1000;
    }

    if (payload.type == "expired_subscription") {
      updatePayload.status = SUBSCRIPTION_STATUS.expired;
    }
    const options = {
      upsert: true,
      returnOriginal: false,
    };
    const result = await Subscription.findOneAndUpdate(
      condition,
      { $set: updatePayload, $setOnInsert: insertPayload },
      options
    );

    if (payload.metadata?.userId) {
      await User.findOneAndUpdate(
        { _id: new ObjectId(payload.metadata.userId) },
        { isSubscribed: 1 }
      );
    }

    return result;
  } catch (err) {
    throw {
      status: 0,
      statusCode: RESPONSE_CODES.ERROR,
      message: err.message,
    };
  }
};

// Get All Subscriptions
export const subscriptionListing = async (payload: getTransactionPayload) => {
  try {
    const pageNo = payload.page ? parseInt(payload.page) : 1;
    const limit = payload.limit ? parseInt(payload.limit) : 1;
    const startDate = payload.startDate;
    const endDate = payload.endDate;

    let searchRegex = new RegExp(payload.search, "i");
    const matchConditions: any = {
      isDeleted: false,
    };

    if (payload.userId) {
      matchConditions.userId = new ObjectId(payload.userId);
    }

    if (payload.status) {
      matchConditions.status = parseInt(payload.status);
    }

    if (startDate && endDate) {
      let unixStartDate: any = moment
        .tz(startDate, "DD-MM-YYYY", process.env.Timezone)
        .startOf("day");
      let unixEndDate: any = moment
        .tz(endDate, "DD-MM-YYYY", process.env.Timezone)
        .endOf("day");

      unixStartDate = unixStartDate.valueOf();
      unixEndDate = unixEndDate.valueOf();

      matchConditions.$and = [
        { currentPeriodStart: { $gte: unixStartDate } },
        { currentPeriodStart: { $lte: unixEndDate } },
      ];
    }

    const condition = [
      { $match: matchConditions },
      { $skip: (pageNo - 1) * limit },
      { $limit: limit },
      {
        $lookup: {
          from: Collection.plansTableName,
          let: { planId: "$planId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$id", "$$planId"] },
                isDeleted: false,
              },
            },
            {
              $project: {
                nickname: 1,
                amount: 1,
                interval: 1,
                intervalCount: 1,
              },
            },
          ],
          as: "plan",
        },
      },
      { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: Collection.userTableName,
          let: { userId: "$userId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$_id", "$$userId"] },
                deleted_at: null,
              },
            },
            {
              $project: { name: 1 },
            },
          ],
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $match: searchRegex
          ? {
              $or: [
                { "plan.nickname": searchRegex },
                { "user.name": searchRegex },
              ],
            }
          : {},
      },
      { $sort: { updatedAt: -1 } },
    ];

    //@ts-ignore
    const subscriptions = await Subscription.aggregate(condition);

    return {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.stripePlanAll,
      data: subscriptions,
    };
  } catch (err) {
    throw {
      status: 0,
      statusCode: RESPONSE_CODES.ERROR,
      message: err.message,
    };
  }
};

export const getMonthlyRevenue = async () => {
  try {
    const currentDate = moment.tz(process.env.Timezone);
    const startDate = currentDate.clone().subtract(1, "year").startOf("month");

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const allMonths = [];
    for (let i = 0; i < 12; i++) {
      const date = startDate.clone().add(i, "month");
      allMonths.push({
        year: date.year(),
        month: monthNames[date.month()],
        totalRevenue: 0,
        count: 0,
      });
    }

    const matchConditions: any = {
      isDeleted: false,
      currentPeriodStart: {
        $gte: startDate.valueOf(),
        $lte: currentDate.endOf("month").valueOf(),
      },
    };

    const condition = [
      { $match: matchConditions },
      {
        $lookup: {
          from: Collection.plansTableName,
          let: { planId: "$planId" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$id", "$$planId"] },
                isDeleted: false,
              },
            },
            {
              $project: {
                amount: 1,
              },
            },
          ],
          as: "plan",
        },
      },
      { $unwind: { path: "$plan", preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: {
            year: { $year: { $toDate: "$currentPeriodStart" } },
            month: { $month: { $toDate: "$currentPeriodStart" } },
          },
          totalRevenue: {
            $sum: {
              $multiply: [
                { $ifNull: [{ $divide: ["$plan.amount", 100] }, 0] },
                1,
              ],
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          year: "$_id.year",
          month: "$_id.month",
          totalRevenue: 1,
          count: 1,
          _id: 0,
        },
      },
      { $sort: { year: 1, month: 1 } },
    ];

    //@ts-ignore
    const monthlyRevenue = await Subscription.aggregate(condition);

    const result = allMonths.map((month) => {
      const found = monthlyRevenue.find(
        (rev) =>
          rev.year === month.year &&
          rev.month === monthNames.indexOf(month.month) + 1
      );
      return found ? { ...found, month: month.month } : month;
    });

    return {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.graphDataResponse,
      data: result,
    };
  } catch (err) {
    throw {
      status: 0,
      statusCode: RESPONSE_CODES.ERROR,
      message: err.message,
    };
  }
};
