import { RESPONSE_CODES, Collection } from '../config/constants';
// import { count, find, findAll, findOne, insert, insertMany, update, } from '../utils/DAO';
import { RESPONSE } from '../interfaces/commonInterfaces';
import { City, Country, State } from '../models';
import { RESPONSE_MESSAGES } from '../utils/responseMessage';


// Get country count if exist
export const getCountryCount = async () => {
    try {

        let response: RESPONSE;
        const countryCount = await Country.countDocuments({});
        if (countryCount) {
            response = {
                status: 1,
                status_code: RESPONSE_CODES.GET,
                message: RESPONSE_MESSAGES.countryListing,
                data: countryCount
            };
        }
        else {

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

// Add all countries
export const addAllCountry = async (payload: any) => {
    try {
        await Country.insertMany(payload);

        const response = {
            status: 1,
            status_code: RESPONSE_CODES.POST,
            message: RESPONSE_MESSAGES.countryAdded
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

// Add all states
export const addAllState = async (payload: any) => {
    try {

        await State.insertMany(payload);

        const response = {
            status: 1,
            status_code: RESPONSE_CODES.POST,
            message: RESPONSE_MESSAGES.stateAdded
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

// Add all cities
export const addAllCities = async (payload: any) => {
    try {

        await City.insertMany(Collection.cityTableName, payload);

        const response = {
            status: 1,
            status_code: RESPONSE_CODES.POST,
            message: RESPONSE_MESSAGES.cityAdded
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

// get all country Service
export const fetchCountry = async () => {
    try {
        let response = {};
        const condition = {
        }

        const country = await Country.find(condition, {}, {});

        response = {
            status: 1,
            status_code: RESPONSE_CODES.GET,
            message: RESPONSE_MESSAGES.countryListing,
            data: country
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