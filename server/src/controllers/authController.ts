import { Request, Response } from "express";
import moment from 'moment-timezone';
import { otp, RESPONSE_CODES, TEMPLATE_TYPE, USER_TYPE } from "../config/constants";
import { comparePassword, userProfile } from "../services/authServices";
import { changePasswordService, getOtpDetail, sendVerificationCode, updateLinkHashService, updateOtpStatus, updateUserStatusService, userDetail } from "../services/userServices";
import { RESPONSE } from "../interfaces/commonInterfaces";
import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import createEmailOptionsForSendMail from "../utils/mailOptions";
import { generateToken, verifyToken } from "../utils/jwt";

// User loginn
export const authLogin = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let response: RESPONSE;

    const userEmail: any = await userDetail(body);

    if (!userEmail.status) {
      response = {
        status: userEmail.status,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: userEmail.message,
      };
      return res.status(response.status_code).json(response);
    }

    const userInfo = userEmail?.data;


    body.userPassword = userInfo?.password;
    body.id = userInfo?._id;
    body.name = userInfo?.name;
    body.type = userInfo?.type;

    response = await comparePassword(body);

    if (response.status) {
      delete userInfo.password

      if (userInfo.type == USER_TYPE.admin || (userInfo.type == USER_TYPE.user && (userInfo.status == 1))) {
        const access_Token = generateToken({
          email: userInfo.email,
          id: userInfo.id,
          _id: userInfo._id,
          name: userInfo.name,
          type: userInfo.type,
        });

        userInfo.token = access_Token
      }

      if (userInfo.type == USER_TYPE.user && !userInfo.isVerified) {
        const otp: number = await sendVerificationCode(body);

        const mailPayload = {
          template_type: TEMPLATE_TYPE.emailVerification,
          otp: otp,
          name: `${body.firstName} `,
          email: body.email,
        };

        createEmailOptionsForSendMail(mailPayload);
      }

      response = {
        status: response.status,
        status_code: response.status_code,
        message: response.message,
        data: {
          _id: userInfo._id,
          status: userInfo.status,
          type: userInfo.type,
          isVerified: userInfo.isVerified,
          isSubscribed: userInfo.isSubscribed,
        }
      };

      if(userInfo.status === 1 && userInfo.isVerified === 1){
        response.data.token = userInfo.token;
      }

    }

    return res.status(response.status_code).json(response);
  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    });
  }
};

// Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let response: RESPONSE = await userDetail(body);

    if (response.status) {
      const linkHash = otp()
      const { _id, email, name } = response.data;
      const mailPayload = {
        template_type: TEMPLATE_TYPE.forgotPassword,
        email: email,
        id: _id,
        name: name,
        otp: linkHash
      };

      createEmailOptionsForSendMail(mailPayload);

      const editPayload = {
        _id: _id,
        linkHash: linkHash
      }

      updateLinkHashService(editPayload)

      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.forgotPasswordSuccess
      }
    }

    res.status(response.status_code).json(response);

  } catch (error) {
    res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message
    });
  }
};

// Check user exit on our portal
export const userProfileController = async (req: Request, res: Response) => {
  try {
    const body: any = req.query;

    const response: RESPONSE = await userProfile(body);

    return res.status(response.status_code).json(response);

  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message
    });
  }
};

// Reset password
export const resetPasswordController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let response: RESPONSE;
    body.type = "id";

    response = await userDetail(body);
    if (!response.status) {
      return res.status(response.status_code).json(response);

    }

    if (response.data.linkHash != body.linkHash) {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.BAD_REQUEST,
        message: RESPONSE_MESSAGES.clickOnForgotPassword
      };
      return res.status(response.status_code).json(response);
    }

    response = await changePasswordService(body);
    return res.status(response.status_code).json(response);
  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message
    });
  }
};

// Send otp
export const sendOtpController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let response: RESPONSE;
    let userInfo: any = await userDetail(body); // Check if user exists

    const otp: number = await sendVerificationCode(body); // Generate OTP
    let mailPayload: any;

    if (userInfo.status) {
      // If user exists
      userInfo = userInfo?.data;


      // if (body?.type === 1) {
      //   mailPayload = {
      //     template_type: TEMPLATE_TYPE.emailVerification,
      //     otp: otp,
      //     name: userInfo?.name,
      //     email: userInfo.email,
      //   };
      mailPayload = {
        template_type: TEMPLATE_TYPE.emailVerification,
        otp: otp,
        name: userInfo?.name,
        email: userInfo.email,
      };
    } else {
      // If user does not exist, still send OTP
      mailPayload = {
        template_type: TEMPLATE_TYPE.emailVerification,
        otp: otp,
        name: "User", // Generic name
        email: body.email, // Use email from request body
      };
    }

    // Send the email
    createEmailOptionsForSendMail(mailPayload);

    response = {
      status: 1,
      status_code: RESPONSE_CODES.POST,
      message: RESPONSE_MESSAGES.otpSend,
    };

    // else {
    //   response = {
    //     status: 0,
    //     status_code: RESPONSE_CODES.NOT_FOUND,
    //     message: RESPONSE_MESSAGES.noDataFound,
    //   };
    return res.status(response.status_code).json(response);
  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    });
  }
};



// Verify otp
export const otpVerifyController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    let response: RESPONSE;

    response = await getOtpDetail(body);
    // console.log("response.data.otp", response.data.otp)
    //   console.log("body.otp", body.otp)
    //   console.log("response.data.otp", typeof(response.data.otp))
    //   console.log("body.otp", typeof(body.otp))

    // if (response.status && ((response.data.otp == body.otp && moment().valueOf() <= response.data.expiryTime) || body.otp == process.env.OTP)) {
    if (response.status && response.data.otp == body.otp && moment().valueOf() <= response.data.expiryTime) {
      let userInfo: any = await userDetail(response.data);
      userInfo = userInfo?.data;
      updateOtpStatus(body)
      updateUserStatusService(userInfo)
      response = {
        status_code: RESPONSE_CODES.POST,
        message: RESPONSE_MESSAGES.otpVerified,
        data: {
          userId: userInfo._id
        }
      }
    } else {
      response = {
        status: 0,
        status_code: response.status ? RESPONSE_CODES.BAD_REQUEST : RESPONSE_CODES.NOT_FOUND,
        message: response.status ? RESPONSE_MESSAGES.otpNotVerified : RESPONSE_MESSAGES.noDataFound,
      };
    }

    return res.status(response.status_code).json(response);
  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    });
  }
};







// Check email
export const checkEmailController = async (req: Request, res: Response) => {
  try {
    const body: any = req.query;

    body.type = "email"
    const response: RESPONSE = await userProfile(body);

    delete response?.data;
    return res.status(response.status_code).json(response);

  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message
    });
  }
};