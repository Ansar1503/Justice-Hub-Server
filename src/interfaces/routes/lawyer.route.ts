import express, { Request, Response } from "express";
import {
    chatDocumentstorage,
    documentstorage,
    handleMulterErrors,
} from "../middelwares/multer";
import multer from "multer";
import { authenticateUser } from "../middelwares/Auth/auth.middleware";
import { authenticateLawyer } from "../middelwares/Auth/authenticateLawyer";
import { authenticateClient } from "../middelwares/Auth/authenticateClient";
import { expressAdapter } from "@interfaces/adapters/express";
import { VerifyLawyerComposer } from "@infrastructure/services/composers/Lawyer/VerifyLawyerComposer";
import { FetchLawyerComposer } from "@infrastructure/services/composers/Lawyer/FetchLawyersComposer";
import { UpdateLawyerSlotSettingsComposer } from "@infrastructure/services/composers/Lawyer/Slots/UpdateLawyerSlotSettingsComposer";
import { FetchSlotSettingsComposer } from "@infrastructure/services/composers/Lawyer/Slots/FetchSlotSettingsComposer";
import { UpdateAvailableSlotsComposer } from "@infrastructure/services/composers/Lawyer/Slots/UpdateAvailableSlotsComposer";
import { FetchAvailableSlotsComposer } from "@infrastructure/services/composers/Lawyer/Slots/FetchAvailableSlotsComposer";
import { FetchOverrideSlotsComposer } from "@infrastructure/services/composers/Lawyer/Slots/FetchOverrideSlotsComposer";
import { AddOverrideSlotsComposer } from "@infrastructure/services/composers/Lawyer/Slots/AddOverrideSlotsComposer";
import { RemoveOverriedSlotsComposer } from "@infrastructure/services/composers/Lawyer/Slots/RemoveOverrideSlotsComposer";
import { RejectClientAppointmentComposer } from "@infrastructure/services/composers/Lawyer/Appointment/RejectClientAppointmentComposer";
import { ConfirmClientAppointmentComposer } from "@infrastructure/services/composers/Lawyer/Appointment/ConfirmClientAppointment";
import { FetchSessionDocumentsComposer } from "@infrastructure/services/composers/Lawyer/Session/FetchSessionDocumentsComposer";
import { StartSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/StartSessionComposer";
import { JoinVideoSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/JoinVideoSessionComposer";
import { EndSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/EndSessionComposer";
import { CancelSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/CancelSessionComposer";
import { fetchSessionsComposer } from "@infrastructure/services/composers/Admin/FetchSessions";
import { FetchCallLogsSessionComposer } from "@infrastructure/services/composers/Lawyer/Session/FetchCallLogsSessionComposer";
import { FetchReviewsByUserIdComposer } from "@infrastructure/services/composers/Client/review/FetchReviewsByUserIdComposer";
import { FetchReviewsBySessionComposer } from "@infrastructure/services/composers/Client/review/FetchReviewBySessionComposer";
import { NextFunction } from "express-serve-static-core";
import { SendMessageFileComposer } from "@infrastructure/services/composers/Client/SendMessageFileComposer";
import { FetchAppointmentDataComposer } from "@infrastructure/services/composers/Client/Appointment/FetchAppointmentsComposer";
import {
    CasesRoutes,
    ClientRoutes,
    CommonParamsRoute,
    LawyerRoutes,
    PracticeAreaRoutes,
    SpecializationRoute,
    WalletRoutes,
} from "@shared/constant/RouteConstant";
import { FetchAllNotificationsComposer } from "@infrastructure/services/composers/Notification/FetchAllNotificationsComposer";
import { UpdateNotificationStatusComposer } from "@infrastructure/services/composers/Notification/UpdateNotificationStatusComposer";
import { MarkAllNotificationAsReadComposer } from "@infrastructure/services/composers/Notification/MarkAllNotificationAsRead";
import { FetchWalletByUserComposer } from "@infrastructure/services/composers/Wallet/FetchWalletByUserComposer";
import { FetchTransactionsByWalletComposer } from "@infrastructure/services/composers/Wallet/FetchTransactionsByWalletComposer";
import { FetchAllSpecializationsComposer } from "@infrastructure/services/composers/Specializations/FetchAllSpecializations";
import { FindPracticeAreasBySpecIdsComposer } from "@infrastructure/services/composers/PracticeAreas/FindPracticeAreasBySpecIdsComposer";
import { FetchLawyersProfessionalDetailscomposer } from "@infrastructure/services/composers/Lawyer/FetchLawyerProfessionalDetailsComposer";
import { FetchLawyerVerificationDetailsComposer } from "@infrastructure/services/composers/Lawyer/FetchLawyerVerificationDetailsComposer";
import { UpdateLawyersProfessionalDetailsComposer } from "@infrastructure/services/composers/Lawyer/UpdateLawyerProfessionalDetailsComposer";
import { FindAllCasesByQueryComposer } from "@infrastructure/services/composers/Cases/FindAllCasesByQueryComposer";
import { FindCaseDetailsComposer } from "@infrastructure/services/composers/Cases/FindCaseDetailsComposer";
import { FindAppointmentByCaseComposer } from "@infrastructure/services/composers/Appointments/FindAppointmentByCaseComposer";
import { FindSessionsByCaseComposer } from "@infrastructure/services/composers/Sessions/FindSessionsByCase";
import { FetchProfileImageComposer } from "@infrastructure/services/composers/Client/Profile/FetchProfileImageComposer";

const upload = multer({ storage: documentstorage });
const chatFile = multer({
    storage: chatDocumentstorage,
    limits: { fileSize: 10 * 1024 * 1024, files: 3 },
});
const router = express.Router();

router.post(
    LawyerRoutes.verification,
    authenticateUser,
    authenticateClient,
    upload.fields([
        { name: "enrollment_certificate", maxCount: 1 },
        { name: "certificate_of_practice", maxCount: 1 },
        { name: "barcouncilid", maxCount: 1 },
    ]),
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, VerifyLawyerComposer());
        res.status(adapter.statusCode).json(adapter.body);
    }
);
router.get(
    LawyerRoutes.root,
    authenticateUser,
    authenticateClient,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, FetchLawyerComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);

router
    .route(LawyerRoutes.schedule.settings)
    .all(authenticateUser, authenticateClient, authenticateLawyer)
    .patch(async (req: Request, res: Response) => {
        const adapter = await expressAdapter(
            req,
            UpdateLawyerSlotSettingsComposer()
        );
        res.status(adapter.statusCode).json(adapter.body);
        return;
    })
    .get(async (req: Request, res: Response) => {
        const adaper = await expressAdapter(req, FetchSlotSettingsComposer());
        res.status(adaper.statusCode).json(adaper.body);
        return;
    });

router
    .route(LawyerRoutes.schedule.availability)
    .all(authenticateUser, authenticateClient, authenticateLawyer)
    .patch(async (req: Request, res: Response) => {
        const adaper = await expressAdapter(req, UpdateAvailableSlotsComposer());
        res.status(adaper.statusCode).json(adaper.body);
        return;
    })
    .get(async (req: Request, res: Response) => {
        const adaper = await expressAdapter(req, FetchAvailableSlotsComposer());
        res.status(adaper.statusCode).json(adaper.body);
        return;
    });

router
    .route(LawyerRoutes.schedule.override)
    .all(authenticateUser, authenticateClient, authenticateLawyer)
    .get(async (req: Request, res: Response) => {
        const adaper = await expressAdapter(req, FetchOverrideSlotsComposer());
        res.status(adaper.statusCode).json(adaper.body);
        return;
    })
    .post(async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, AddOverrideSlotsComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    })
    .delete(async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, RemoveOverriedSlotsComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    });

