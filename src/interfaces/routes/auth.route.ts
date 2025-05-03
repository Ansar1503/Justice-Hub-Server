import express from "express";
import {
  GoogleRegistration,
  handleRefreshToken,
  registerUser,
  ResendOtp,
  userLogin,
  verifyEmailOtp,
  verifyMail,
} from "../controller/user.controller";
import { validateUser } from "../middelwares/validator/user.validator";
import { handleValidationErrors } from "../middelwares/validator/validation.middleware";


const router = express.Router();

router.post("/signup", validateUser, handleValidationErrors, registerUser);
router.post("/login", userLogin);
router.get("/refresh", handleRefreshToken);
router.get("/verify-email",verifyMail)
router.post("/verify-otp",verifyEmailOtp)
router.post("/resend-otp",ResendOtp)
router.post("/google/signup",GoogleRegistration)



export default router;
