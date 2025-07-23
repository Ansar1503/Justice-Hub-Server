import express from "express";
import {
  chatDocumentstorage,
  documentstorage,
  handleMulterErrors,
} from "../middelwares/multer";
import multer from "multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import {
  addOverrideSlots,
  cancelSession,
  confirmClientAppointment,
  endSession,
  fetchAppointmentDetails,
  fetchAvailableSlots,
  fetchCallLogs,
  fetchLawyer,
  fetchOverrideSlots,
  fetchSessionDocuments,
  fetchSessions,
  fetchSlotSettings,
  JoinVideoSession,
  rejectClientAppointment,
  removeOverrideSlot,
  sendFileMessage,
  startSessionWithRoomID,
  updateAvailableSlot,
  updateSlotSettings,
  verifyLawyer,
} from "../controller/lawyer.controller";
import { authenticateLawyer } from "../middelwares/Auth/authenticateLawyer";
import { authenticateClient } from "../middelwares/Auth/authenticateClient";

const upload = multer({ storage: documentstorage });
const chatFile = multer({
  storage: chatDocumentstorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 3 },
});
const router = express.Router();

router.post(
  "/verification",
  authenticateUser,
  upload.fields([
    { name: "enrollment_certificate", maxCount: 1 },
    { name: "certificate_of_practice", maxCount: 1 },
    { name: "barcouncilid", maxCount: 1 },
  ]),
  verifyLawyer
);
router.get("/", authenticateUser, fetchLawyer);
router.patch(
  "/schedule/settings",
  authenticateUser,
  authenticateLawyer,
  updateSlotSettings
);
router.get(
  "/schedule/settings",
  authenticateUser,
  authenticateLawyer,
  fetchSlotSettings
);

router.patch(
  `/schedule/availability`,
  authenticateUser,
  authenticateLawyer,
  updateAvailableSlot
);
router.get(
  "/schedule/availability",
  authenticateUser,
  authenticateLawyer,
  fetchAvailableSlots
);
router.get(
  "/schedule/override",
  authenticateUser,
  authenticateLawyer,
  fetchOverrideSlots
);
router.post(
  `/schedule/override`,
  authenticateUser,
  authenticateLawyer,
  addOverrideSlots
);
router.delete(
  "/schedule/override/:id",
  authenticateUser,
  authenticateLawyer,
  removeOverrideSlot
);

// profiles
router.get(
  "/profile/appointments",
  authenticateUser,
  authenticateLawyer,
  fetchAppointmentDetails
);
router.patch(
  "/profile/appointments/reject",
  authenticateUser,
  authenticateLawyer,
  rejectClientAppointment
);
router.patch(
  "/profile/appointments/approve",
  authenticateUser,
  authenticateLawyer,
  confirmClientAppointment
);
// profile sesisons
router.get(
  "/profile/sessions",
  authenticateUser,
  authenticateLawyer,
  fetchSessions
);
router.get(
  "/profile/sessions/document/:id",
  authenticateUser,
  authenticateClient,
  authenticateLawyer,
  fetchSessionDocuments
);
router.patch(
  "/profile/sessions/startSession",
  authenticateUser,
  authenticateLawyer,
  startSessionWithRoomID
);
router.patch(
  "/profile/sessions/join",
  authenticateUser,
  authenticateLawyer,
  JoinVideoSession
);
router.patch(
  "/profile/sessions/endSession",
  authenticateUser,
  authenticateLawyer,
  endSession
);
router.patch(
  `/profile/sessions/cancel`,
  authenticateUser,
  authenticateLawyer,
  cancelSession
);
// chats
router.post(
  "/chat/sendFile",
  authenticateUser,
  authenticateLawyer,
  handleMulterErrors(chatFile.single("file")),
  sendFileMessage
);

router.get(
  "/profile/sessions/callLogs/:id",
  authenticateUser,
  authenticateLawyer,
  fetchCallLogs
);
export default router;
