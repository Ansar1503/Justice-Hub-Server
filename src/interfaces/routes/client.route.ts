import express from "express";
import {
  fetchClientData,
  updateBasicInfo,
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
)


export default router;
