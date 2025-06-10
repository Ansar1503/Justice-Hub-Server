import express from "express";
import {
  addReview,
  cancellAppoinment,
  createCheckoutSession,
  fetchAppointmentDetails,
  fetchClientData,
  fetchStripeSessionDetails,
  getLawyerDetail,
  getLawyers,
  getLawyerSlotDetais,
  getLawyerslotSettings,
  handleWebhooks,
  removeFailedSession,
  sendVerifyMail,
  updateAddress,
  updateBasicInfo,
  updateEmail,
  updatePassword,
} from "../controller/client.controller";
import multer from "multer";
import { profilestorage } from "../middelwares/multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import { authenticateClient } from "../middelwares/Auth/authenticateClient";

const upload = multer({ storage: profilestorage });

const router = express.Router();

// profile area
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
router.patch(
  "/profile/appointments",
  authenticateUser,
  authenticateClient,
  cancellAppoinment
);
router.get(
  "/profile/appointments",
  authenticateUser,
  authenticateClient,
  fetchAppointmentDetails
);

// lawyers finding and booking areas
router.get("/lawyers", authenticateUser, getLawyers);
router.get("/lawyers/:id", authenticateUser, getLawyerDetail);
router.post("/lawyers/review", authenticateUser, addReview);

// slot area
router.get(
  "/lawyers/settings/:id",
  authenticateUser,
  authenticateClient,
  getLawyerslotSettings
);
router.get("/lawyers/slots/:id", authenticateUser, getLawyerSlotDetais);
router.post(
  "/lawyer/slots/checkout-session/",
  authenticateUser,
  createCheckoutSession
);
router.get(
  "/stripe/session/:id",
  authenticateUser,
  authenticateClient,
  fetchStripeSessionDetails
);
router.delete(
  "/lawyer/slots/session/:id",
  authenticateUser,
  authenticateClient,
  removeFailedSession
);
// router.get("/stripe/success/:id", authenticateUser,fetchStripeSessionDetails);

// stripe  webjook
router.post(
  "/stripe/webhooks",
  express.raw({ type: "application/json" }),
  handleWebhooks
);

export default router;
