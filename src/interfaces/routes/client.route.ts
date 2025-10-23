import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
// import { ChatController } from "../controller/chat.controller";
// import { ChatUseCase } from "../../application/usecases/chat.usecase";
// import { ChatRepo } from "../../infrastructure/database/repo/chat.repo";
// import { SessionsRepository } from "../../infrastructure/database/repo/sessions.repo";
import { expressAdapter } from "@interfaces/adapters/express";
import { FetchClientDataComposer } from "@infrastructure/services/composers/Client/Profile/FetchClientDataComposer";
import { updateClientDataComposer } from "@infrastructure/services/composers/Client/Profile/UpdateBasicInfo";
import { UpdateEmailComposer } from "@infrastructure/services/composers/Client/Profile/UpdateEmailComposer";
import { SendVerificationMailComposer } from "@infrastructure/services/composers/Client/Profile/SendVerificationMailComposer";
import { UpdatePasswordComposer } from "@infrastructure/services/composers/Client/Profile/UpdatePasswordComposer";
import { UpdateAddressComposer } from "@infrastructure/services/composers/Client/Profile/UpdateAddressComposer";
import { FetchAppointmentDataComposer } from "@infrastructure/services/composers/Client/Appointment/FetchAppointmentsComposer";
import { fetchSessionsComposer } from "@infrastructure/services/composers/Admin/FetchSessions";
import { FetchSessionDocumentsComposer } from "@infrastructure/services/composers/Client/sessions/FetchSessionDocumentsComposer";
import { UploadSessionDocumentsComposer } from "@infrastructure/services/composers/Client/sessions/UploadSessionDocumentsComposer";
import { RemoveSessionDocumentComposer } from "@infrastructure/services/composers/Client/sessions/RemoveSessionDocumentComposer";
import { GetLawyersComposer } from "@infrastructure/services/composers/Client/LawyerProfile/GetLawyerComposer";
import { GetLawyerDetailComposer } from "@infrastructure/services/composers/Client/LawyerProfile/GetLawyerDetailsComposer";
import { FetchReviewsComposer } from "@infrastructure/services/composers/Client/review/FetchReviewsComposers";
import { FetchReviewsBySessionComposer } from "@infrastructure/services/composers/Client/review/FetchReviewBySessionComposer";
import { UpdateReviewsComposer } from "@infrastructure/services/composers/Client/review/UpdateReviewComposer";
import { DeleteReviewComposer } from "@infrastructure/services/composers/Client/review/DeleteReviewComposer";
import { AddReviewComposer } from "@infrastructure/services/composers/Client/review/AddReviewComposer";
import { ReportReviewComposer } from "@infrastructure/services/composers/Client/review/Report ReviewComposer";
import { GetLawyerSlotDetailsComposer } from "@infrastructure/services/composers/Client/LawyerProfile/GetLawyerSlotDetails";
import { CreateCheckoutSessionComposer } from "@infrastructure/services/composers/Client/sessions/CreateCheckouSessionComposer";
import { HandleWebhookComposer } from "@infrastructure/services/composers/Client/StripeWebHookComposer";
import { FetchStripeSessionDetailsComposer } from "@infrastructure/services/composers/Client/FetchStripeSessionDetailsComposer";
import { RemoveFailedSessionComposer } from "@infrastructure/services/composers/Client/sessions/RemoveFailedSessionComposer";
import { SendMessageFileComposer } from "@infrastructure/services/composers/Client/SendMessageFileComposer";
import { GetChatsComposer } from "@infrastructure/services/composers/Chats/GetChatsComposer";
import { GetMessagesComposer } from "@infrastructure/services/composers/Chats/GetMessagesComposer";
import { FetchSlotSettingsComposer } from "@infrastructure/services/composers/Lawyer/Slots/FetchSlotSettingsComposer";
import { CancelAppointmentComposer } from "@infrastructure/services/composers/Client/Appointment/CancelAppointmentsComposer";
import { CancelSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/CancelSessionComposer";
import { EndSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/EndSessionComposer";
import { JoinVideoSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/JoinVideoSessionComposer";
import { FetchCallLogsSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/FetchCallLogsSessionComposer";
import { FetchReviewsByUserIdComposer } from "@infrastructure/services/composers/Client/review/FetchReviewsByUserIdComposer";
import {
  CasesRoutes,
  CasetypeRoutes,
  ClientRoutes,
  CommissionRoutes,
  CommonParamsRoute,
  PracticeAreaRoutes,
  SpecializationRoute,
  SubscriptionRoute,
  WalletRoutes,
} from "@shared/constant/RouteConstant";
import { FetchAllNotificationsComposer } from "@infrastructure/services/composers/Notification/FetchAllNotificationsComposer";
import { UpdateNotificationStatusComposer } from "@infrastructure/services/composers/Notification/UpdateNotificationStatusComposer";
import { MarkAllNotificationAsReadComposer } from "@infrastructure/services/composers/Notification/MarkAllNotificationAsRead";
import { FetchWalletByUserComposer } from "@infrastructure/services/composers/Wallet/FetchWalletByUserComposer";
import { FetchTransactionsByWalletComposer } from "@infrastructure/services/composers/Wallet/FetchTransactionsByWalletComposer";
import { FetchAllSpecializationsComposer } from "@infrastructure/services/composers/Specializations/FetchAllSpecializations";
import { FindPracticeAreasBySpecIdsComposer } from "@infrastructure/services/composers/PracticeAreas/FindPracticeAreasBySpecIdsComposer";
import { FetchProfileImageComposer } from "@infrastructure/services/composers/Client/Profile/FetchProfileImageComposer";
import { FindAllCaseTypesComposer } from "@infrastructure/services/composers/Casetypes/FindAllCasetypes";
import { FindAllCasesByQueryComposer } from "@infrastructure/services/composers/Cases/FindAllCasesByQueryComposer";
import { FindCaseTypesByPracticeAreasComposer } from "@infrastructure/services/composers/Casetypes/FetchCaseTypesByPracitceAreaIds";
import { FindCaseDetailsComposer } from "@infrastructure/services/composers/Cases/FindCaseDetailsComposer";
import { FindAppointmentByCaseComposer } from "@infrastructure/services/composers/Appointments/FindAppointmentByCaseComposer";
import { BookAppointmentByWalletComposer } from "@infrastructure/services/composers/Client/Appointment/BookAppointmentByWalletComposer";
import { FindSessionsByCaseComposer } from "@infrastructure/services/composers/Sessions/FindSessionsByCase";
import { authenticateClient } from "../middelwares/Auth/authenticateClient";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import {
  caseDocumentStorage,
  chatDocumentstorage,
  documentstorage,
  handleMulterErrors,
  profilestorage,
} from "../middelwares/multer";
import { UploadCaseDocumentsComposer } from "@infrastructure/services/composers/Cases/UploadCaseDocumentComposer";
import { FindCaseDocumentsByCaseComposer } from "@infrastructure/services/composers/Cases/FindCaseDocumentsQueryComposer";
import { DeleteCaseDocumentComposer } from "@infrastructure/services/composers/Cases/DeleteCaseDocumentsComposer";
import { FetchCaseByCaseTypesComposer } from "@infrastructure/services/composers/Cases/FetchCaseByCaseTypesComposer";
import { CreateFollowupCheckoutSessionComposer } from "@infrastructure/services/composers/Client/sessions/CreateFollowupSessionComposer";
import { FetchCommissionSettingsComposer } from "@infrastructure/services/composers/Commission/FetchCommissionSettingsComposer";
import { FetchAllCasesByUserComposer } from "@infrastructure/services/composers/Cases/FetchAllCasesByUserComposer";
import { FetchClientDashboardDataComposer } from "@infrastructure/services/composers/Cases/FetchClientDashboardDataComposer";
import { FetchAllSubscriptionPlansComposer } from "@infrastructure/services/composers/Subscriptions/FetchAllSubscriptionPlansComposer";
import { SubscribePlanComposer } from "@infrastructure/services/composers/Subscriptions/SubscribePlanComposer";
import { HandleSubscribeWebhookComposer } from "@infrastructure/services/composers/Subscriptions/HandleSubscriptionWebhookHandlerComposer";
import { FetchCurrentUserSubscriptionComposer } from "@infrastructure/services/composers/Subscriptions/FetchUserSubscriptionComposer";
import { CancelSubscriptionComposer } from "@infrastructure/services/composers/Subscriptions/CancelSubscriptionComposer";
import { FetchLawyerCalendarAvailabilityComposer } from "@infrastructure/services/composers/Client/FetchLawyerCalendarAvailabiltyComposer";

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
const chatFile = multer({
  storage: chatDocumentstorage,
  limits: { fileSize: 10 * 1024 * 1024, files: 3 },
});

const caseDocumentUpload = multer({
  storage: caseDocumentStorage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF and images are allowed."));
    }
  },
});

const router = express.Router();

// subscriptions
router.get(
  SubscriptionRoute.base,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchAllSubscriptionPlansComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.post(
  SubscriptionRoute.base + SubscriptionRoute.subscribe,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, SubscribePlanComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.post(
  ClientRoutes.stripe.subscriptionWebhook,
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, HandleSubscribeWebhookComposer());
    res.status(adapter.statusCode).send(adapter.body);
    return;
  }
);

router.get(
  ClientRoutes.lawyers.FetchLawyerCalendarAvailabilty,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchLawyerCalendarAvailabilityComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
  }
);

router.delete(
  SubscriptionRoute.base + SubscriptionRoute.user,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, CancelSubscriptionComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  SubscriptionRoute.base + SubscriptionRoute.user,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchCurrentUserSubscriptionComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

// profile area
router.get(
  ClientRoutes.profile.base + ClientRoutes.profile.image,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchProfileImageComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  ClientRoutes.profile.base,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, FetchClientDataComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);
router.put(
  ClientRoutes.profile.basic,
  authenticateUser,
  upload.single("image"),
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, updateClientDataComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.put(
  ClientRoutes.profile.personal,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdateEmailComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.post(
  ClientRoutes.profile.verifyMail,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, SendVerificationMailComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.put(
  ClientRoutes.profile.updatePassword,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdatePasswordComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.post(
  ClientRoutes.profile.address,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdateAddressComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router
  .route(ClientRoutes.profile.appointments)
  .all(authenticateUser, authenticateClient)
  .patch(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, CancelAppointmentComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  })
  .get(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchAppointmentDataComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  });

// profile sessions
router.get(
  ClientRoutes.profile.sessions,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, fetchSessionsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router
  .route(ClientRoutes.profile.sessionDocs.byId)
  .all(authenticateUser, authenticateClient)
  .get(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchSessionDocumentsComposer());
    res.status(adapter.statusCode).json(adapter.body);
  })
  .delete(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, RemoveSessionDocumentComposer());
    res.status(adapter.statusCode).json(adapter.body);
  });

router.post(
  ClientRoutes.profile.sessionDocs.base,
  authenticateUser,
  authenticateClient,
  handleMulterErrors(documentUpload.array("documents", 3)),
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UploadSessionDocumentsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.patch(
  ClientRoutes.profile.cancelSession,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adapter = await expressAdapter(req, CancelSessionComposer());
      res.status(adapter.statusCode).json(adapter.body);
    } catch (error) {
      next(error);
    }
  }
);
router.patch(
  ClientRoutes.profile.endSession,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adapter = await expressAdapter(req, EndSessionComposer());
      res.status(adapter.statusCode).json(adapter.body);
    } catch (error) {
      next(error);
    }
  }
);

