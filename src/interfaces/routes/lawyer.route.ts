import express from "express";
import { documentstorage } from "../middelwares/multer";
import multer from "multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import {
  addOverrideSlots,
  cancelSession,
  confirmClientAppointment,
  endSession,
  fetchAppointmentDetails,
  fetchAvailableSlots,
  fetchLawyer,
  fetchOverrideSlots,
  fetchSessionDocuments,
  fetchSessions,
  fetchSlotSettings,
  rejectClientAppointment,
  removeOverrideSlot,
  startSessionWithRoomID,
  updateAvailableSlot,
  updateSlotSettings,
  verifyLawyer,
} from "../controller/lawyer.controller";
import { authenticateLawyer } from "../middelwares/Auth/authenticateLawyer";
import { authenticateClient } from "../middelwares/Auth/authenticateClient";

const upload = multer({ storage: documentstorage });

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

export default router;
