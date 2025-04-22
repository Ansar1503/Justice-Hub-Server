import express from "express";
import {
  fetchClientData,
  sendVerifyMail,
  updateAddress,
  updateBasicInfo,
  updateEmail,
  updatePassword,
} from "../controller/user_controller/client.controller";
import multer from "multer";
import { storage } from "../middelwares/multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";

const upload = multer({ storage });

const router = express.Router();

router.get("/profile", authenticateUser, fetchClientData);
router.put(
  "/profile/basic",
  authenticateUser,
  upload.single("image"),
  updateBasicInfo
);
router.put("/profile/personal", authenticateUser, updateEmail);
router.post("/profile/verifyMail", authenticateUser, sendVerifyMail);
router.put("/profile/updatePassword", authenticateUser, updatePassword);
router.post("/profile/address", authenticateUser, updateAddress);

export default router;
