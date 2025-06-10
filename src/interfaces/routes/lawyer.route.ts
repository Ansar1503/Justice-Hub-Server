import express from "express";
import { documentstorage } from "../middelwares/multer";
import multer from "multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import {
  addOverrideSlots,
  confirmClientAppointment,
  fetchAppointmentDetails,
  fetchAvailableSlots,
  fetchLawyer,
  fetchOverrideSlots,
  fetchSlotSettings,
  rejectClientAppointment,
  removeOverrideSlot,
  updateAvailableSlot,
  updateSlotSettings,
  verifyLawyer,
} from "../controller/lawyer.controller";
import { authenticateLawyer } from "../middelwares/Auth/authenticateLawyer";

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

export default router;