// chats
router.get(
  ClientRoutes.profile.chats,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, GetChatsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  ClientRoutes.profile.chatMessages,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, GetMessagesComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

// lawyers finding and booking areas
router.get(
  ClientRoutes.lawyers.base,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adaper = await expressAdapter(req, GetLawyersComposer());
    res.status(adaper.statusCode).json(adaper.body);
    return;
  }
);
router.get(
  ClientRoutes.lawyers.byId,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, GetLawyerDetailComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

// reviews
router.post(
  ClientRoutes.lawyers.review,
  authenticateUser,
  async (req: Request, res: Response) => {
    req.body.user = req.user;
    const adapter = await expressAdapter(req, AddReviewComposer());
    res.status(adapter.statusCode).json(adapter.body);
  }
);
router.get(
  ClientRoutes.lawyers.reviewsByLawyer,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchReviewsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  ClientRoutes.profile.reviews,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchReviewsByUserIdComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  ClientRoutes.profile.reviewsBySession,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchReviewsBySessionComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router
  .route(ClientRoutes.profile.reviewById)
  .all(authenticateUser, authenticateClient)
  .put(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UpdateReviewsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  })
  .delete(async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, DeleteReviewComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  });

router.post(
  ClientRoutes.profile.reportReview,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, ReportReviewComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

// slot area
router.get(
  ClientRoutes.lawyers.settings,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchSlotSettingsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  ClientRoutes.lawyers.slots,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, GetLawyerSlotDetailsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.post(
  ClientRoutes.slots.checkout,
  authenticateUser,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      await CreateCheckoutSessionComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.post(
  ClientRoutes.slots.followup,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      await CreateFollowupCheckoutSessionComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  ClientRoutes.stripe.session,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchStripeSessionDetailsComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.delete(
  ClientRoutes.slots.removeFailed,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, RemoveFailedSessionComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.post(
  ClientRoutes.chat.sendFile,
  authenticateUser,
  authenticateClient,
  handleMulterErrors(chatFile.single("file")),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const adapter = await expressAdapter(req, SendMessageFileComposer());
      res.status(adapter.statusCode).json(adapter.body);
    } catch (error) {
      next(error);
    }
  }
);

// stripe  webjook
router.post(
  ClientRoutes.stripe.webhook,
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, HandleWebhookComposer());
    res.status(adapter.statusCode).send(adapter.body);
    return;
  }
);
router.patch(
  ClientRoutes.profile.join,
  authenticateUser,
  authenticateClient,
  async (req, res) => {
    const controller = JoinVideoSessionComposer();
    const response = await expressAdapter(req, controller);
    res.status(response.statusCode).json(response.body);
  }
);
router.get(
  ClientRoutes.profile.callLogs,
  authenticateUser,
  authenticateClient,
  async (req, res) => {
    const controller = FetchCallLogsSessionComposer();
    const response = await expressAdapter(req, controller);
    res.status(response.statusCode).json(response.body);
  }
);

router.patch(
  ClientRoutes.notifcation.updateStatus,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      UpdateNotificationStatusComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  ClientRoutes.notifcation.getAllNotifications,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchAllNotificationsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.put(
  ClientRoutes.notifcation.markAllAsRead,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      MarkAllNotificationAsReadComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  WalletRoutes.base,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchWalletByUserComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);
router.get(
  WalletRoutes.base + WalletRoutes.transactions,
  authenticateUser,
  authenticateClient,
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
  SpecializationRoute.base,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchAllSpecializationsComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  PracticeAreaRoutes.base,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FindPracticeAreasBySpecIdsComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  CasetypeRoutes.base,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FindAllCaseTypesComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  CasetypeRoutes.base + PracticeAreaRoutes.base,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FindCaseTypesByPracticeAreasComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  CasesRoutes.base,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FindAllCasesByQueryComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.post(
  ClientRoutes.lawyers.walletbook,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      BookAppointmentByWalletComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.post(
  CasesRoutes.base + CasesRoutes.documents,
  authenticateUser,
  authenticateClient,
  caseDocumentUpload.single("file"),
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, UploadCaseDocumentsComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  CasesRoutes.base + CasesRoutes.caseTypes + CasesRoutes.ids,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchCaseByCaseTypesComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  CommissionRoutes.base + CommissionRoutes.settings,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchCommissionSettingsComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  CasesRoutes.base + CasesRoutes.user,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FetchAllCasesByUserComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  ClientRoutes.dashboard,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FetchClientDashboardDataComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  CasesRoutes.base + CasesRoutes.appointments + CommonParamsRoute.params,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FindAppointmentByCaseComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  CasesRoutes.base + CasesRoutes.sessions + CommonParamsRoute.params,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FindSessionsByCaseComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  CasesRoutes.base + CasesRoutes.documents + CommonParamsRoute.params,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(
      req,
      FindCaseDocumentsByCaseComposer()
    );
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.delete(
  CasesRoutes.base + CasesRoutes.documents + CommonParamsRoute.params,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, DeleteCaseDocumentComposer());
    res.status(adapter.statusCode).json(adapter.body);
    return;
  }
);

router.get(
  CasesRoutes.base + CommonParamsRoute.params,
  authenticateUser,
  authenticateClient,
  async (req: Request, res: Response) => {
    const adapter = await expressAdapter(req, FindCaseDetailsComposer());
    res.status(adapter.statusCode).json(adapter.body);
  }
);

export default router;
