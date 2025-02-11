import express, { Router } from "express";
import { authLogin, checkEmailController, forgotPassword, otpVerifyController, resetPasswordController, sendOtpController, userProfileController, } from "../controllers/authController";
import { checkEmailSchema, forgotPasswordSchema, loginSchema, otpVerifySchema, resetPasswordSchema, sendOtpSchema, userProfileSchema } from "../validators/auth";

export const authRoute = (): Router => {
  const router = express.Router();
  router.post("/login", loginSchema, authLogin);
  router.post('/forgot-password', forgotPasswordSchema, forgotPassword);
  router.get('/profile', userProfileSchema, userProfileController);
  router.post('/reset-password', resetPasswordSchema, resetPasswordController);
  router.post('/send-otp', sendOtpSchema, sendOtpController);
  router.put('/verify-otp', otpVerifySchema, otpVerifyController);
  router.get('/check-email', checkEmailSchema, checkEmailController);

  return router;
};