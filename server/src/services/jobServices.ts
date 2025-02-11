import moment from "moment-timezone";
import { Collection, JOB_STATUS, RESPONSE_CODES } from "../config/constants";

import { RESPONSE_MESSAGES } from "../utils/responseMessage";
import { RESPONSE } from "../interfaces/commonInterfaces";
import { ObjectId } from "mongodb";
import {
  IJob,
  JobQueryParams,
  JobSearchParams,
  JobsSearchPayload,
  PaginationParams,
  ServiceResponse,
  appliedJobPayload,
  getAppliedJobsPayload,
  getDontAppliedJobsPayload,
  getFollowJobsPayload,
} from "../interfaces/jobInterface";
import { categoryAll } from "./categoryService";
import axios from "axios";
import {
  ExclusionPreference,
  IJobAction,
  Job,
  JobAction,
  JobPreference,
  Subscription,
} from "../models";
import { PipelineStage, Types } from "mongoose";

export const getJobsFromScraperAndInsertInDb = async (payload: any = {}) => {
  try {
    payload.type = "cron";
    let categories = await categoryAll(payload);

    let categoryNames = categories.data?.map((obj: any) => obj.name);
    const jobs = await getJobsFromLinkedInJobScraper(categoryNames);

    if (jobs.status) {
      // console.log("-------Jobs scrapped successfully---------",jobs.data);
      await addAndUpdateJobService(jobs.data);
    }
  } catch (error) {
    console.log("error------------------", error);
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Add & Update Job Service
const addAndUpdateJobService = async (payload: any) => {
  try {
    // console.log("Backend - Received payload:", payload);

    if (
      !payload?.jobs ||
      !Array.isArray(payload.jobs) ||
      payload.jobs.length === 0
    ) {
      throw new Error("Invalid jobs data");
    }

    // Filter out invalid jobs instead of throwing error
    const validJobs = payload.jobs.filter((job: any) => {
      const isValid =
        job.title && (job.company || job.companyName) && job.location;
      if (!isValid) {
        // console.log("Skipping invalid job:", job);
      }
      return isValid;
    });

    if (validJobs.length === 0) {
      throw new Error("No valid jobs found in payload");
    }

    const bulkOps = validJobs.map((record: any) => ({
      updateOne: {
        filter: {
          applyUrl: record.applyUrl,
          title: record.title,
          companyName: record.company || record.companyName, // Handle both fields
          location: record.location,
          isDeleted: false,
        },
        update: {
          $set: {
            ...record,
            companyName: record.company || record.companyName, // Ensure consistency
            publishedAt: new Date(record.publishedAt).getTime(),
          },
          $setOnInsert: {
            isDeleted: false,
          },
        },
        upsert: true,
      },
    }));

    const data = await Job.bulkWrite(bulkOps);
    return {
      status: 1,
      status_code: RESPONSE_CODES.POST,
      message: RESPONSE_MESSAGES.jobAddedSuccessMsg,
      data: data,
      stats: {
        totalJobs: payload.jobs.length,
        validJobs: validJobs.length,
        skippedJobs: payload.jobs.length - validJobs.length,
      },
    };
  } catch (error) {
    console.error("Backend - Error in addAndUpdateJobService:", error);
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Get Followed Jobs
export const getAllFollowedJobService = async (
  payload: getFollowJobsPayload
) => {
  try {
    let response: RESPONSE;
    let unixStartTime: any;
    let unixEndTime: any;

    const matchCondition: any = {
      isDeleted: false,
    };

    if (payload.startDate && payload.endDate) {
      unixStartTime = moment.tz(
        payload.startDate,
        "DD-MM-YYYY",
        process.env.Timezone
      );
      unixEndTime = moment.tz(
        payload.endDate,
        "DD-MM-YYYY",
        process.env.Timezone
      );

      unixStartTime = unixStartTime.valueOf();
      unixEndTime = unixEndTime.valueOf();
    }

    if (payload.search) {
      const searchRegex = new RegExp(payload.search, "i");
      matchCondition.$or = [
        { companyName: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
      ];
    }
    const pageNo = parseInt(payload.page);
    const limit = parseInt(payload.limit);

    const condition = [
      {
        $lookup: {
          from: Collection.jobActionTableName,
          let: { userId: new ObjectId(payload.userId) },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$isDeleted", false] },
                    { $eq: ["$status", parseInt(payload.type)] },
                  ],
                },
              },
            },
            {
              $project: {
                jobId: 1,
                notes: 1,
                status: 1,
                appliedOn: 1,
                application_status: 1,
              },
            },
          ],
          as: "jobActions",
        },
      },
      {
        $match: {
          ...matchCondition,
          isDeleted: false,
          $expr: {
            $in: [
              "$_id",
              {
                $ifNull: [
                  {
                    $map: {
                      input: "$jobActions",
                      as: "action",
                      in: "$$action.jobId",
                    },
                  },
                  [], // Fallback to an empty array if jobActions is null
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          jobActions: {
            $filter: {
              input: "$jobActions",
              as: "action",
              cond: { $eq: ["$$action.jobId", "$_id"] },
            },
          },
        },
      },
      {
        $unwind: {
          path: "$jobActions",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          notes: "$jobActions.notes",
          status: "$jobActions.status",
          appliedOn: "$jobActions.appliedOn",
          application_status: "$jobActions.application_status",
        },
      },
      { $sort: { publishedAt: 1 } },
      { $skip: (pageNo - 1) * limit },
      { $limit: limit },
      { $project: { jobActions: 0 } },
    ];
    //@ts-ignore
    const jobsInfo = await Job.aggregate(condition);
    // const jobsInfo = await find(Collection.jobsTableName, condition,{}, {},{});
    response = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.jobFetchedSuccessMsg,
      data: jobsInfo,
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

export const updateUserAppliedAndFollowedJobService = async (payload: any) => {
  try {
    // Validate payload
    if (!payload.userId || !payload.jobId) {
      throw new Error("userId and jobId are required fields.");
    }

    // Define the current timestamp in milliseconds
    const currentTime = Date.now();

    // Define the condition for the query
    let condition: any = {
      userId: new ObjectId(payload.userId),
      jobId: new ObjectId(payload.jobId),
      isDeleted: false,
    };

    // Fields to update if the document exists
    const updatedData: any = {
      notes: payload.notes || "",
      status: payload.status,
      application_status: payload.application_status || "",
      ...(payload.status === JOB_STATUS.applied
        ? { appliedOn: currentTime }
        : {}),
    };

    // Fields to set if a new document is created
    const insertData: any = {
      userId: new ObjectId(payload.userId),
      jobId: new ObjectId(payload.jobId),
      isDeleted: false,
    };

    // Options for the updateOne operation
    const options = {
      upsert: true, // Create a new document if no match is found
    };

    // Perform the updateOne operation
    const result = await JobAction.updateOne(
      condition,
      {
        $set: updatedData, // Update fields if document exists
        $setOnInsert: insertData, // Set fields only if a new document is created
      },
      options
    );

    return true;
  } catch (error: any) {
    console.error("Error in updateUserAppliedAndFollowedJobService:", error);
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message || "An unexpected error occurred.",
    };
  }
};

// Get Applied Job Detail
export const getAppliedJobDetailService = async (
  payload: getAppliedJobsPayload
) => {
  try {
    let response: RESPONSE;

    const condition: any = {
      isDeleted: false,
    };

    if (payload.type === "appliedJobs") {
      condition.userId = new ObjectId(payload.userId);
      condition.jobId = new ObjectId(payload.jobId);
    } else {
      condition._id = new ObjectId(payload._id);
    }

    const jobInfo = await Job.findOne(condition);

    if (jobInfo) {
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.userAppliedAndFollowedJobRetrieveSuccessMsg,
        data: jobInfo,
      };
    } else {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.noDataFound,
      };
    }
    return response;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

// Get all don't apply job
export const getAllDontAppliedJobs = async (
  payload: getDontAppliedJobsPayload
) => {
  try {
    let response: RESPONSE;

    const matchCondition: any = {
      isDeleted: false,
    };

    const pageNo = parseInt(payload.page);
    const limit = payload.limit;

    const condition = [
      {
        $lookup: {
          from: Collection.jobActionTableName,
          let: {
            jobId: "$_id",
            userId: new ObjectId(payload.userId),
            status: JOB_STATUS.applied,
          },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$jobId", "$$jobId"] },
                    { $eq: ["$userId", "$$userId"] },
                    { $eq: ["$isDeleted", false] },
                    { $eq: ["$status", JOB_STATUS.doNotApply] },
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                jobId: "$jobId",
                notes: 1,
                status: 1,
              },
            },
          ],
          as: "dontAppliedJobs",
        },
      },
      {
        $unwind: { path: "$dontAppliedJobs", preserveNullAndEmptyArrays: true },
      },
      {
        $match: {
          $and: [
            matchCondition,
            {
              $expr: {
                $and: [{ $eq: ["$_id", "$dontAppliedJobs.jobId"] }],
              },
            },
          ],
        },
      },
      {
        $addFields: {
          status: JOB_STATUS.doNotApply,
        },
      },
      {
        $addFields: {
          notes: "$dontAppliedJobs.notes",
        },
      },
      // { $sort: { isApplied : 1 } },
      // { $skip: (pageNo - 1) * limit },
      { $limit: 50 },
      {
        $project: {
          appliedJobs: 0,
          isApplied: 0,
          dontAppliedJobs: 0,
        },
      },
    ];

    const jobsInfo = await Job.aggregate(condition);
    response = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.jobFetchedSuccessMsg,
      data: jobsInfo,
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

// Get all don't apply job count
export const getAllDontAppliedJobsCount = async (
  payload: getDontAppliedJobsPayload
) => {
  try {
    let response: RESPONSE;
    let unixStartTime: any;
    let unixEndTime: any;

    if (payload.date) {
      unixStartTime = moment.tz(
        `${payload.date} 00:00:00`,
        "DD-MM-YYYY HH:mm:ss",
        process.env.Timezone
      );
      unixEndTime = moment.tz(
        `${payload.date} 23:59:59`,
        "DD-MM-YYYY HH:mm:ss",
        process.env.Timezone
      );

      unixStartTime = unixStartTime.valueOf();
      unixEndTime = unixEndTime.valueOf();
    }

    // Using aggregation pipeline for complex search
    const pipeline: any[] = [
      {
        $match: {
          userId: new ObjectId(payload.userId),
          status: JOB_STATUS.doNotApply,
          isDeleted: false,
        },
      },
    ];

    // Add date filter if provided
    if (payload.date) {
      pipeline.push({
        $match: {
          createdAt: {
            $gte: unixStartTime,
            $lte: unixEndTime,
          },
        },
      });
    }

    // Add search filter if provided
    if (payload.search) {
      pipeline.push(
        {
          $lookup: {
            from: Collection.jobsTableName,
            localField: "jobId",
            foreignField: "_id",
            as: "job",
          },
        },
        {
          $unwind: "$job",
        },
        {
          $match: {
            $or: [
              { "job.title": { $regex: payload.search, $options: "i" } },
              { "job.companyName": { $regex: payload.search, $options: "i" } },
              { "job.description": { $regex: payload.search, $options: "i" } },
            ],
          },
        }
      );
    }

    // Add count stage
    pipeline.push({
      $count: "total",
    });

    const result = await Job.aggregate(pipeline);
    const totalCount = result[0]?.total || 0;

    response = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.jobFetchedSuccessMsg,
      data: totalCount,
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

export const getInteractedJobIds = async (payload: { userId: string }) => {
  try {
    let response: RESPONSE;

    const condition = {
      userId: new ObjectId(payload.userId),
      status: { $ne: JOB_STATUS.dailyJobs },
    };

    const projection = { jobId: 1 };

    const results = await Job.find(condition, projection);

    const interactedJobIds = [
      //@ts-ignore
      ...new Set(results.map((result) => result.jobId)),
    ];

    response = {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.userInteractedJob,
      data: interactedJobIds,
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

export const getFollowJobIds = async (payload: { userId: string }) => {
  try {
    let response: RESPONSE;

    const condition = {
      userId: new ObjectId(payload.userId),
      status: JOB_STATUS.followed,
    };

    const projection = { jobId: 1 };

    const results = await Job.find(condition, projection);

    //@ts-ignore
    const followJobIds = [...new Set(results.map((result) => result.jobId))];

    if (followJobIds.length) {
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.userFollowJob,
        data: followJobIds,
      };
    } else {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.noDataFound,
        data: followJobIds,
      };
    }

    return response;
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};
// Get Jobs From Job Scraper
export const getJobsFromLinkedInJobScraper = async (payload: any) => {
  try {
    let response: any;
    payload = ["Software Engineer", "Product Manager", "Data Scientist"];
    // Input validation
    if (!Array.isArray(payload)) {
      throw new Error("Payload must be an array of job titles");
    }

    const searchPayload = payload
      .map((title) => title?.trim())
      .filter(Boolean)
      .map((title) => ({
        title,
        isRemote: true,
        location: "US", // default location
      }));

    if (searchPayload.length === 0) {
      throw new Error("No valid job titles found in payload");
    }

    const jobs = await getJobsFromRapid(searchPayload);
    // console.log("JOBS.length", jobs);

    if (jobs.data?.jobs?.length) {
      response = {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.jobFetchedSuccessMsg,
        data: jobs.data,
      };
    } else {
      response = {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.noDataFound,
      };
    }
    return response;
  } catch (error) {
    console.log(
      "error------getJobsFromLinkedInJobScraper----------",
      error.message
    );

    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};
//job search api
export const fetchJobsFromRapidSearchApi = async (searchTerms: string[]) => {
  try {
    const config = {
      apiUrl: "https://jobs-search-api.p.rapidapi.com/getjobs",
      apiKey: process.env.RAPID_API_KEY,
      baseSearchParams: {
        results_wanted: 1000,
        site_name: ["indeed"],
        distance: 50,
        job_type: "fulltime",
        is_remote: true,
        linkedin_fetch_description: true,
        hours_old: 24,
      },
    };

    const cities = ["US"]; // Cities to search jobs in
    const allJobs: IJob[] = [];

    // Create a delay function
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    // Process each search term
    for (const searchTerm of searchTerms) {
      // Process each city for the current search term
      for (const city of cities) {
        const searchParams: JobSearchParams = {
          ...config.baseSearchParams,
          search_term: searchTerm,
          location: city,
          site_name: ["indeed"],
        };

        const options = {
          method: "POST",
          url: config.apiUrl,
          headers: {
            "content-type": "application/json",
            "X-RapidAPI-Key": config.apiKey,
            "X-RapidAPI-Host": "jobs-search-api.p.rapidapi.com",
          },
          data: searchParams,
        };

        try {
          const response = await axios.request(options);
          const jobs = response.data.jobs;

          if (jobs && jobs.length > 0) {
            allJobs.push(...jobs);
          }

          // Add delay between requests to respect API rate limits
          await delay(1000);
        } catch (error) {
          console.error(
            `Error fetching jobs for ${searchTerm} in ${city}:`,
            error.message
          );
        }
      }
    }

    if (allJobs.length === 0) {
      return {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.noDataFound,
      };
    }

    // Remove duplicates based on job ID
    const uniqueJobs: { [key: string]: IJob } = {};
    let duplicatesCount = 0;

    allJobs.forEach((job) => {
      if (!uniqueJobs[job.id]) {
        uniqueJobs[job.id] = job;
      } else {
        duplicatesCount++;
      }
    });

    const uniqueJobsArray = Object.values(uniqueJobs);

    // Log statistics
    console.log("Total jobs fetched:", allJobs.length);
    console.log("Total unique jobs:", uniqueJobsArray.length);
    console.log("Total duplicates removed:", duplicatesCount);
    // console.log("uniqueJobs ===>",uniqueJobsArray.slice(0,2))

    const transformedJobs = uniqueJobsArray.map((job) => {
      const parsedSalary = job.min_amount && job.max_amount
      ? `${job.min_amount} to ${job.max_amount}`
      : "Not specified";
      // console.log("parseedddddddddddddddd")
      return {
      // Required fields
      title: job.title,
      description: job.description,
      companyName: job.company,
      location: job.location,
      applyUrl: job.job_url_direct,
      publishedAt: moment(job.date_posted).valueOf(),
      postedDate: moment(job.date_posted).valueOf(),

      // Optional fields
      site: job.site,
      jobUrl: job.job_url,
      // jobUrlDirect: job.job_url_direct,
      jobType: job.job_type,
      salarySource: job.salary_source,
      
      // interval: job.interval,
      salary: parsedSalary,
      // minAmount: job.min_amount,
      // maxAmount: job.max_amount,

      
      // currency: job.currency,
      isRemote: Boolean(job.is_remote),
      // jobLevel: job.job_level,
      // jobFunction: job.job_function,
      // companyIndustry: job.company_industry,
      // listingType: job.listing_type,
      // emails: job.emails,
      companyUrl: job.company_url,
      // companyUrlDirect: job.company_url_direct,
      // companyAddresses: job.company_addresses,
      // companyNumEmployees: job.company_num_employees,
      // companyRevenue: job.company_revenue,
      companyDescription: job.company_description,
      logoPhotoUrl: job.logo_photo_url,
      // bannerPhotoUrl: job.banner_photo_url,
      // ceoName: job.ceo_name,
      // ceoPhotoUrl: job.ceo_photo_url,
      // isDeleted: false
   } });

    return {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.jobFetchedSuccessMsg,
      data: {
        jobs: transformedJobs,
        stats: {
          total_fetched: allJobs.length,
          total_unique: uniqueJobsArray.length,
          duplicates_removed: duplicatesCount,
        },
      },
    };
  } catch (error) {
    console.error("Error in fetchJobs:", error.message);
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};
// Jobs Api
export const getJobsFromJobsApi = async (payload: JobsSearchPayload[]) => {
  try {
    const searchPromises = payload.flatMap((params) => {
      const searches = [];

      // Add remote search if isRemote is true or undefined
      if (params.isRemote !== false) {
        searches.push(
          fetchAllJobsForSearch({
            ...params,
            location: "US",
            isRemote: true,
          })
        );
      }

      // Add local search if location is provided
      if (params.location && params.location !== "US") {
        searches.push(
          fetchAllJobsForSearch({
            ...params,
            isRemote: false,
          })
        );
      }

      return searches;
    });

    const jobResults = await Promise.all(searchPromises);
    const jobs = jobResults.flat();
    // console.log("jobssssssssss =====>",jobs)
    if (jobs.length) {
      return {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.jobFetchedSuccessMsg,
        data: {
          jobs,
          stats: {
            total_jobs: jobs.length,
            search_terms: payload.length,
          },
        },
      };
    } else {
      return {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.noDataFound,
      };
    }
  } catch (error) {
    console.log("error------getJobsFromJobsApi----------", error.message);
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

export const getJobsFromRapid = async (payload: JobsSearchPayload[]) => {
  try {
    // Extract search terms for the Rapid Search API
    const searchTerms = payload.map((item) => item.title);

    // Parallel execution of both APIs
    const [rapidSearchResults, jobsApiResults] = await Promise.all([
      // First API: Rapid Search API
      fetchJobsFromRapidSearchApi(searchTerms).catch((error) => {
        console.error("Error in Rapid Search API:", error.message);
        return { data: { jobs: [] } };
      }),

      // Second API: Jobs API
      getJobsFromJobsApi(payload).catch((error) => {
        console.error("Error in Jobs API:", error.message);
        return { data: { jobs: [] } };
      }),
    ]);

    // Combine and deduplicate results
    const allJobs = [
      ...(rapidSearchResults.data?.jobs || []),
      ...(jobsApiResults.data?.jobs || []),
    ];

    // Create a Map to store unique jobs using a composite key
    const uniqueJobs = new Map();

    allJobs.forEach((job) => {
      const key = `${job.title}-${job.company}-${job.location}`.toLowerCase();
      if (!uniqueJobs.has(key)) {
        uniqueJobs.set(key, job);
      }
    });

    const finalJobs = Array.from(uniqueJobs.values());

    // Prepare response
    if (finalJobs.length) {
      return {
        status: 1,
        status_code: RESPONSE_CODES.GET,
        message: RESPONSE_MESSAGES.jobFetchedSuccessMsg,
        data: {
          jobs: finalJobs,
          stats: {
            total_jobs: finalJobs.length,
            rapid_search_jobs: rapidSearchResults.data?.jobs?.length || 0,
            jobs_api_jobs: jobsApiResults.data?.jobs?.length || 0,
            search_terms: payload.length,
            duplicates_removed: allJobs.length - finalJobs.length,
          },
        },
      };
    } else {
      return {
        status: 0,
        status_code: RESPONSE_CODES.NOT_FOUND,
        message: RESPONSE_MESSAGES.noDataFound,
      };
    }
  } catch (error) {
    console.error("error------getJobsFromRapid----------", error.message);
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};

type FetchJobBatchResponse = {
  jobs: any[];
  nextPage: string | null;
};

let apiCount = 0;

async function fetchJobBatch(
  searchParams: any,
  nextPage: string | null
): Promise<FetchJobBatchResponse> {
  try {
    const queryParams: any = {
      query: searchParams.title || "", // Job title or query
      location: searchParams.location || "United States", // Default to the US
      autoTranslateLocation: true, // Automatic localization
      remoteOnly: searchParams.isRemote ? "true" : "false",
      employmentTypes: "fulltime;parttime;intern;contractor", // Employment types
      datePosted: searchParams.datePosted || "today", // Default to today
    };

    // Include nextPage token if provided
    if (nextPage) {
      queryParams.nextPage = nextPage;
    }
    let apiCount = 0;
    const response = await axios.get(
      "https://jobs-api14.p.rapidapi.com/v2/list",
      {
        params: queryParams,
        headers: {
          "x-rapidapi-key": process.env.RAPID_API_KEY,
          "x-rapidapi-host": "jobs-api14.p.rapidapi.com",
        },
      }
    );
    if (response) {
      apiCount++; // Increment count
      console.log("API count:", apiCount); // Log updated count
    }
    return {
      jobs: response.data.jobs || [],
      nextPage: response.data.nextPage || null,
    };
  } catch (error) {
    console.error("Error in fetchJobBatch:", error.message);
    return { jobs: [], nextPage: null };
  }
}

async function fetchAllJobsForSearch(searchParams: any) {
  try {
    let totalJobs = 0;
    const maxJobs = 1000; // Limit to avoid excessive API calls
    const uniqueJobs = new Map<string, any>();

    let nextPage: string | null = null;

    while (totalJobs < maxJobs) {
      const { jobs, nextPage: newNextPage } = await fetchJobBatch(
        searchParams,
        nextPage
      );
      // console.log("Next page token:", nextPage);

      // if (!jobs.length) break; // Exit if no jobs are returned
      if (!jobs.length || !newNextPage) {
        console.log("No jobs or next page token. Exiting the loop.");
        break;
      }

      // Process jobs
      jobs.forEach((job) => {
        // console.log("jobssss", job);
        const key = `${job.title}-${job.description}`;
        if (!uniqueJobs.has(key)) {
          uniqueJobs.set(key, {
            title: job.title,
            description: job.description,
            companyName: job.company,
            location: job.location,
            applyUrl: job.jobProviders?.[0]?.url,
            publishedAt: moment()
              .subtract(parseInt(job.datePosted), "hours")
              .valueOf(),
            postedDate: moment()
              .subtract(parseInt(job.datePosted), "hours")
              .valueOf(),
            jobType: job.employmentType,
            salarySource: job.salaryRange,
            
            isRemote: job.title.toLowerCase().includes("remote"),
            jobProviders: job.jobProviders,
            companyUrl: job.company_url,
            logoPhotoUrl: job.image,
            ...(job.salaryRange && parseSalaryRange(job.salaryRange)),
          });
        }
      });
      //  console.log("jobssliec",jobs.slice(0,2))
      totalJobs = uniqueJobs.size;

      // Update the nextPage token for the next iteration
      nextPage = newNextPage;

      // Stop if there are no more pages or maxJobs is reached
      if (!nextPage || totalJobs >= maxJobs) break;

      // Add a delay to avoid hitting rate limits
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    return Array.from(uniqueJobs.values());
  } catch (error) {
    console.error("Error in fetchAllJobsForSearch:", error.message);
    return [];
  }
}

// Helper function to parse salary range
function parseSalaryRange(salaryRange: string) {
  if (!salaryRange) return {};

  const match = salaryRange.match(/(\d+)–(\d+)\s+(\w+)/);
  if (match) {
    return {
      minAmount: Number(match[1]),
      maxAmount: Number(match[2]),
      interval: match[3], // 'hour', 'year', etc.
    };
  }
  return {};
}
// function formatPostedDate(postedString: string): string {
//   const now = new Date();
//   if (postedString.includes("hour")) {
//     const hours = parseInt(postedString);
//     const date = new Date(now.getTime() - hours * 60 * 60 * 1000);
//     return date.toISOString().split("T")[0];
//   }
//   return now.toISOString().split("T")[0];
// }

export async function upsertJobService(
  jobActionData: any,
  payload: any
): Promise<RESPONSE> {
  try {
    let response: RESPONSE;

    // If _id exists, update the job, else create new
    if (payload._id) {
      const updatedJob = await Subscription.findOneAndUpdate(
        payload._id,
        { $set: payload },
        { new: true }
      );
      response = {
        status: 1,
        status_code: RESPONSE_CODES.PUT,
        message: RESPONSE_MESSAGES.jobUpdatedSuccessMsg,
        data: updatedJob,
      };
    } else {
      const savedJob = await Job.create(payload);
      jobActionData.jobId = savedJob._id;
      //@ts-ignore
      savedJob.action = await updateUserAppliedAndFollowedJobService(
        jobActionData
      );

      response = {
        status: 1,
        status_code: RESPONSE_CODES.POST,
        message: RESPONSE_MESSAGES.jobAddedSuccessMsg,
        data: savedJob,
      };
    }

    return response;
  } catch (error) {
    console.log("error,", error);
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
}

export const getAllJobsService = async (
  query: JobQueryParams,
  pagination: PaginationParams
): Promise<ServiceResponse> => {
  // console.log("Query in getAllJobsService function:", query);

  try {
    const aggregationPipeline: PipelineStage[] = [];

    // Base match condition
    const matchConditions: Record<string, any> = { isDeleted: false };

    // Date filtering
    if (query.startDate && query.endDate) {
      aggregationPipeline.push({
        $match: {
          publishedAt: {
            $gte: moment(query.startDate, "DD-MM-YYYY")
              .startOf("day")
              .valueOf(),
            $lte: moment(query.endDate, "DD-MM-YYYY").endOf("day").valueOf(),
          },
        },
      } as PipelineStage);
    } else if (query.date) {
      aggregationPipeline.push({
        $match: {
          publishedAt: {
            $gte: moment(query.date, "DD-MM-YYYY").startOf("day").valueOf(),
            $lte: moment(query.date, "DD-MM-YYYY").endOf("day").valueOf(),
          },
        },
      } as PipelineStage);
    }

    // Apply filters for job titles
    if (query.primaryJobTitle) {
      const jobTitles = query.primaryJobTitle
        .split(",")
        .map((title) => new RegExp(title.trim(), "i"));
      matchConditions.$or = jobTitles.map((regex) => ({
        title: { $regex: regex.source, $options: "i" },
      }));
    }

    if (query.secondaryJobTitle) {
      const secondaryJobTitles = query.secondaryJobTitle
        .split(",")
        .map((title) => new RegExp(title.trim(), "i"));
      matchConditions.$or = [
        ...(matchConditions.$or || []),
        ...secondaryJobTitles.map((regex) => ({
          title: { $regex: regex.source, $options: "i" },
        })),
      ];
    }

    // Add any other filter conditions such as avoidedJobTitleWords, excludedCompanies, etc.
    if (query.avoidedJobTitleWords) {
      const avoidedWords = query.avoidedJobTitleWords
        .split(",")
        .map((word) => new RegExp(word.trim(), "i"));
      matchConditions.title = {
        $not: {
          $regex: avoidedWords.map((regex) => regex.source).join("|"),
          $options: "i",
        },
      };
    }

    if (query.excludedCompanies) {
      const excludedCompanies = query.excludedCompanies
        .split(",")
        .map((company) => new RegExp(company.trim(), "i"));
      matchConditions.companyName = {
        $not: {
          $regex: excludedCompanies.map((regex) => regex.source).join("|"),
          $options: "i",
        },
      };
    }

    // if (query.specificIndustriesTechnologies) {
    //   const specificIndustries = query.specificIndustriesTechnologies
    //     .split(",")
    //     .map((industry) => new RegExp(industry.trim(), "i"));
    //   matchConditions.companyName = {
    //     $in: specificIndustries.map((regex) => regex.source),
    //   };
    // }

    if (query.specificIndustriesTechnologies) {
      const specificIndustries = query.specificIndustriesTechnologies
        .split(",")
        .map((industry) => new RegExp(industry.trim(), "i"));

      matchConditions.description = {
        $regex: specificIndustries.map((regex) => regex.source).join("|"),
        $options: "i",
      };
    }

    if (query.excludedIndustriesTechnologies) {
      const excludedKeywords = query.excludedIndustriesTechnologies
        .split(",")
        .map((keyword) => new RegExp(keyword.trim(), "i"));
      matchConditions.description = {
        $not: {
          $regex: excludedKeywords.map((regex) => regex.source).join("|"),
          $options: "i",
        },
      };
    }

    if (query.jobLocationPreference === "Remote") {
      matchConditions.isRemote = true;
    } else if (
      query.jobLocationPreference === "On-Location" ||
      query.jobLocationPreference === "Hybrid"
    ) {
      matchConditions.isRemote = false;
    } else {
      console.log("No specific job location preference selected.");
    }
    // Location filtering
    if (query.jobLocations && query.jobLocationPreference) {
      const locations = query.jobLocations
        .split(",")
        .map((loc) => loc.trim().toLowerCase());

      if (query.jobLocationPreference === "Remote") {
        matchConditions.isRemote = true;
      } else if (
        query.jobLocationPreference === "On-Location" ||
        query.jobLocationPreference === "Hybrid"
      ) {
        matchConditions.isRemote = false;
        matchConditions.location = {
          $in: locations.map((loc) => new RegExp(`\\b${loc}\\b`, "i")),
        };
      } else {
        console.log("No specific job location preference selected.");
      }
    }

    // console.log("Match conditions:", matchConditions);

    aggregationPipeline.push({ $match: matchConditions });

    // Lookup job preferences
    aggregationPipeline.push(
      {
        $lookup: {
          from: "jobPreferences",
          let: { userId: new Types.ObjectId(query.userId) },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] },
              },
            },
          ],
          as: "jobPreferences",
        },
      } as PipelineStage,
      {
        $unwind: {
          path: "$jobPreferences",
          preserveNullAndEmptyArrays: true,
        },
      } as PipelineStage
    );

    // Lookup exclusion preferences
    aggregationPipeline.push(
      {
        $lookup: {
          from: "exclusionPreferences",
          let: { userId: new Types.ObjectId(query.userId) },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$userId", "$$userId"] },
              },
            },
          ],
          as: "exclusionPreferences",
        },
      } as PipelineStage,
      {
        $unwind: {
          path: "$exclusionPreferences",
          preserveNullAndEmptyArrays: true,
        },
      } as PipelineStage
    );

    // Handle type 4 (daily jobs) differently
    if (query.type === 4) {
      aggregationPipeline.push({
        $lookup: {
          from: "jobActions",
          let: { jobId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$jobId", "$$jobId"] },
                    { $eq: ["$userId", new Types.ObjectId(query.userId)] },
                    { $eq: ["$isDeleted", false] },
                    { $in: ["$status", [1, 2, 3]] },
                  ],
                },
              },
            },
          ],
          as: "jobActions",
        },
      } as PipelineStage);

      // Only keep jobs that have NO interactions
      aggregationPipeline.push({
        $match: {
          jobActions: { $size: 0 },
        },
      } as PipelineStage);

      // Add search condition if provided
      if (query.search) {
        aggregationPipeline.push({
          $match: {
            $or: [
              { title: { $regex: query.search, $options: "i" } },
              { companyName: { $regex: query.search, $options: "i" } },
              { description: { $regex: query.search, $options: "i" } },
            ],
          },
        } as PipelineStage);
      }
    } else {
      // For all other types, check job actions
      const jobActionsMatch: any = {
        $expr: {
          $and: [
            { $eq: ["$jobId", "$$jobId"] },
            { $eq: ["$userId", new Types.ObjectId(query.userId)] },
            { $eq: ["$isDeleted", false] },
          ],
        },
      };

      if (query.type) {
        jobActionsMatch.$expr.$and.push({ $eq: ["$status", query.type] });
      }

      aggregationPipeline.push({
        $lookup: {
          from: "jobActions",
          let: { jobId: "$_id" },
          pipeline: [
            {
              $match: jobActionsMatch,
            },
          ],
          as: "jobActions",
        },
      } as PipelineStage);

      // Match based on job actions
      const mainMatch: any = {
        $and: [{ jobActions: query.type ? { $ne: [] } : { $size: 0 } }],
      };

      // Add search condition if provided
      if (query.search) {
        mainMatch.$and.push({
          $or: [
            { title: { $regex: query.search, $options: "i" } },
            { companyName: { $regex: query.search, $options: "i" } },
            { description: { $regex: query.search, $options: "i" } },
          ],
        });
      }

      aggregationPipeline.push({
        $match: mainMatch,
      } as PipelineStage);
    }

    // Project fields
    aggregationPipeline.push(
      {
        $project: {
          jobPreference: 0,
          exclusionPreference: 0,
          jobActions: 0,
        },
      } as PipelineStage,
      {
        $project: {
          title: 1,
          companyName: 1,
          companyUrl: 1,
          description: 1,
          location: 1,
          salary: 1,
          applyUrl: 1,
          publishedAt: 1,
          contractType: 1,
          workType: 1,
          isRemote: 1,
          isDeleted: 1,
        },
      } as PipelineStage
    );

    // Add sorting and pagination
    aggregationPipeline.push(
      { $sort: { publishedAt: -1 } } as PipelineStage,
      { $skip: pagination.skip } as PipelineStage,
      { $limit: pagination.limit } as PipelineStage
    );

    // Execute aggregation
    const [jobs, countResult] = await Promise.all([
      Job.aggregate(aggregationPipeline),
      Job.aggregate([
        ...aggregationPipeline.slice(0, -2),
        { $count: "total" } as PipelineStage,
      ]),
    ]);

    const total = countResult[0]?.total || 0;

    return {
      status: 1,
      status_code: RESPONSE_CODES.GET,
      message: RESPONSE_MESSAGES.jobFetchedSuccessMsg,
      data: jobs,
      metadata: {
        total,
        page: pagination.page,
        limit: pagination.limit,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };
  } catch (error) {
    throw {
      status: 0,
      status_code: RESPONSE_CODES.ERROR,
      message: error.message,
    };
  }
};
