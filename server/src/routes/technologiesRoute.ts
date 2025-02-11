import express, { Router } from "express";
import { technologyAddSchema, technologyAllSchema } from "../validators/technologies";
import { addTechnologiesController, technologiesAllController } from "../controllers/technologyController";

export const technologiesRoute = (): Router => {
    const router = express.Router();
    router.post('/add', technologyAddSchema, addTechnologiesController);
    router.get('/all', technologyAllSchema, technologiesAllController);

    return router;
};