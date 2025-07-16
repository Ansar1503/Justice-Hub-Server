import express from "express";
import {
  addReview,
  cancellAppoinment,
  cancelSession,
  createCheckoutSession,
  fetchAppointmentDetails,
  fetchClientData,
  fetchReviews,
  fetchReviewsBySession,
  fetchSessionDocuments,
  fetchSessions,
  fetchStripeSessionDetails,
  getLawyerDetail,
  getLawyers,
  getLawyerSlotDetais,
  getLawyerslotSettings,
  handleWebhooks,
  removeFailedSession,
  removeSessionDocument,
  sendVerifyMail,
  updateAddress,
  updateBasicInfo,
  updateEmail,
  updatePassword,
  uploadDocuments,
} from "../controller/client.controller";
import multer from "multer";
import {
  documentstorage,
  handleMulterErrors,
  profilestorage,
} from "../middelwares/multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import { authenticateClient } from "../middelwares/Auth/authenticateClient";
import { ChatController } from "../controller/chat.controller";
import { ChatUseCase } from "../../application/usecases/chat.usecase";
import { ChatRepo } from "../../infrastructure/database/repo/chat.repo";
import { SessionsRepository } from "../../infrastructure/database/repo/sessions.repo";

const chatcontroller = new ChatController(
  new ChatUseCase(new ChatRepo(), new SessionsRepository())
);

const upload = multer({ storage: profilestorage });
const documentUpload = multer({
  storage: documentstorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 3 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/webp",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error("Invalid file type. Only PDF, DOCX, and images are allowed.")
      );
    }
  },
});

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

// profile sessions
router.get(
  "/profile/sessions",
  authenticateUser,
  authenticateClient,
  fetchSessions
);
router.patch("/profile/sessions", authenticateUser, authenticateClient);
router.get(
  "/profile/sessions/document/:id",
  authenticateUser,
  authenticateClient,
  fetchSessionDocuments
);
router.post(
  "/profile/sessions/document",
  authenticateUser,
  authenticateClient,
  handleMulterErrors(documentUpload.array("documents", 3)),
  uploadDocuments
);
router.delete(
  "/profile/sessions/document/:id",
  authenticateUser,
  authenticateClient,
  removeSessionDocument
);
router.patch(
  "/profile/sessions/cancel",
  authenticateUser,
  authenticateClient,
  cancelSession
);

// chats
router.get(
  "/profile/chats",
  authenticateUser,
  authenticateClient,
  chatcontroller.getChats.bind(chatcontroller)
);

router.get(
  "/profile/chats/messages",
  authenticateUser,
  authenticateClient,
  chatcontroller.getMessages.bind(chatcontroller)
);

// lawyers finding and booking areas
router.get("/lawyers", authenticateUser, getLawyers);
router.get("/lawyers/:id", authenticateUser, getLawyerDetail);

// reviews
router.post("/lawyers/review", authenticateUser, addReview);
router.get(
  "/lawyers/reviews/:id",
  authenticateUser,
  authenticateClient,
  fetchReviews
);
router.get(
  "/profile/sessions/reviews/:id",
  authenticateUser,
  authenticateClient,
  fetchReviewsBySession
);

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
