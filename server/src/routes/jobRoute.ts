import express, { Router } from "express";
import { upsertJobController, getAllJobsController, addAndUpdateJobPreferenceController } from "../controllers/jobController";
import { updateStatus } from "../validators/jobs";



export const jobRoute = (): Router => {
    const router = express.Router();
    router.get('/all',
    // jobsAllSchema, 
    getAllJobsController);
    router.put('/preference', updateStatus, addAndUpdateJobPreferenceController);
    router.post('/upsert', upsertJobController);
    return router;
};