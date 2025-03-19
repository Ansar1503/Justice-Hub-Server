import express from "express";
import {
  handleRefreshToken,
  registerUser,
  userLogin,
  verifyMail,
} from "../controller/user_controller/user.controller";
import { validateUser } from "../middelwares/validator/user.validator";
import { handleValidationErrors } from "../middelwares/validator/validation.middleware";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";

const router = express.Router();

router.post("/signup", validateUser, handleValidationErrors, registerUser);
router.post("/login", userLogin);
router.get("/dashboard", authenticateUser, () => {
  console.log("auth sucess");
});
router.get("/refresh", handleRefreshToken);
router.get("/verify-email",verifyMail)

export default router;
