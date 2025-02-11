import { Response } from 'express';
import { RESPONSE_CODES, } from '../config/constants';
import { CustomRequest, RESPONSE } from '../interfaces/commonInterfaces';
import {  addUpdateConfiguration, getAllConfiguration } from '../services/configurationService';
// Add update configuration
export const addUpdateConfigurationController = async (req: CustomRequest, res: Response) => {
    try {
        const body = req.body;
        let response: RESPONSE;

        response = await addUpdateConfiguration(body)


        return res.status(response.status_code).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
};

// Get all global settings
export const getAllConfigurationController = async (req: CustomRequest, res: Response) => {
    try {
        const body = req.query;
        let response: RESPONSE;

        response = await getAllConfiguration(body);


        return res.status(response.status_code).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
};