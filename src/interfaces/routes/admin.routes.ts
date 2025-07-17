import express from "express";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import {
  BlockUser,
  changeLawyerVerificationStatus,
  deleteDisputeReviews,
  fetchAllLawyers,
  fetchAllUsers,
  fetchAppointmentDetails,
  fetchChatDisputes,
  fetchReviewDisputes,
  fetchSessionDetails,
} from "../controller/admin.controller";

const router = express.Router();

router.get("/users", authenticateUser, fetchAllUsers);
router.get("/lawyers", fetchAllLawyers);
router.patch("/user", authenticateUser, BlockUser);
router.patch("/lawyer", authenticateUser, changeLawyerVerificationStatus);

router.get("/appointments", authenticateUser, fetchAppointmentDetails);
router.get("/sessions", authenticateUser, fetchSessionDetails);

// disputes
router.get("/disputes/chat", authenticateUser, fetchChatDisputes);
router.get("/disputes/reviews", authenticateUser, fetchReviewDisputes);
router.delete(
  "/disputes/reviews/:reviewId/:disputeId",
  authenticateUser,
  deleteDisputeReviews
);
export default router;
