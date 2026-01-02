"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
// import { ChatController } from "../controller/chat.controller";
// import { ChatUseCase } from "../../application/usecases/chat.usecase";
// import { ChatRepo } from "../../infrastructure/database/repo/chat.repo";
// import { SessionsRepository } from "../../infrastructure/database/repo/sessions.repo";
const express_2 = require("@interfaces/adapters/express");
const FetchClientDataComposer_1 = require("@infrastructure/services/composers/Client/Profile/FetchClientDataComposer");
const UpdateBasicInfo_1 = require("@infrastructure/services/composers/Client/Profile/UpdateBasicInfo");
const UpdateEmailComposer_1 = require("@infrastructure/services/composers/Client/Profile/UpdateEmailComposer");
const SendVerificationMailComposer_1 = require("@infrastructure/services/composers/Client/Profile/SendVerificationMailComposer");
const UpdatePasswordComposer_1 = require("@infrastructure/services/composers/Client/Profile/UpdatePasswordComposer");
const UpdateAddressComposer_1 = require("@infrastructure/services/composers/Client/Profile/UpdateAddressComposer");
const FetchAppointmentsComposer_1 = require("@infrastructure/services/composers/Client/Appointment/FetchAppointmentsComposer");
const FetchSessions_1 = require("@infrastructure/services/composers/Admin/FetchSessions");
const GetLawyerComposer_1 = require("@infrastructure/services/composers/Client/LawyerProfile/GetLawyerComposer");
const GetLawyerDetailsComposer_1 = require("@infrastructure/services/composers/Client/LawyerProfile/GetLawyerDetailsComposer");
const FetchReviewsComposers_1 = require("@infrastructure/services/composers/Client/review/FetchReviewsComposers");
const FetchReviewBySessionComposer_1 = require("@infrastructure/services/composers/Client/review/FetchReviewBySessionComposer");
const UpdateReviewComposer_1 = require("@infrastructure/services/composers/Client/review/UpdateReviewComposer");
const DeleteReviewComposer_1 = require("@infrastructure/services/composers/Client/review/DeleteReviewComposer");
const AddReviewComposer_1 = require("@infrastructure/services/composers/Client/review/AddReviewComposer");
const Report_ReviewComposer_1 = require("@infrastructure/services/composers/Client/review/Report ReviewComposer");
const GetLawyerSlotDetails_1 = require("@infrastructure/services/composers/Client/LawyerProfile/GetLawyerSlotDetails");
const CreateCheckouSessionComposer_1 = require("@infrastructure/services/composers/Client/sessions/CreateCheckouSessionComposer");
const StripeWebHookComposer_1 = require("@infrastructure/services/composers/Client/StripeWebHookComposer");
const FetchStripeSessionDetailsComposer_1 = require("@infrastructure/services/composers/Client/FetchStripeSessionDetailsComposer");
const RemoveFailedSessionComposer_1 = require("@infrastructure/services/composers/Client/sessions/RemoveFailedSessionComposer");
const SendMessageFileComposer_1 = require("@infrastructure/services/composers/Client/SendMessageFileComposer");
const GetChatsComposer_1 = require("@infrastructure/services/composers/Chats/GetChatsComposer");
const GetMessagesComposer_1 = require("@infrastructure/services/composers/Chats/GetMessagesComposer");
const FetchSlotSettingsComposer_1 = require("@infrastructure/services/composers/Lawyer/Slots/FetchSlotSettingsComposer");
const CancelAppointmentsComposer_1 = require("@infrastructure/services/composers/Client/Appointment/CancelAppointmentsComposer");
const CancelSessionComposer_1 = require("@infrastructure/services/composers/Lawyer/Session/CancelSessionComposer");
const EndSessionComposer_1 = require("@infrastructure/services/composers/Lawyer/Session/EndSessionComposer");
const JoinVideoSessionComposer_1 = require("@infrastructure/services/composers/Lawyer/Session/JoinVideoSessionComposer");
const FetchCallLogsSessionComposer_1 = require("@infrastructure/services/composers/Lawyer/Session/FetchCallLogsSessionComposer");
const FetchReviewsByUserIdComposer_1 = require("@infrastructure/services/composers/Client/review/FetchReviewsByUserIdComposer");
const RouteConstant_1 = require("@shared/constant/RouteConstant");
const FetchAllNotificationsComposer_1 = require("@infrastructure/services/composers/Notification/FetchAllNotificationsComposer");
const UpdateNotificationStatusComposer_1 = require("@infrastructure/services/composers/Notification/UpdateNotificationStatusComposer");
const MarkAllNotificationAsRead_1 = require("@infrastructure/services/composers/Notification/MarkAllNotificationAsRead");
const FetchWalletByUserComposer_1 = require("@infrastructure/services/composers/Wallet/FetchWalletByUserComposer");
const FetchTransactionsByWalletComposer_1 = require("@infrastructure/services/composers/Wallet/FetchTransactionsByWalletComposer");
const FetchAllSpecializations_1 = require("@infrastructure/services/composers/Specializations/FetchAllSpecializations");
const FindPracticeAreasBySpecIdsComposer_1 = require("@infrastructure/services/composers/PracticeAreas/FindPracticeAreasBySpecIdsComposer");
const FetchProfileImageComposer_1 = require("@infrastructure/services/composers/Client/Profile/FetchProfileImageComposer");
const FindAllCasetypes_1 = require("@infrastructure/services/composers/Casetypes/FindAllCasetypes");
const FindAllCasesByQueryComposer_1 = require("@infrastructure/services/composers/Cases/FindAllCasesByQueryComposer");
const FetchCaseTypesByPracitceAreaIds_1 = require("@infrastructure/services/composers/Casetypes/FetchCaseTypesByPracitceAreaIds");
const FindCaseDetailsComposer_1 = require("@infrastructure/services/composers/Cases/FindCaseDetailsComposer");
const FindAppointmentByCaseComposer_1 = require("@infrastructure/services/composers/Appointments/FindAppointmentByCaseComposer");
const BookAppointmentByWalletComposer_1 = require("@infrastructure/services/composers/Client/Appointment/BookAppointmentByWalletComposer");
const FindSessionsByCase_1 = require("@infrastructure/services/composers/Sessions/FindSessionsByCase");
const authenticateClient_1 = require("../middelwares/Auth/authenticateClient");
const auth_middleware_1 = require("../middelwares/Auth/auth.middleware");
const multer_2 = require("../middelwares/multer");
const UploadCaseDocumentComposer_1 = require("@infrastructure/services/composers/Cases/UploadCaseDocumentComposer");
const FindCaseDocumentsQueryComposer_1 = require("@infrastructure/services/composers/Cases/FindCaseDocumentsQueryComposer");
const DeleteCaseDocumentsComposer_1 = require("@infrastructure/services/composers/Cases/DeleteCaseDocumentsComposer");
const FetchCaseByCaseTypesComposer_1 = require("@infrastructure/services/composers/Cases/FetchCaseByCaseTypesComposer");
const CreateFollowupSessionComposer_1 = require("@infrastructure/services/composers/Client/sessions/CreateFollowupSessionComposer");
const FetchCommissionSettingsComposer_1 = require("@infrastructure/services/composers/Commission/FetchCommissionSettingsComposer");
const FetchAllCasesByUserComposer_1 = require("@infrastructure/services/composers/Cases/FetchAllCasesByUserComposer");
const FetchClientDashboardDataComposer_1 = require("@infrastructure/services/composers/Cases/FetchClientDashboardDataComposer");
const FetchAllSubscriptionPlansComposer_1 = require("@infrastructure/services/composers/Subscriptions/FetchAllSubscriptionPlansComposer");
const SubscribePlanComposer_1 = require("@infrastructure/services/composers/Subscriptions/SubscribePlanComposer");
const HandleSubscriptionWebhookHandlerComposer_1 = require("@infrastructure/services/composers/Subscriptions/HandleSubscriptionWebhookHandlerComposer");
const FetchUserSubscriptionComposer_1 = require("@infrastructure/services/composers/Subscriptions/FetchUserSubscriptionComposer");
const CancelSubscriptionComposer_1 = require("@infrastructure/services/composers/Subscriptions/CancelSubscriptionComposer");
const FetchLawyerCalendarAvailabiltyComposer_1 = require("@infrastructure/services/composers/Client/FetchLawyerCalendarAvailabiltyComposer");
const FetchBlogsByClientComposer_1 = require("@infrastructure/services/composers/Blog/FetchBlogsByClientComposer");
const FetchBlogDetailsByBlogIdComposer_1 = require("@infrastructure/services/composers/Blog/FetchBlogDetailsByBlogIdComposer");
const LikeOrDislikeBlogComposer_1 = require("@infrastructure/services/composers/Blog/LikeOrDislikeBlogComposer");
const FetchAmountPayableComposer_1 = require("@infrastructure/services/composers/Client/FetchAmountPayableComposer");
const BookFollowupAppointmentByWalletComposer_1 = require("@infrastructure/services/composers/Client/Appointment/BookFollowupAppointmentByWalletComposer");
const FetchPaymentsComposer_1 = require("@infrastructure/services/composers/Client/FetchPaymentsComposer");
const StartCallComposer_1 = require("@infrastructure/services/composers/Lawyer/StartCallComposer");
const EndCallComposer_1 = require("@infrastructure/services/composers/Lawyer/EndCallComposer");
const upload = (0, multer_1.default)({ storage: multer_2.profilestorage });
const documentUpload = (0, multer_1.default)({
    storage: multer_2.documentstorage,
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
        }
        else {
            cb(new Error("Invalid file type. Only PDF, DOCX, and images are allowed."));
        }
    },
});
const chatFile = (0, multer_1.default)({
    storage: multer_2.chatDocumentstorage,
    limits: { fileSize: 10 * 1024 * 1024, files: 3 },
});
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
const router = express_1.default.Router();
router
    .route(RouteConstant_1.CallLogsRoute.base)
    .all(auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient)
    .post(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, StartCallComposer_1.StartCallComposer)());
    res.status(adapter.statusCode).json(adapter.body);
})
    .put(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, EndCallComposer_1.EndCallComposer)());
    res.status(adapter.statusCode).json(adapter.body);
});
// payments
router.get(RouteConstant_1.ClientRoutes.payments.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchPaymentsComposer_1.FetchPaymentsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
// blogs
router.get(RouteConstant_1.BlogRoute.base + RouteConstant_1.BlogRoute.users, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchBlogsByClientComposer_1.FetchBlogsByClientComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.BlogRoute.base + RouteConstant_1.BlogRoute.like + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, LikeOrDislikeBlogComposer_1.LikeOrDislikeBlogComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.BlogRoute.base + RouteConstant_1.BlogRoute.users + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchBlogDetailsByBlogIdComposer_1.FetchBlogDetailsByBlogIdComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
// subscriptions
router.get(RouteConstant_1.SubscriptionRoute.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAllSubscriptionPlansComposer_1.FetchAllSubscriptionPlansComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.SubscriptionRoute.base + RouteConstant_1.SubscriptionRoute.subscribe, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, SubscribePlanComposer_1.SubscribePlanComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.ClientRoutes.stripe.subscriptionWebhook, express_1.default.raw({ type: "application/json" }), async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, HandleSubscriptionWebhookHandlerComposer_1.HandleSubscribeWebhookComposer)());
    res.status(adapter.statusCode).send(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.lawyers.FetchLawyerCalendarAvailabilty, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchLawyerCalendarAvailabiltyComposer_1.FetchLawyerCalendarAvailabilityComposer)());
    res.status(adapter.statusCode).json(adapter.body);
});
router.delete(RouteConstant_1.SubscriptionRoute.base + RouteConstant_1.SubscriptionRoute.user, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, CancelSubscriptionComposer_1.CancelSubscriptionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.SubscriptionRoute.base + RouteConstant_1.SubscriptionRoute.user, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchUserSubscriptionComposer_1.FetchCurrentUserSubscriptionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
// profile area
router.get(RouteConstant_1.ClientRoutes.profile.base + RouteConstant_1.ClientRoutes.profile.image, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchProfileImageComposer_1.FetchProfileImageComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.profile.base, auth_middleware_1.authenticateUser, async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, FetchClientDataComposer_1.FetchClientDataComposer)());
    res.status(adaper.statusCode).json(adaper.body);
    return;
});
router.put(RouteConstant_1.ClientRoutes.profile.basic, auth_middleware_1.authenticateUser, upload.single("image"), async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateBasicInfo_1.updateClientDataComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.put(RouteConstant_1.ClientRoutes.profile.personal, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateEmailComposer_1.UpdateEmailComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.ClientRoutes.profile.verifyMail, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, SendVerificationMailComposer_1.SendVerificationMailComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.put(RouteConstant_1.ClientRoutes.profile.updatePassword, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdatePasswordComposer_1.UpdatePasswordComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.ClientRoutes.profile.address, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateAddressComposer_1.UpdateAddressComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router
    .route(RouteConstant_1.ClientRoutes.profile.appointments)
    .all(auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient)
    .patch(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, CancelAppointmentsComposer_1.CancelAppointmentComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
})
    .get(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAppointmentsComposer_1.FetchAppointmentDataComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
// profile sessions
router.get(RouteConstant_1.ClientRoutes.profile.sessions, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchSessions_1.fetchSessionsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.ClientRoutes.profile.cancelSession, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res, next) => {
    try {
        const adapter = await (0, express_2.expressAdapter)(req, (0, CancelSessionComposer_1.CancelSessionComposer)());
        res.status(adapter.statusCode).json(adapter.body);
    }
    catch (error) {
        next(error);
    }
});
router.patch(RouteConstant_1.ClientRoutes.profile.endSession, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res, next) => {
    try {
        const adapter = await (0, express_2.expressAdapter)(req, (0, EndSessionComposer_1.EndSessionComposer)());
        res.status(adapter.statusCode).json(adapter.body);
    }
    catch (error) {
        next(error);
    }
});
// chats
router.get(RouteConstant_1.ClientRoutes.profile.chats, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, GetChatsComposer_1.GetChatsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.profile.chatMessages, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, GetMessagesComposer_1.GetMessagesComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
// lawyers finding and booking areas
router.get(RouteConstant_1.ClientRoutes.lawyers.base, auth_middleware_1.authenticateUser, async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, GetLawyerComposer_1.GetLawyersComposer)());
    res.status(adaper.statusCode).json(adaper.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.lawyers.byId, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, GetLawyerDetailsComposer_1.GetLawyerDetailComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
// reviews
router.post(RouteConstant_1.ClientRoutes.lawyers.review, auth_middleware_1.authenticateUser, async (req, res) => {
    req.body.user = req.user;
    const adapter = await (0, express_2.expressAdapter)(req, (0, AddReviewComposer_1.AddReviewComposer)());
    res.status(adapter.statusCode).json(adapter.body);
});
router.get(RouteConstant_1.ClientRoutes.lawyers.reviewsByLawyer, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchReviewsComposers_1.FetchReviewsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.profile.reviews, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchReviewsByUserIdComposer_1.FetchReviewsByUserIdComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.profile.reviewsBySession, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchReviewBySessionComposer_1.FetchReviewsBySessionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router
    .route(RouteConstant_1.ClientRoutes.profile.reviewById)
    .all(auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient)
    .put(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateReviewComposer_1.UpdateReviewsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
})
    .delete(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, DeleteReviewComposer_1.DeleteReviewComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.ClientRoutes.profile.reportReview, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, Report_ReviewComposer_1.ReportReviewComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
// slot area
router.get(RouteConstant_1.ClientRoutes.lawyers.settings, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchSlotSettingsComposer_1.FetchSlotSettingsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.lawyers.slots, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, GetLawyerSlotDetails_1.GetLawyerSlotDetailsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.ClientRoutes.slots.checkout, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, await (0, CreateCheckouSessionComposer_1.CreateCheckoutSessionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.slots.amountPayable, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAmountPayableComposer_1.FetchAmountPayableComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.ClientRoutes.slots.followup, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, await (0, CreateFollowupSessionComposer_1.CreateFollowupCheckoutSessionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.stripe.session, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchStripeSessionDetailsComposer_1.FetchStripeSessionDetailsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.delete(RouteConstant_1.ClientRoutes.slots.removeFailed, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, RemoveFailedSessionComposer_1.RemoveFailedSessionComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.ClientRoutes.chat.sendFile, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, (0, multer_2.handleMulterErrors)(chatFile.single("file")), async (req, res, next) => {
    try {
        const adapter = await (0, express_2.expressAdapter)(req, (0, SendMessageFileComposer_1.SendMessageFileComposer)());
        res.status(adapter.statusCode).json(adapter.body);
    }
    catch (error) {
        next(error);
    }
});
// stripe  webjook
router.post(RouteConstant_1.ClientRoutes.stripe.webhook, express_1.default.raw({ type: "application/json" }), async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, StripeWebHookComposer_1.HandleWebhookComposer)());
    res.status(adapter.statusCode).send(adapter.body);
    return;
});
router.patch(RouteConstant_1.ClientRoutes.profile.join, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const controller = (0, JoinVideoSessionComposer_1.JoinVideoSessionComposer)();
    const response = await (0, express_2.expressAdapter)(req, controller);
    res.status(response.statusCode).json(response.body);
});
router.get(RouteConstant_1.ClientRoutes.profile.callLogs, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const controller = (0, FetchCallLogsSessionComposer_1.FetchCallLogsSessionComposer)();
    const response = await (0, express_2.expressAdapter)(req, controller);
    res.status(response.statusCode).json(response.body);
});
router.patch(RouteConstant_1.ClientRoutes.notifcation.updateStatus, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateNotificationStatusComposer_1.UpdateNotificationStatusComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.notifcation.getAllNotifications, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAllNotificationsComposer_1.FetchAllNotificationsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.put(RouteConstant_1.ClientRoutes.notifcation.markAllAsRead, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, MarkAllNotificationAsRead_1.MarkAllNotificationAsReadComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.WalletRoutes.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchWalletByUserComposer_1.FetchWalletByUserComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.WalletRoutes.base + RouteConstant_1.WalletRoutes.transactions, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
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
router.get(RouteConstant_1.CasetypeRoutes.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindAllCasetypes_1.FindAllCaseTypesComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasetypeRoutes.base + RouteConstant_1.PracticeAreaRoutes.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchCaseTypesByPracitceAreaIds_1.FindCaseTypesByPracticeAreasComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindAllCasesByQueryComposer_1.FindAllCasesByQueryComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.ClientRoutes.lawyers.walletbook, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, BookAppointmentByWalletComposer_1.BookAppointmentByWalletComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.ClientRoutes.lawyers.walletbookFollowup, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, BookFollowupAppointmentByWalletComposer_1.BookFollowupAppointmentByWalletComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.post(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.documents, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, caseDocumentUpload.single("file"), async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UploadCaseDocumentComposer_1.UploadCaseDocumentsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.caseTypes + RouteConstant_1.CasesRoutes.ids, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchCaseByCaseTypesComposer_1.FetchCaseByCaseTypesComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CommissionRoutes.base + RouteConstant_1.CommissionRoutes.settings, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchCommissionSettingsComposer_1.FetchCommissionSettingsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.user, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAllCasesByUserComposer_1.FetchAllCasesByUserComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.ClientRoutes.dashboard, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchClientDashboardDataComposer_1.FetchClientDashboardDataComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.appointments + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindAppointmentByCaseComposer_1.FindAppointmentByCaseComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.sessions + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindSessionsByCase_1.FindSessionsByCaseComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.documents + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindCaseDocumentsQueryComposer_1.FindCaseDocumentsByCaseComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.delete(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CasesRoutes.documents + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, DeleteCaseDocumentsComposer_1.DeleteCaseDocumentComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.CasesRoutes.base + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, authenticateClient_1.authenticateClient, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindCaseDetailsComposer_1.FindCaseDetailsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
});
exports.default = router;
