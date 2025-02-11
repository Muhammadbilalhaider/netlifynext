import { Response } from 'express';

import { RESPONSE_CODES, } from '../config/constants';
import { RESPONSE, CustomRequest } from '../interfaces/commonInterfaces';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';
import { addAllCities, addAllCountry, addAllState, fetchCountry, getCountryCount } from '../services/countryService';
import { countryArray } from '../config/state-city-db/api_country';
import { stateArray } from '../config/state-city-db/api_state';
import { cityArray } from '../config/state-city-db/api_city';

// Country state city seeder 
export const countrySeederController = async (req: CustomRequest, res: Response) => {
    try {
        let response = await getCountryCount();

        if (!response.status) {
            await addAllCountry(countryArray);
            await addAllState(stateArray);
            await addAllCities(cityArray);
        }
        response = {
            status: 1,
            status_code: RESPONSE_CODES.GET,
            message: RESPONSE_MESSAGES.allAdded
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
// Get all countries
export const countryAllController = async (req: CustomRequest, res: Response) => {
    try {

        let response: RESPONSE = await fetchCountry();

        return res.status(response.status_code).json(response);

    } catch (error) {
        return res.status(RESPONSE_CODES.ERROR).json({
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        });
    }
}