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
import {
  AdminRoutes,
  PracticeAreaRoutes,
  SpecializationRoute,
  WalletRoutes,
} from "@shared/constant/RouteConstant";
import { FetchTransactionsByWalletComposer } from "@infrastructure/services/composers/Wallet/FetchTransactionsByWalletComposer";
import { FetchWalletByUserComposer } from "@infrastructure/services/composers/Wallet/FetchWalletByUserComposer";
import { FetchAllSpecializationsComposer } from "@infrastructure/services/composers/Specializations/FetchAllSpecializations";
import { AddSpecializationComposer } from "@infrastructure/services/composers/Specializations/AddSpecialization";
import { DeleteSpecializationComposer } from "@infrastructure/services/composers/Specializations/DeleteSpecializationComposer";
import { AddPracticeAreasComposer } from "@infrastructure/services/composers/PracticeAreas/AddPracticeAreasComposer";
import { FindAllPracticeAreaComposer } from "@infrastructure/services/composers/PracticeAreas/FindAllPracticeAreaComposer";
import { UpdatePracticeAreaComposer } from "@infrastructure/services/composers/PracticeAreas/UpdatePracticeAreaComposer";
import { DeletePracticeAreaComposer } from "@infrastructure/services/composers/PracticeAreas/DeletPracticeAreaComposer";

const router = Router();

router.get(
  AdminRoutes.users,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchAllUserComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  AdminRoutes.lawyers,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchAllLawyersComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.patch(
  AdminRoutes.blockUser,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, BlockUserComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.patch(
  AdminRoutes.changeLawyerVerification,
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
  AdminRoutes.profileAppointments,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchAppointmentDataComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  AdminRoutes.profileSessions,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, fetchSessionsComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);

// disputes
router.get(
  AdminRoutes.reviewDisputes,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, FetchReviewDipsutesComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);

router.get(
  AdminRoutes.chatDisputes,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchChatDisputesComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.put(
  AdminRoutes.updateDisputeStatus,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdateDisputesStatusComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  WalletRoutes.base + WalletRoutes.transactions,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchTransactionsByWalletComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  WalletRoutes.base,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchWalletByUserComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router
  .route(SpecializationRoute.base)
  .all(authenticateUser)
  .get(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchAllSpecializationsComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  })
  .patch(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, AddSpecializationComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  });

router.delete(
  SpecializationRoute.base + SpecializationRoute.params,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, DeleteSpecializationComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router
  .route(PracticeAreaRoutes.base)
  .all(authenticateUser)
  .post(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, AddPracticeAreasComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  })
  .get(async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, FindAllPracticeAreaComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  })
  .put(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdatePracticeAreaComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  });

router.delete(
  PracticeAreaRoutes.base + PracticeAreaRoutes.params,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, DeletePracticeAreaComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

export default router;
