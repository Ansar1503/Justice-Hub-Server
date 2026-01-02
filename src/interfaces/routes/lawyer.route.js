"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const express_2 = require("@interfaces/adapters/express");
const VerifyLawyerComposer_1 = require("@infrastructure/services/composers/Lawyer/VerifyLawyerComposer");
const FetchLawyersComposer_1 = require("@infrastructure/services/composers/Lawyer/FetchLawyersComposer");
const UpdateLawyerSlotSettingsComposer_1 = require("@infrastructure/services/composers/Lawyer/Slots/UpdateLawyerSlotSettingsComposer");
const FetchSlotSettingsComposer_1 = require("@infrastructure/services/composers/Lawyer/Slots/FetchSlotSettingsComposer");
const UpdateAvailableSlotsComposer_1 = require("@infrastructure/services/composers/Lawyer/Slots/UpdateAvailableSlotsComposer");
const FetchAvailableSlotsComposer_1 = require("@infrastructure/services/composers/Lawyer/Slots/FetchAvailableSlotsComposer");
const FetchOverrideSlotsComposer_1 = require("@infrastructure/services/composers/Lawyer/Slots/FetchOverrideSlotsComposer");
const AddOverrideSlotsComposer_1 = require("@infrastructure/services/composers/Lawyer/Slots/AddOverrideSlotsComposer");
const RemoveOverrideSlotsComposer_1 = require("@infrastructure/services/composers/Lawyer/Slots/RemoveOverrideSlotsComposer");
const RejectClientAppointmentComposer_1 = require("@infrastructure/services/composers/Lawyer/Appointment/RejectClientAppointmentComposer");
const ConfirmClientAppointment_1 = require("@infrastructure/services/composers/Lawyer/Appointment/ConfirmClientAppointment");
const StartSessionComposer_1 = require("@infrastructure/services/composers/Lawyer/Session/StartSessionComposer");
const JoinVideoSessionComposer_1 = require("@infrastructure/services/composers/Lawyer/Session/JoinVideoSessionComposer");
const EndSessionComposer_1 = require("@infrastructure/services/composers/Lawyer/Session/EndSessionComposer");
const CancelSessionComposer_1 = require("@infrastructure/services/composers/Lawyer/Session/CancelSessionComposer");
const FetchSessions_1 = require("@infrastructure/services/composers/Admin/FetchSessions");
const FetchCallLogsSessionComposer_1 = require("@infrastructure/services/composers/Lawyer/Session/FetchCallLogsSessionComposer");
const FetchReviewsByUserIdComposer_1 = require("@infrastructure/services/composers/Client/review/FetchReviewsByUserIdComposer");
const FetchReviewBySessionComposer_1 = require("@infrastructure/services/composers/Client/review/FetchReviewBySessionComposer");
const SendMessageFileComposer_1 = require("@infrastructure/services/composers/Client/SendMessageFileComposer");
const FetchAppointmentsComposer_1 = require("@infrastructure/services/composers/Client/Appointment/FetchAppointmentsComposer");
const RouteConstant_1 = require("@shared/constant/RouteConstant");
const FetchAllNotificationsComposer_1 = require("@infrastructure/services/composers/Notification/FetchAllNotificationsComposer");
const UpdateNotificationStatusComposer_1 = require("@infrastructure/services/composers/Notification/UpdateNotificationStatusComposer");
const MarkAllNotificationAsRead_1 = require("@infrastructure/services/composers/Notification/MarkAllNotificationAsRead");
const FetchWalletByUserComposer_1 = require("@infrastructure/services/composers/Wallet/FetchWalletByUserComposer");
const FetchTransactionsByWalletComposer_1 = require("@infrastructure/services/composers/Wallet/FetchTransactionsByWalletComposer");
const FetchAllSpecializations_1 = require("@infrastructure/services/composers/Specializations/FetchAllSpecializations");
const FindPracticeAreasBySpecIdsComposer_1 = require("@infrastructure/services/composers/PracticeAreas/FindPracticeAreasBySpecIdsComposer");
const FetchLawyerProfessionalDetailsComposer_1 = require("@infrastructure/services/composers/Lawyer/FetchLawyerProfessionalDetailsComposer");
const FetchLawyerVerificationDetailsComposer_1 = require("@infrastructure/services/composers/Lawyer/FetchLawyerVerificationDetailsComposer");
const UpdateLawyerProfessionalDetailsComposer_1 = require("@infrastructure/services/composers/Lawyer/UpdateLawyerProfessionalDetailsComposer");
const FindAllCasesByQueryComposer_1 = require("@infrastructure/services/composers/Cases/FindAllCasesByQueryComposer");
const FindCaseDetailsComposer_1 = require("@infrastructure/services/composers/Cases/FindCaseDetailsComposer");
const FindAppointmentByCaseComposer_1 = require("@infrastructure/services/composers/Appointments/FindAppointmentByCaseComposer");
const FindSessionsByCase_1 = require("@infrastructure/services/composers/Sessions/FindSessionsByCase");
const FetchProfileImageComposer_1 = require("@infrastructure/services/composers/Client/Profile/FetchProfileImageComposer");
const authenticateClient_1 = require("../middelwares/Auth/authenticateClient");
const authenticateLawyer_1 = require("../middelwares/Auth/authenticateLawyer");
const auth_middleware_1 = require("../middelwares/Auth/auth.middleware");
const multer_2 = require("../middelwares/multer");
const FindCaseDocumentsQueryComposer_1 = require("@infrastructure/services/composers/Cases/FindCaseDocumentsQueryComposer");
const DeleteCaseDocumentsComposer_1 = require("@infrastructure/services/composers/Cases/DeleteCaseDocumentsComposer");
const UploadCaseDocumentComposer_1 = require("@infrastructure/services/composers/Cases/UploadCaseDocumentComposer");
const FindAllCasetypes_1 = require("@infrastructure/services/composers/Casetypes/FindAllCasetypes");
const AddSessionSummaryComposer_1 = require("@infrastructure/services/composers/Cases/AddSessionSummaryComposer");
const FetchAllCasesByUserComposer_1 = require("@infrastructure/services/composers/Cases/FetchAllCasesByUserComposer");
const FetchLawyerDashboardDataComposer_1 = require("@infrastructure/services/composers/Cases/FetchLawyerDashboardDataComposer");
const CreateBlogComposer_1 = require("@infrastructure/services/composers/Blog/CreateBlogComposer");
const FetchBlogsByLawyerComposer_1 = require("@infrastructure/services/composers/Blog/FetchBlogsByLawyerComposer");
const UpdateBlogComposer_1 = require("@infrastructure/services/composers/Blog/UpdateBlogComposer");
const DeleteBlogComposer_1 = require("@infrastructure/services/composers/Blog/DeleteBlogComposer");
const ToggleBlogStatusComposer_1 = require("@infrastructure/services/composers/Blog/ToggleBlogStatusComposer");
const UpdateCasesDetailsComposer_1 = require("@infrastructure/services/composers/Cases/UpdateCasesDetailsComposer");
const StartCallComposer_1 = require("@infrastructure/services/composers/Lawyer/StartCallComposer");
const EndCallComposer_1 = require("@infrastructure/services/composers/Lawyer/EndCallComposer");
const upload = (0, multer_1.default)({ storage: multer_2.documentstorage });
const caseDocumentUpload = (0, multer_1.default)({
    storage: multer_2.caseDocumentStorage,
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
        }
        else {
            cb(new Error("Invalid file type. Only PDF and images are allowed."));
        }
    },
});
const chatFile = (0, multer_1.default)({
    storage: multer_2.chatDocumentstorage,
    limits: { fileSize: 10 * 1024 * 1024, files: 3 },
});
const blogImageUpload = (0, multer_1.default)({
    storage: multer_2.blogImageStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error("Invalid file type. Only JPG, PNG, or WEBP allowed."));
        }
    },
});
const router = express_1.default.Router();
router
    .route(RouteConstant_1.CallLogsRoute.base)
    .all(auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer)
    .post(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, StartCallComposer_1.StartCallComposer)());
    res.status(adapter.statusCode).json(adapter.body);
})
    .put(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, EndCallComposer_1.EndCallComposer)());
    res.status(adapter.statusCode).json(adapter.body);
});
router.post(RouteConstant_1.LawyerRoutes.verification, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, upload.fields([
    { name: "enrollment_certificate", maxCount: 1 },
    { name: "certificate_of_practice", maxCount: 1 },
    { name: "barcouncilid", maxCount: 1 },
]), async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, VerifyLawyerComposer_1.VerifyLawyerComposer)());
    res.status(adapter.statusCode).json(adapter.body);
});
router.get(RouteConstant_1.LawyerRoutes.root, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchLawyersComposer_1.FetchLawyerComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router
    .route(RouteConstant_1.BlogRoute.base)
    .all(auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer)
    .post((0, multer_2.handleMulterErrors)(blogImageUpload.single("file")), async (req, res) => {
    if (req.file) {
        req.body.coverImage = req.file.path;
    }
    const adapter = await (0, express_2.expressAdapter)(req, (0, CreateBlogComposer_1.CreateBlogComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
})
    .get(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchBlogsByLawyerComposer_1.FetchBlogsByLawyerComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router
    .route(RouteConstant_1.BlogRoute.base + RouteConstant_1.CommonParamsRoute.params)
    .all(auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer)
    .patch((0, multer_2.handleMulterErrors)(blogImageUpload.single("file")), async (req, res) => {
    if (req.file) {
        req.body.coverImage = req.file.path;
    }
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateBlogComposer_1.UpdateBlogComposer)());
    res.status(adapter.statusCode).json(adapter.body);
})
    .delete(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, DeleteBlogComposer_1.DeleteBlogComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.BlogRoute.base + RouteConstant_1.BlogRoute.publish + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, ToggleBlogStatusComposer_1.ToggleBlogPublishComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router
    .route(RouteConstant_1.LawyerRoutes.schedule.settings)
    .all(auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer)
    .patch(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateLawyerSlotSettingsComposer_1.UpdateLawyerSlotSettingsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
})
    .get(async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, FetchSlotSettingsComposer_1.FetchSlotSettingsComposer)());
    res.status(adaper.statusCode).json(adaper.body);
    return;
});
router
    .route(RouteConstant_1.LawyerRoutes.schedule.availability)
    .all(auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer)
    .patch(async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, UpdateAvailableSlotsComposer_1.UpdateAvailableSlotsComposer)());
    res.status(adaper.statusCode).json(adaper.body);
    return;
})
    .get(async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, FetchAvailableSlotsComposer_1.FetchAvailableSlotsComposer)());
    res.status(adaper.statusCode).json(adaper.body);
    return;
});
router
    .route(RouteConstant_1.LawyerRoutes.schedule.override)
    .all(auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer)
    .get(async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, FetchOverrideSlotsComposer_1.FetchOverrideSlotsComposer)());
    res.status(adaper.statusCode).json(adaper.body);
    return;
})
    .post(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, AddOverrideSlotsComposer_1.AddOverrideSlotsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
})
    .delete(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, RemoveOverrideSlotsComposer_1.RemoveOverriedSlotsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
// profiles
router.get(RouteConstant_1.LawyerRoutes.profile.base +
    RouteConstant_1.LawyerRoutes.base +
    RouteConstant_1.LawyerRoutes.professional +
    RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchLawyerProfessionalDetailsComposer_1.FetchLawyersProfessionalDetailscomposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.LawyerRoutes.profile.base +
    RouteConstant_1.LawyerRoutes.base +
    RouteConstant_1.LawyerRoutes.verification +
    RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchLawyerVerificationDetailsComposer_1.FetchLawyerVerificationDetailsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.LawyerRoutes.profile.base + RouteConstant_1.LawyerRoutes.base + RouteConstant_1.LawyerRoutes.professional, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateLawyerProfessionalDetailsComposer_1.UpdateLawyersProfessionalDetailsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.LawyerRoutes.profile.appointments.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAppointmentsComposer_1.FetchAppointmentDataComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.LawyerRoutes.profile.appointments.reject, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adpter = await (0, express_2.expressAdapter)(req, (0, RejectClientAppointmentComposer_1.RejectClientAppointmentComposer)());
    res.status(adpter.statusCode).json(adpter.body);
    return;
});
router.patch(RouteConstant_1.LawyerRoutes.profile.appointments.approve, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, ConfirmClientAppointment_1.ConfirmClientAppointmentComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
// profile sesisons
router.get(RouteConstant_1.LawyerRoutes.profile.sessions.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchSessions_1.fetchSessionsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.LawyerRoutes.profile.sessions.start, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, StartSessionComposer_1.StartSessionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.LawyerRoutes.profile.sessions.join, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, JoinVideoSessionComposer_1.JoinVideoSessionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.LawyerRoutes.profile.sessions.end, auth_middleware_1.authenticateUser, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, EndSessionComposer_1.EndSessionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.LawyerRoutes.profile.sessions.cancel, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, CancelSessionComposer_1.CancelSessionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.LawyerRoutes.chat.sendFile, auth_middleware_1.authenticateUser, authenticateLawyer_1.authenticateLawyer, (0, multer_2.handleMulterErrors)(chatFile.single("file")), async (req, res, next) => {
    try {
        const adapter = await (0, express_2.expressAdapter)(req, (0, SendMessageFileComposer_1.SendMessageFileComposer)());
        res.status(adapter.statusCode).json(adapter.body);
    }
    catch (error) {
        next(error);
    }
});
router.get(RouteConstant_1.LawyerRoutes.profile.sessions.callLogs, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchCallLogsSessionComposer_1.FetchCallLogsSessionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
//reviews
router.get(RouteConstant_1.LawyerRoutes.profile.reviews, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchReviewsByUserIdComposer_1.FetchReviewsByUserIdComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.LawyerRoutes.profile.sessions.reviewsBySession, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchReviewBySessionComposer_1.FetchReviewsBySessionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.LawyerRoutes.nofication.getAllNotifications, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAllNotificationsComposer_1.FetchAllNotificationsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.LawyerRoutes.nofication.updateStatus, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateNotificationStatusComposer_1.UpdateNotificationStatusComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.put(RouteConstant_1.LawyerRoutes.nofication.markAllAsRead, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, MarkAllNotificationAsRead_1.MarkAllNotificationAsReadComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.WalletRoutes.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchWalletByUserComposer_1.FetchWalletByUserComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.WalletRoutes.base + RouteConstant_1.WalletRoutes.transactions, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchTransactionsByWalletComposer_1.FetchTransactionsByWalletComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.SpecializationRoute.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAllSpecializations_1.FetchAllSpecializationsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.PracticeAreaRoutes.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindPracticeAreasBySpecIdsComposer_1.FindPracticeAreasBySpecIdsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindAllCasesByQueryComposer_1.FindAllCasesByQueryComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindCaseDetailsComposer_1.FindCaseDetailsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
});
router.get(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.appointments + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindAppointmentByCaseComposer_1.FindAppointmentByCaseComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.sessions + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindSessionsByCase_1.FindSessionsByCaseComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.profile.base + RouteConstant_1.ClientRoutes.profile.image, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchProfileImageComposer_1.FetchProfileImageComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.documents, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, caseDocumentUpload.single("file"), async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UploadCaseDocumentComposer_1.UploadCaseDocumentsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.put(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateCasesDetailsComposer_1.updateCaseDetailsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.documents + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindCaseDocumentsQueryComposer_1.FindCaseDocumentsByCaseComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.delete(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.documents + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, DeleteCaseDocumentsComposer_1.DeleteCaseDocumentComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasetypeRoutes.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindAllCasetypes_1.FindAllCaseTypesComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.sessions + RouteConstant_1.CasesRoutes.sessionSummary, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, AddSessionSummaryComposer_1.AddSessionSummaryComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.user, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAllCasesByUserComposer_1.FetchAllCasesByUserComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.dashboard, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, authenticateLawyer_1.authenticateLawyer, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchLawyerDashboardDataComposer_1.FetchLawyerDashboardDataComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
exports.default = router;
