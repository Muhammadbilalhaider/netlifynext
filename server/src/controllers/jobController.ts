import { Response } from "express";
import { CustomRequest, RESPONSE } from "../interfaces/commonInterfaces";
import { JOB_STATUS, RESPONSE_CODES } from "../config/constants";
import {upsertJobService, updateUserAppliedAndFollowedJobService, getAllJobsService} from "../services/jobServices";
import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import { JobQueryParams, PaginationParams } from "../interfaces/jobInterface";
import moment from "moment-timezone";

// User Applied , Followed & Don't apply job 
export const addAndUpdateJobPreferenceController = async (req: CustomRequest, res: Response) => {
    try {

        let response: RESPONSE;
        const body = req.body;

        body.userId = req.user._id;

        await updateUserAppliedAndFollowedJobService(body);

        response = {
            status: 1,
            status_code: RESPONSE_CODES.GET,
            message: RESPONSE_MESSAGES.jobPreferenceUpdatedSuccessMsg
        }

        return res.status(response.status_code).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
};

// Upsert Job Controller
export const upsertJobController = async (req: CustomRequest, res: Response) => {
    try {
        const jobData = req.body;
        // console.log("addJobData",jobData)
        jobData.userId = req.user._id; // Add the user ID from the authenticated request
        // const userId = req.user._id
 
        // Add default values for required fields
        jobData.isDeleted = false;
        jobData.status = JOB_STATUS.followed;
        
        // Initialize jobActionData object
        const jobActionData = {
            userId: req.user._id,
            isDeleted: false,
            status: JOB_STATUS.followed
        };

        // Create or Update the job in database
        const response: RESPONSE = await upsertJobService(jobActionData, jobData);

        return res.status(response.status_code).json(response);

    } catch (error) {
        console.log("error1",error)
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
};

export const getAllJobsController = async (req: CustomRequest, res: Response) => {
    try {
        const query: JobQueryParams = {
            ...req.query,
            userId: req.user._id,
            type: req.query.type ? parseInt(req.query.type as string) : undefined
        };
       console.log("query",query)
        const pagination: PaginationParams = {
            page: parseInt(query.page || '1'),
            limit: parseInt(query.limit || '50'),
            skip: (parseInt(query.page || '1') - 1) * parseInt(query.limit || '50')
        };

        // Validate date ranges if provided
        if (query.startDate && query.endDate) {
            const startDate = moment(query.startDate, "DD-MM-YYYY");
            const endDate = moment(query.endDate, "DD-MM-YYYY");
            
            if (!startDate.isValid() || !endDate.isValid()) {
                return res.status(400).json({
                    status: 0,
                    status_code: RESPONSE_CODES.BAD_REQUEST,
                    message: 'Invalid date format. Use DD-MM-YYYY'
                });
            }

            if (endDate.isBefore(startDate)) {
                return res.status(400).json({
                    status: 0,
                    status_code: RESPONSE_CODES.BAD_REQUEST,
                    message: 'End date cannot be before start date'
                });
            }
        }

        const response = await getAllJobsService(query, pagination);
        
        return res.status(response.status_code).json(response);
    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
};