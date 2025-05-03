import express from "express";
import {
  fetchClientData,
  getLawyers,
  sendVerifyMail,
  updateAddress,
  updateBasicInfo,
  updateEmail,
  updatePassword,
} from "../controller/client.controller";
import multer from "multer";
import { profilestorage } from "../middelwares/multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";

const upload = multer({ storage:profilestorage });

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
router.get("/lawyers",getLawyers)

export default router;
