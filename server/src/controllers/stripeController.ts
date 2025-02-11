import { Response } from 'express';
import { RESPONSE_CODES, USER_TYPE, } from '../config/constants';
import { CustomRequest, RESPONSE } from '../interfaces/commonInterfaces';
import { addStripePlanService, checkoutSessionService, editStripePlanService, subscriptionListing } from '../services/stripeServices';
import { editPlanSInDBService, inactiveAllPlansService, isPlanExist, plansAllListing } from '../services/planServices';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';
import { userDetail } from '../services/userServices';


// Add plan in Stripe
export const addPlanController = async (req: CustomRequest, res: Response) => {
    try {
        const body = req.body;
        let response: RESPONSE;

        body.type = "name";
        response = await isPlanExist(body);

        if (response.status) {
            response = {
                status: 0,
                status_code: RESPONSE_CODES.ALREADY_EXIST,
                message: RESPONSE_MESSAGES.stripePlanNameExist,
            }
            return res.status(response.status_code).json(response);
        }

        response = await addStripePlanService(body)


        return res.status(response.status_code).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
};

// Plans get all
export const plansAllController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.query;
        let response = await plansAllListing(body);

        return res.status(RESPONSE_CODES.POST).json(response);

    } catch (error) {

        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}

// Edit plan
export const editPlanController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.body;
        let response: RESPONSE = await isPlanExist(body);

        if (!response.status) {
            response.status_code = RESPONSE_CODES.BAD_REQUEST;
            response.message = RESPONSE_MESSAGES.invalidId;
            return res.status(response.status_code).json(response);
        }

        body.type = "edit"
        response = await isPlanExist(body);

        if (response.status) {
            response = {
                status: 0,
                status_code: RESPONSE_CODES.ALREADY_EXIST,
                message: RESPONSE_MESSAGES.stripePlanNameExist,
            };
            return res.status(response.status_code).json(response);
        }

        response = await editStripePlanService(body);
        return res.status(response.status_code).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}

// Change plan status
export const changePlanStatusController = async (req: CustomRequest, res: Response) => {
    try {
        const body: any = req.body;
        let response: RESPONSE = await isPlanExist(body);

        if (!response.status) {
            response.status_code = RESPONSE_CODES.BAD_REQUEST;
            response.message = RESPONSE_MESSAGES.invalidId;
            return res.status(response.status_code).json(response);
        }

        body.type = "change_status";
        response = await editStripePlanService(body);
        if (body.status) {
                    
            await inactiveAllPlansService();
        }
        editPlanSInDBService(body);
        response.message = RESPONSE_MESSAGES.stripePlaneStatusChange;
        return res.status(response.status_code).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}

// Create checkout session
export const checkoutSessionController = async (req: CustomRequest, res: Response) => {
    try {
        const body = req.body;
        let response: RESPONSE;

        body.type = "id";
        body._id = req.user._id
        response = await userDetail(body);
        if (!response.status) {
            response = {
                status: 0,
                status_code: RESPONSE_CODES.NOT_FOUND,
                message: RESPONSE_MESSAGES.userNotFound,
            };
            return res.status(response.status_code).json(response);
        }
        const userInfo = response.data;

        if (userInfo.isSubscribed != 0 ) {
            response = {
                status: 0,
                status_code: RESPONSE_CODES.ALREADY_EXIST,
                message: RESPONSE_MESSAGES.UserHasAlreadyActiveSubscription,
            };
            return res.status(response.status_code).json(response);
        }
        body.type = "status" ;
        response = await isPlanExist(body);

        if (!response.status) {
            response.status_code = RESPONSE_CODES.BAD_REQUEST;
            response.message = RESPONSE_MESSAGES.InActiveStripePlan;
            return res.status(response.status_code).json(response);
        }
  
        response = await checkoutSessionService(body, userInfo)

        return res.status(response.status_code).json(response);

    } catch (error) {
     
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
};

// Get all Subscriptions 
export const subscriptionAllController = async (req:CustomRequest, res: Response) => {
    try {
        const query:any = req.query ;

        if(req.user.type === USER_TYPE.user){
            query.userId = req.user._id;
        }

        const response = await subscriptionListing(query);

        if(req.user.type === USER_TYPE.user){
            response.data = response.data.length ? response.data[0] : {};
        }

        return res.status(response.status_code).json(response);
        
    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}