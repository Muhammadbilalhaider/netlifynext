import express, { Router } from "express";
import { categoryAddSchema, categoryAllSchema, categoryDeleteSchema, categoryDetailSchema, categoryEditSchema,  } from "../validators/categories";
import { addCategoryController, categoryAllController, categoryDetailController, deleteCategoryController, editCategoryController } from "../controllers/categoryController";

export const categoriesRoute = (): Router => {
    const router = express.Router();
    router.post('/add', categoryAddSchema, addCategoryController);
    router.put('/edit', categoryEditSchema, editCategoryController);
    router.get('/detail', categoryDetailSchema, categoryDetailController);
    router.get('/all', categoryAllSchema, categoryAllController);
    router.put('/delete', categoryDeleteSchema, deleteCategoryController);

    return router;
};