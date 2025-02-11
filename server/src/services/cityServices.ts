import { RESPONSE_CODES, Collection } from '../config/constants';
// import { findAll, } from '../utils/DAO';
import { RESPONSE } from '../interfaces/commonInterfaces';
import { City } from '../models';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';


// get all state cities Service
export const fetchStateCity = async (payload: any) => {
    try {
        let response = {};

        // Comma-separated IDs string
        const idsString = payload.stateId;

        // Convert the string of IDs into an array of strings
        const idsArray = idsString.split(',');

        // Convert each ID in the array back to a string
        const stringIdsArray = idsArray.map(id => id.toString());

        const condition = {
            stateId: {
                $in: stringIdsArray
            }
        }

        const cities = await City.find(condition, {});

        response = {
            status: 1,
            status_code: RESPONSE_CODES.GET,
            message: RESPONSE_MESSAGES.cityListing,
            data: cities
        };

        return response

    } catch (error) {
        throw {
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message
        };
    }

};