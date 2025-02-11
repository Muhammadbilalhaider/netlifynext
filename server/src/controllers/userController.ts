import { Response } from 'express';
import { RESPONSE_CODES, TEMPLATE_TYPE, } from '../config/constants';
import { addJobPreferencesService, changePasswordService, changesStatusService, deleteUser, sendVerificationCode, updateSettings, updateUserProfileService, userDetail, userProfileDetail, userRegisterService, usersAllService, } from '../services/userServices';
import { RESPONSE, CustomRequest } from '../interfaces/commonInterfaces';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';
import createEmailOptionsForSendMail from '../utils/mailOptions';
import { generateToken } from '../utils/jwt';
import { updateCategoryCount } from '../services/categoryService';
import { UpdateSettingsDto } from '../interfaces/updateSetting';


// User Details
export const getUserInfoController = async (req: CustomRequest, res: Response) => {
  try {
    const body = req.query;
    let response: RESPONSE;

    body._id = body._id ? body._id : req?.user?._id;
    body.type = "id"

    response = await userProfileDetail(body);

    return res.status(response.status_code).json(response);

  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message
    });
  }
};

// User registration
export const userRegisterController = async (req: CustomRequest, res: Response) => {
  try {
    const body: any = req.body;
    let response: RESPONSE;

    const userEmail: any = await userDetail(body);
    if (userEmail.status) {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.ALREADY_EXIST,
        message: RESPONSE_MESSAGES.emailAlreadyExist,
      };
      return res.status(response.status_code).json(response);
    }

    response = await userRegisterService(body);

    const otp: number = await sendVerificationCode(body);

    const mailPayload = {
      template_type: TEMPLATE_TYPE.emailVerification,
      otp: otp,
      name: `${body.firstName} ${body.lastName}`,
      email: body.email,
    };

    createEmailOptionsForSendMail(mailPayload);

    return res.status(response.status_code).json(response);
  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    });
  }
};

// Add Job Preferences
export const addJobPreferencesController1 = async (req: CustomRequest, res: Response) => {
  try {
    const body: any = req.body;
    let response: RESPONSE;

    body.type = "id"
    response = await userDetail(body);

    if (!response.status) {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.invalidId,
      };
      return res.status(response.status_code).json(response);
    }

    const decreaseCategoryCountPayload = [...new Set([...(response.data?.primaryJobTitle || []), ...(response.data?.secondaryJobTitle || [])])
    ];

    const increaseCategoryCountPayload = [...new Set([...body.primaryJobTitle, ...body.secondaryJobTitle])];

    if (decreaseCategoryCountPayload.length) {
      await updateCategoryCount({ titles: decreaseCategoryCountPayload, action: "decrease" });
    }

    addJobPreferencesService(body);
    updateCategoryCount({ titles: increaseCategoryCountPayload, action: "increase" });
    const userInfo = response.data;
    const access_Token = generateToken({
      email: userInfo.email,
      id: userInfo.id,
      _id: userInfo._id,
      name: userInfo.name,
      type: userInfo.type,
    });

    response = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.preferencesAdded,
      data: {
        _id: userInfo._id,
        token: access_Token,
        status: 1,
        type: userInfo.type,
        isVerified: userInfo.isVerified,
        isSubscribed: userInfo.isSubscribed,
      }
    };

    return res.status(response.status_code).json(response);
  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    });
  }
};

// Change status
export const changeStatusController = async (req: CustomRequest, res: Response) => {
  try {
    const body: any = req.body;
    let response: RESPONSE;

    body.type = "id"
    response = await userDetail(body);

    if (response.status) {
      changesStatusService(body);
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: body.status ? RESPONSE_MESSAGES.userStatusActive : RESPONSE_MESSAGES.userStatusInActive,
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

// Get all users
export const getAllUsersController = async (req: CustomRequest, res: Response) => {
  try {
    const body: any = req.query;
    let response: RESPONSE;

    response = await usersAllService(body);



    return res.status(response.status_code).json(response);
  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    });
  }
};

// Change password
export const changePasswordController = async (req: CustomRequest, res: Response) => {
  try {
    const body: any = req.body;
    let response: RESPONSE;

    body._id = req.user._id;
    body.type = "id"
    response = await userDetail(body);

    if (response.status) {
      changePasswordService(body);
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.passwordUpdated,
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

// Update User Profile 
export const editUserProfileController = async (req: CustomRequest, res: Response) => {
  try {
    const body = req.body;

    body._id = req.user._id;
    updateUserProfileService(body);

    const response: RESPONSE = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.userProfileUpdatedSuccessMsg,
    };
    res.status(response.status_code).json(response);

  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    });
  }
}

// Delete user
export const deleteUserController = async (req: CustomRequest, res: Response) => {
  try {
    const body: any = req.body;
    let response: RESPONSE;

    body.type = "id"
    response = await userDetail(body);

    if (!response.status) {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.invalidId,
      };
      return res.status(response.status_code).json(response);
    }
    
    response = await  deleteUser(body);
    return res.status(response.status_code).json(response);
    
  } catch (error) {
      return res.status(RESPONSE_CODES.ERROR).json({
          status: 0,
          status_code: RESPONSE_CODES.ERROR,
          message: error.message
      });
  }
}

export const addJobPreferencesController = async (req: any, res: Response) => {
  try {
    const userId = req.user._id; // Assuming you have user info in request from auth middleware
    const settings: UpdateSettingsDto = req.body;

    // Validate required fields
    if (!settings) {
      return res.status(400).json({
        success: false,
        message: 'Settings data is required'
      });
    }

    const updatedSettings = await updateSettings(userId, settings);
    const response = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.preferencesAdded,
      data: updatedSettings
    };

    return res.status(response.status_code).json(response);
  } catch (error) {
    return res.status(RESPONSE_CODES.ERROR).json({
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    });
  }
};