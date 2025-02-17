import { CronJob } from "cron";
import { getJobsFromScraperAndInsertInDb } from "../services/jobServices";

const runCronJob = async (): Promise<void> => {
  try {
    // getJobsFromScraperAndInsertInDb();
  } catch (error) {
    console.error("Cron job error---:", error.message);
  }
};

// Schedule the cron job to run every 5 minutes
// const job = new CronJob('0 3 * * *', runCronJob, null, true, 'America/Los_Angeles');
const job = new CronJob("0 15 * * *", runCronJob, null, true, "Asia/Kolkata");

// Start the cron job
job.start();

export default runCronJob;
