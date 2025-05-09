import express from "express";
import { documentstorage } from "../middelwares/multer";
import multer from "multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import {
  addBlockedSchedule,
  deleteBlockedSchedule,
  fetchAllBlockedSchedule,
  fetchLawyer,
  verifyLawyer,
} from "../controller/lawyer.controller";

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
router.post("/schedule/block", authenticateUser, addBlockedSchedule);
router.get("/schedule/block", authenticateUser, fetchAllBlockedSchedule);
router.delete("/schedule/block/:id", authenticateUser, deleteBlockedSchedule);

export default router;
