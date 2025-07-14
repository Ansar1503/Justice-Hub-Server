import express from "express";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import {
  BlockUser,
  changeLawyerVerificationStatus,
  fetchAllLawyers,
  fetchAllUsers,
  fetchAppointmentDetails,
  fetchSessionDetails,
} from "../controller/admin.controller";

const router = express.Router();

router.get("/users", authenticateUser, fetchAllUsers);
router.get("/lawyers", fetchAllLawyers);
router.patch("/user", authenticateUser, BlockUser);
router.patch("/lawyer", authenticateUser, changeLawyerVerificationStatus);

router.get("/appointments",authenticateUser,fetchAppointmentDetails)
router.get("/sessions", authenticateUser,fetchSessionDetails);

export default router;
