import { Request, Response, Router } from "express";
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
  CasetypeRoutes,
  CommissionRoutes,
  PracticeAreaRoutes,
  SpecializationRoute,
  SubscriptionRoute,
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
import { FindAllCasetypeComposer } from "@infrastructure/services/composers/Casetypes/FindAllCasetypeComposer";
import { AddCaseTypeComposer } from "@infrastructure/services/composers/Casetypes/AddCaseTypeComposer";
import { UpdateCasetypeComposer } from "@infrastructure/services/composers/Casetypes/UpdateCasetypeComposer";
import { DeleteCasetypeComposer } from "@infrastructure/services/composers/Casetypes/DeleteCasetypeComposer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import { CreateOrUpdateCommissionSettingsComposer } from "@infrastructure/services/composers/Commission/CreateOrUpdateCommissionSettingsComposer";
import { FetchCommissionSettingsComposer } from "@infrastructure/services/composers/Commission/FetchCommissionSettingsComposer";
import { FetchAdminDashboardDataComposer } from "@infrastructure/services/composers/Admin/FetchAdminDashboardDataCommposer";

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

router
  .route(CasetypeRoutes.base)
  .all(authenticateUser)
  .get(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FindAllCasetypeComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  })
  .post(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, AddCaseTypeComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  })
  .put(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdateCasetypeComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  });

router.delete(
  CasetypeRoutes.base + CasetypeRoutes.params,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, DeleteCasetypeComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router
  .route(CommissionRoutes.base + CommissionRoutes.settings)
  .all(authenticateUser)
  .post(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      CreateOrUpdateCommissionSettingsComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
  })
  .get(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchCommissionSettingsComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  });

router.get(
  AdminRoutes.dashboard + AdminRoutes.overview,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchAdminDashboardDataComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router
  .route(SubscriptionRoute.base)
  .all(authenticateUser)
  .post(async (req: Request, res: Response) => {});

export default router;
