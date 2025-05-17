import express from "express";
import {
  addReview,
  createCheckoutSession,
  fetchClientData,
  fetchStripeSessionDetails,
  getLawyerDetail,
  getLawyers,
  getLawyerSlotDetais,
  handleWebhooks,
  sendVerifyMail,
  updateAddress,
  updateBasicInfo,
  updateEmail,
  updatePassword,
} from "../controller/client.controller";
import multer from "multer";
import { profilestorage } from "../middelwares/multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";

const upload = multer({ storage: profilestorage });

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
router.get("/lawyers", authenticateUser, getLawyers);
router.get("/lawyers/:id", authenticateUser, getLawyerDetail);
router.post("/lawyers/review/", authenticateUser, addReview);
router.get("/lawyers/slots/:id", authenticateUser, getLawyerSlotDetais);
router.post(
  "/lawyer/slots/checkout-session/",
  authenticateUser,
  createCheckoutSession
);
router.get("/stripe/success/:id", authenticateUser,fetchStripeSessionDetails);
router.post("/stripe/webhooks", authenticateUser, handleWebhooks);

export default router;
