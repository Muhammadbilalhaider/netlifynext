import express, { Router } from "express";
import { changePasswordController, changeStatusController, getAllUsersController, getUserInfoController, userRegisterController, addJobPreferencesController, editUserProfileController, deleteUserController } from "../controllers/userController";
import { changePasswordSchema, changeStatusSchema, getAllUsersSchema, getUserDetailSchema, userRegisterSchema, userRegisterStep3Schema, updateUserProfileSchema, userDeleteSchema} from "../validators/user";

export const userRoute = (): Router => {
  const router = express.Router();
  router.get('/profile', getUserDetailSchema, getUserInfoController);
  router.post('/register', userRegisterSchema, userRegisterController);
  router.put('/addJobPreferences', userRegisterStep3Schema, addJobPreferencesController);
  router.put('/change-status', changeStatusSchema, changeStatusController);
  router.get('/all', getAllUsersSchema, getAllUsersController);
  router.put('/change-password', changePasswordSchema, changePasswordController);
  router.put('/edit-profile', updateUserProfileSchema , editUserProfileController);
  router.put('/delete', userDeleteSchema, deleteUserController);
   return router;
};
