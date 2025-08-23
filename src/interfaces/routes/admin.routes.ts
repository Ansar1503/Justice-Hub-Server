import { Request, Response, Router } from "express";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import { expressAdapter } from "@interfaces/adapters/express";
import { FetchAllUserComposer } from "@infrastructure/services/composers/Admin/FetchAllUsers";
import { FetchAllLawyersComposer } from "@infrastructure/services/composers/Admin/FetchAllLawyers";
import { BlockUserComposer } from "@infrastructure/services/composers/Admin/BlockUser";
import { ChangeLawyerVerificationComposer } from "@infrastructure/services/composers/Admin/ChangeLawyerVerificationStatus";
import { fetchSessionsComposer } from "@infrastructure/services/composers/Admin/FetchSessions";
import { FetchReviewDipsutesComposer } from "@infrastructure/services/composers/Admin/FetchReviewDisputes";
import { FetchChatDisputesComposer } from "@infrastructure/services/composers/Admin/FetchChatDisputesComposer";
import { UpdateDisputesStatusComposer } from "@infrastructure/services/composers/Admin/UpdateDisputesStatusComposer";
import { FetchAppointmentDataComposer } from "@infrastructure/services/composers/Client/Appointment/FetchAppointmentsComposer";

const router = Router();

router.get("/users", async (req: Request, res: Response) => {
  const adapter = await expressAdapter(req, FetchAllUserComposer());
  res.status(adapter.statusCode).json(adapter.body);
  return;
});
router.get(
  "/lawyers",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchAllLawyersComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.patch("/user", authenticateUser, async (req: Request, res: Response) => {
  const adapter = await expressAdapter(req, BlockUserComposer());
  res.status(adapter.statusCode).json(adapter.body);
  return;
});
router.patch(
  "/lawyer",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      ChangeLawyerVerificationComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  "/profile/appointments",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchAppointmentDataComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  "/profile/sessions",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, fetchSessionsComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);

// disputes
router.get(
  "/disputes/reviews",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, FetchReviewDipsutesComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);

router.get(
  "/disputes/chat",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchChatDisputesComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.put(
  "/disputes/status/:id",
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdateDisputesStatusComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

export default router;
