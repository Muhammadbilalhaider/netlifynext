import { Response } from 'express';
import { RESPONSE_CODES, } from '../config/constants';
import { CustomRequest, RESPONSE } from '../interfaces/commonInterfaces';
import { addUpdateGlobalSettings, getAllGlobalSettings } from '../services/globalSettingService';
// Add update global settings
export const addUpdateGlobalSettingsController = async (req: CustomRequest, res: Response) => {
    try {
        const body = req.body;
        let response: RESPONSE;
        response = await addUpdateGlobalSettings(body)
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
export const getAllGlobalSettingsController = async (req: CustomRequest, res: Response) => {
    try {
        let response: RESPONSE;
        response = await getAllGlobalSettings();
        return res.status(response.status_code).json(response);
    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
};