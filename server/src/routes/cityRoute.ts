import express, { Router } from "express";
import { getAllCountryCityController } from "../controllers/cityController";

export const cityRoute = (): Router => {
    const router = express.Router();
    router.get('/all', getAllCountryCityController);

    return router;
};