// profiles
router.get(
    LawyerRoutes.profile.base +
    LawyerRoutes.base +
    LawyerRoutes.professional +
    CommonParamsRoute.params,
    authenticateUser,
    authenticateClient,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(
            req,
            FetchLawyersProfessionalDetailscomposer()
        );
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);

router.get(
    LawyerRoutes.profile.base +
    LawyerRoutes.base +
    LawyerRoutes.verification +
    CommonParamsRoute.params,
    authenticateUser,
    authenticateClient,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(
            req,
            FetchLawyerVerificationDetailsComposer()
        );
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);
router.post(
    LawyerRoutes.profile.base + LawyerRoutes.base + LawyerRoutes.professional,
    authenticateUser,
    authenticateClient,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(
            req,
            UpdateLawyersProfessionalDetailsComposer()
        );
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);
router.get(
    LawyerRoutes.profile.appointments.base,
    authenticateUser,
    authenticateClient,
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, FetchAppointmentDataComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);
router.patch(
    LawyerRoutes.profile.appointments.reject,
    authenticateUser,
    authenticateClient,
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adpter = await expressAdapter(req, RejectClientAppointmentComposer());
        res.status(adpter.statusCode).json(adpter.body);
        return;
    }
);
router.patch(
    LawyerRoutes.profile.appointments.approve,
    authenticateUser,
    authenticateClient,
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(
            req,
            ConfirmClientAppointmentComposer()
        );
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);
// profile sesisons
router.get(
    LawyerRoutes.profile.sessions.base,
    authenticateUser,
    authenticateClient,
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, fetchSessionsComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);
router.get(
    LawyerRoutes.profile.sessions.document,
    authenticateUser,
    authenticateClient,
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, FetchSessionDocumentsComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);
router.patch(
    LawyerRoutes.profile.sessions.start,
    authenticateUser,
    authenticateClient,
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, StartSessionComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);
router.patch(
    LawyerRoutes.profile.sessions.join,
    authenticateUser,
    authenticateClient,
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, JoinVideoSessionComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);
router.patch(
    LawyerRoutes.profile.sessions.end,
    authenticateUser,
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, EndSessionComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);
router.patch(
    LawyerRoutes.profile.sessions.cancel,
    authenticateUser,
    authenticateClient,
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, CancelSessionComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);

router.post(
    LawyerRoutes.chat.sendFile,
    authenticateUser,
    authenticateLawyer,
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

router.get(
    LawyerRoutes.profile.sessions.callLogs,
    authenticateUser,
    authenticateClient,
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, FetchCallLogsSessionComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);

//reviews

router.get(
    LawyerRoutes.profile.reviews,
    authenticateUser,
    authenticateClient,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, FetchReviewsByUserIdComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);
router.get(
    LawyerRoutes.profile.sessions.reviewsBySession,
    authenticateUser,
    authenticateClient,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, FetchReviewsBySessionComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);

router.get(
    LawyerRoutes.nofication.getAllNotifications,
    authenticateUser,
    authenticateClient,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, FetchAllNotificationsComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);

router.patch(
    LawyerRoutes.nofication.updateStatus,
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

router.put(
    LawyerRoutes.nofication.markAllAsRead,
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
    authenticateLawyer,
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
    authenticateLawyer,
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
    CasesRoutes.base,
    authenticateUser,
    authenticateClient,
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, FindAllCasesByQueryComposer());
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
    authenticateLawyer,
    async (req: Request, res: Response) => {
        const adapter = await expressAdapter(req, FindSessionsByCaseComposer());
        res.status(adapter.statusCode).json(adapter.body);
        return;
    }
);
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

export default router;
