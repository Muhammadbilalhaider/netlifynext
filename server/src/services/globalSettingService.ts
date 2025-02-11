import moment from "moment-timezone";
import { RESPONSE_CODES, Collection } from "../config/constants";
// import { update, aggregate } from "../utils/DAO";
import { RESPONSE } from "../interfaces/commonInterfaces";
import { AddUpdateGlobalSettingPayload } from "../interfaces/globalSettingInterface";
import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import { Configuration } from "../models/configuration.model";


// Global setting add update
export const addUpdateGlobalSettings = async (payload: AddUpdateGlobalSettingPayload) => {
    try {
        const currentTime = parseInt(moment().tz(process.env.Timezone).format("x"));

        let condition: any;

        condition = {
            settingId: "82dec494-6698-41cf-9521-fac2f7122147",
        };

        let updateData: any = {
            updatedAt: currentTime,
            excludedCompanies: payload.excludedCompanies,
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
            message: RESPONSE_MESSAGES.globalSettingsSuccess,
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

// Get global settings
export const getAllGlobalSettings = async () => {
    try {
        let condition: any;
        let response: RESPONSE;

        condition = [
            {
                $match: {
                    isDeleted: false,
                }
            },
            {
                $addFields: {
                    excludedCompanies: {
                        $map: {
                            input: '$excludedCompanies',
                            as: 'companyId',
                            in: { $toObjectId: '$$companyId' }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: Collection.companiesTableName,
                    let: { excludedCompanies: '$excludedCompanies' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $in: ['$_id', '$$excludedCompanies'] },
                                        { $eq: ['$isDeleted', false] }
                                    ]
                                }
                            }
                        }
                    ],
                    as: 'excludedCompaniesInfo',
                }
            }
        ]

        const globalSettings = await Configuration.aggregate(condition);

        response = {
            status: 1,
            status_code: RESPONSE_CODES.GET,
            message: RESPONSE_MESSAGES.globalSettingsDetail,
            data: globalSettings.length ? globalSettings[0]: {},
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