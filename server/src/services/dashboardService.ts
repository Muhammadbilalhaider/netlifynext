import moment from "moment-timezone";
import { Collection, RESPONSE_CODES } from "../config/constants";
import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import { User } from "../models";



export const getDashboardMetrics = async () => {
    try {

        const currentDate = parseInt(moment().tz(process.env.Timezone).format('x'));

        const beforeOneMonth = moment(currentDate).subtract(1, 'month').startOf('month').valueOf();

        const  beforeTwoMonth = moment(currentDate).subtract(2, 'month').startOf('month').valueOf();

        const beforeOneMonthDateRange = { $gte: beforeOneMonth, $lte: currentDate };

        const beforeTwoMonthDateRange = { $gte: beforeTwoMonth, $lte: beforeOneMonth };
        
  
        const condition = [
            {
                $match: {
                    isDeleted: false,
                    type: { $ne: 1 }
                }
            },
            {
                $facet: {
                    activeUsers: [
                        {
                            $match: { status: 1 }
                        },
                        {
                            $count: "count"
                        }
                    ],
                    totalUsers: [
                        {
                            $match: {
                                status: 1,
                                createdAt: beforeOneMonthDateRange
                            }
                        },
                        {
                            $count: "count"
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: Collection.categoryTable,
                    pipeline: [
                        {
                            $match: {
                                isDeleted: false
                            }
                        },
                    ],
                    
                    as: "categories"
                }
            },
            {
                $lookup: {
                    from: Collection.subscriptions,
                    pipeline: [
                        {
                           $match :  {
                            isDeleted : false,
                             createdAt: beforeOneMonthDateRange 
                           }
                        },

                    ],
                    as: "beforeOneMonthTransaction"
                }
            },
            {
                $lookup: {
                    from: Collection.subscriptions,
                    pipeline: [
                        {
                           $match :  {
                            isDeleted : false,
                             createdAt: beforeTwoMonthDateRange 
                           }
                        },

                    ],
                    as: "beforeTwoMonthTransaction"
                }
            },
            {
                $lookup: {
                    from: Collection.jobsTableName,
                    pipeline: [
                        {
                            $match: {
                                isDeleted: false,
                                createdAt : { $gte : beforeOneMonth}
                            }
                        },
                    ],
                    
                    as: "beforeOneMonthTotalJobs"
                }
            },
            {
                $project: {
                    activeUsers: { $arrayElemAt: ["$activeUsers.count", 0] },
                    totalUsers: { $arrayElemAt: ["$totalUsers.count", 0] },
                    totalCategories: { $size: "$categories" },
                    totalTransactionsPreviousMonth: { $size: "$beforeOneMonthTransaction" },
                    totalTransactionsMonthBeforePrevious: { $size : "$beforeTwoMonthTransaction"},
                    totalJobs : { $size : "$beforeOneMonthTotalJobs"}
                }
            }
        ];

        const count:any = await User.aggregate(condition);
    
        return {
            status: 1,
            status_code: RESPONSE_CODES.GET,
            message: RESPONSE_MESSAGES.countFetchedSuccessMsg,
            data: count[0]
        };
        
    } catch (error) {
        console.log(error)
        throw {
            status: 0,
            status_code: RESPONSE_CODES.ERROR,
            message: error.message,
        }; 
    }
}