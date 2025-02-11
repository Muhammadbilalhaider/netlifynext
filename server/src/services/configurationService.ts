import moment from "moment-timezone";

import { RESPONSE_CODES } from "../config/constants";
import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import { addConfigurationPayload } from "../interfaces/configurationInterface";
import { RESPONSE } from "../interfaces/commonInterfaces";
import { Configuration } from "../models/configuration.model";


// Add update configuration
export const addUpdateConfiguration = async (payload: addConfigurationPayload) => {
    try {
        const currentTime = parseInt(moment().tz(process.env.Timezone).format("x"));

        let condition: any;

        condition = {
            type: payload.type,
        };

        let updateData: any = {
            keys: payload.keys,
            name: payload.name,
            updatedAt: currentTime,
        };

        const insertData: any = {
            createAt: currentTime,
            isDeleted: false,
        };


        const options = {
            upsert: true,
        };

        Configuration.updateOne(condition, { $set: updateData, $setOnInsert: insertData }, options);

        const response = {
            status: 1,
            status_code: RESPONSE_CODES.POST,
            message: RESPONSE_MESSAGES.configurationSuccess,
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

// Get configuration
export const getAllConfiguration = async (payload: any) => {
    try {
        let condition: any;
        let response: RESPONSE;

        condition = {
            isDeleted: false,
        };

        if(payload.type){
            condition.type = parseInt(payload.type);
        }

        const configuration = await Configuration.find( condition, {});

        response = {
            status: 1,
            status_code: RESPONSE_CODES.GET,
            message: RESPONSE_MESSAGES.configurationAll,
            data: configuration,
        };

        return response;
    } catch (error) {
        return {
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message,
        };
    }
};