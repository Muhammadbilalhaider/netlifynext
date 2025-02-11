import bcrypt from "bcryptjs";
import { RESPONSE_CODES, expireOtpInMilliseconds, otp, Collection, } from "../config/constants";
// import { findOne, update, insert } from "../utils/DAO";
import {
  comparePasswordPayload, OTPPayload, updateUser,
  userDetailServicePayload
} from "../interfaces/authInterfaces";
import { RESPONSE } from "../interfaces/commonInterfaces";
import moment from "moment-timezone";
import { ObjectId } from "mongodb";
import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import { Job } from "../models";

// Compare user password
export const comparePassword = async (userInfo: comparePasswordPayload) => {
  try {
    let response: RESPONSE;

    if (bcrypt.compareSync(userInfo.password, userInfo.userPassword)) {

      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.loginSuccess,
      };

    } else {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.wrongPassword,
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

// Get user profile
export const userProfile = async (payload: userDetailServicePayload) => {
  try {
    let response: RESPONSE;

    let user_params:any = {
      _id: new ObjectId(payload.userId),
      linkHash: parseInt(payload.linkHash),
      isDeleted: false
    };

    if(payload.type == "email"){
      user_params = {
        email: payload.email,
        isDeleted: false
      };
    }

    const project = { email: 1 };


    const user_details = await Job.findOne(user_params, project);

    if (user_details) {
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.userExist,
        data: user_details
      };
    } else {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.noDataFound
      };
    }

    return response
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message
    };
  }
};
