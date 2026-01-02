"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_2 = require("@interfaces/adapters/express");
const FetchAllUsers_1 = require("@infrastructure/services/composers/Admin/FetchAllUsers");
const FetchAllLawyers_1 = require("@infrastructure/services/composers/Admin/FetchAllLawyers");
const BlockUser_1 = require("@infrastructure/services/composers/Admin/BlockUser");
const ChangeLawyerVerificationStatus_1 = require("@infrastructure/services/composers/Admin/ChangeLawyerVerificationStatus");
const FetchSessions_1 = require("@infrastructure/services/composers/Admin/FetchSessions");
const FetchReviewDisputes_1 = require("@infrastructure/services/composers/Admin/FetchReviewDisputes");
const FetchChatDisputesComposer_1 = require("@infrastructure/services/composers/Admin/FetchChatDisputesComposer");
const UpdateDisputesStatusComposer_1 = require("@infrastructure/services/composers/Admin/UpdateDisputesStatusComposer");
const FetchAppointmentsComposer_1 = require("@infrastructure/services/composers/Client/Appointment/FetchAppointmentsComposer");
const RouteConstant_1 = require("@shared/constant/RouteConstant");
const FetchTransactionsByWalletComposer_1 = require("@infrastructure/services/composers/Wallet/FetchTransactionsByWalletComposer");
const FetchWalletByUserComposer_1 = require("@infrastructure/services/composers/Wallet/FetchWalletByUserComposer");
const FetchAllSpecializations_1 = require("@infrastructure/services/composers/Specializations/FetchAllSpecializations");
const AddSpecialization_1 = require("@infrastructure/services/composers/Specializations/AddSpecialization");
const DeleteSpecializationComposer_1 = require("@infrastructure/services/composers/Specializations/DeleteSpecializationComposer");
const AddPracticeAreasComposer_1 = require("@infrastructure/services/composers/PracticeAreas/AddPracticeAreasComposer");
const FindAllPracticeAreaComposer_1 = require("@infrastructure/services/composers/PracticeAreas/FindAllPracticeAreaComposer");
const UpdatePracticeAreaComposer_1 = require("@infrastructure/services/composers/PracticeAreas/UpdatePracticeAreaComposer");
const DeletPracticeAreaComposer_1 = require("@infrastructure/services/composers/PracticeAreas/DeletPracticeAreaComposer");
const FindAllCasetypeComposer_1 = require("@infrastructure/services/composers/Casetypes/FindAllCasetypeComposer");
const AddCaseTypeComposer_1 = require("@infrastructure/services/composers/Casetypes/AddCaseTypeComposer");
const UpdateCasetypeComposer_1 = require("@infrastructure/services/composers/Casetypes/UpdateCasetypeComposer");
const DeleteCasetypeComposer_1 = require("@infrastructure/services/composers/Casetypes/DeleteCasetypeComposer");
const auth_middleware_1 = require("../middelwares/Auth/auth.middleware");
const CreateOrUpdateCommissionSettingsComposer_1 = require("@infrastructure/services/composers/Commission/CreateOrUpdateCommissionSettingsComposer");
const FetchCommissionSettingsComposer_1 = require("@infrastructure/services/composers/Commission/FetchCommissionSettingsComposer");
const FetchAdminDashboardDataCommposer_1 = require("@infrastructure/services/composers/Admin/FetchAdminDashboardDataCommposer");
const AddSubscriptionsComposer_1 = require("@infrastructure/services/composers/Subscriptions/AddSubscriptionsComposer");
const FetchAllSubscriptionPlansComposer_1 = require("@infrastructure/services/composers/Subscriptions/FetchAllSubscriptionPlansComposer");
const UpdateSubscriptionPlanComposer_1 = require("@infrastructure/services/composers/Subscriptions/UpdateSubscriptionPlanComposer");
const ChangeActiveSubscriptionStatusComposer_1 = require("@infrastructure/services/composers/Subscriptions/ChangeActiveSubscriptionStatusComposer");
const GenerateSalesReportComposer_1 = require("@infrastructure/services/composers/Admin/GenerateSalesReportComposer");
const router = (0, express_1.Router)();
router.get(RouteConstant_1.AdminRoutes.users, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAllUsers_1.FetchAllUserComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.AdminRoutes.lawyers, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAllLawyers_1.FetchAllLawyersComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.AdminRoutes.blockUser, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, BlockUser_1.BlockUserComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.AdminRoutes.changeLawyerVerification, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, ChangeLawyerVerificationStatus_1.ChangeLawyerVerificationComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.AdminRoutes.profileAppointments, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAppointmentsComposer_1.FetchAppointmentDataComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.AdminRoutes.profileSessions, auth_middleware_1.authenticateUser, async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, FetchSessions_1.fetchSessionsComposer)());
    res.status(adaper.statusCode).json(adaper.body);
    return;
});
// disputes
router.get(RouteConstant_1.AdminRoutes.reviewDisputes, auth_middleware_1.authenticateUser, async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, FetchReviewDisputes_1.FetchReviewDipsutesComposer)());
    res.status(adaper.statusCode).json(adaper.body);
    return;
});
router.get(RouteConstant_1.AdminRoutes.chatDisputes, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchChatDisputesComposer_1.FetchChatDisputesComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.put(RouteConstant_1.AdminRoutes.updateDisputeStatus, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateDisputesStatusComposer_1.UpdateDisputesStatusComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.WalletRoutes.base + RouteConstant_1.WalletRoutes.transactions, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchTransactionsByWalletComposer_1.FetchTransactionsByWalletComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.WalletRoutes.base, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchWalletByUserComposer_1.FetchWalletByUserComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router
    .route(RouteConstant_1.SpecializationRoute.base)
    .all(auth_middleware_1.authenticateUser)
    .get(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAllSpecializations_1.FetchAllSpecializationsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
})
    .patch(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, AddSpecialization_1.AddSpecializationComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.delete(RouteConstant_1.SpecializationRoute.base + RouteConstant_1.SpecializationRoute.params, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, DeleteSpecializationComposer_1.DeleteSpecializationComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router
    .route(RouteConstant_1.PracticeAreaRoutes.base)
    .all(auth_middleware_1.authenticateUser)
    .post(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, AddPracticeAreasComposer_1.AddPracticeAreasComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
})
    .get(async (req, res) => {
    const adaper = await (0, express_2.expressAdapter)(req, (0, FindAllPracticeAreaComposer_1.FindAllPracticeAreaComposer)());
    res.status(adaper.statusCode).json(adaper.body);
    return;
})
    .put(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdatePracticeAreaComposer_1.UpdatePracticeAreaComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.delete(RouteConstant_1.PracticeAreaRoutes.base + RouteConstant_1.PracticeAreaRoutes.params, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, DeletPracticeAreaComposer_1.DeletePracticeAreaComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router
    .route(RouteConstant_1.CasetypeRoutes.base)
    .all(auth_middleware_1.authenticateUser)
    .get(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FindAllCasetypeComposer_1.FindAllCasetypeComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
})
    .post(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, AddCaseTypeComposer_1.AddCaseTypeComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
})
    .put(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateCasetypeComposer_1.UpdateCasetypeComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.delete(RouteConstant_1.CasetypeRoutes.base + RouteConstant_1.CasetypeRoutes.params, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, DeleteCasetypeComposer_1.DeleteCasetypeComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router
    .route(RouteConstant_1.CommissionRoutes.base + RouteConstant_1.CommissionRoutes.settings)
    .all(auth_middleware_1.authenticateUser)
    .post(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, CreateOrUpdateCommissionSettingsComposer_1.CreateOrUpdateCommissionSettingsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
})
    .get(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchCommissionSettingsComposer_1.FetchCommissionSettingsComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.get(RouteConstant_1.AdminRoutes.dashboard + RouteConstant_1.AdminRoutes.overview, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAdminDashboardDataCommposer_1.FetchAdminDashboardDataComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router
    .route(RouteConstant_1.SubscriptionRoute.base)
    .all(auth_middleware_1.authenticateUser)
    .post(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, AddSubscriptionsComposer_1.AddSubscriptionPlanComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
})
    .get(async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, FetchAllSubscriptionPlansComposer_1.FetchAllSubscriptionPlansComposer)());
    res.status(adapter.statusCode).json(adapter.body);
    return;
});
router.patch(RouteConstant_1.SubscriptionRoute.base + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, UpdateSubscriptionPlanComposer_1.UpdateSubscriptionPlanComposer)());
    res.status(adapter.statusCode).json(adapter.body);
});
router.patch(RouteConstant_1.SubscriptionRoute.base + RouteConstant_1.SubscriptionRoute.status + RouteConstant_1.CommonParamsRoute.params, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, ChangeActiveSubscriptionStatusComposer_1.ChangeActiveSubscriptionStatusComposer)());
    res.status(adapter.statusCode).json(adapter.body);
});
router.get(`${RouteConstant_1.AdminRoutes.dashboard}${RouteConstant_1.AdminRoutes.salesReport}`, auth_middleware_1.authenticateUser, async (req, res) => {
    const adapter = await (0, express_2.expressAdapter)(req, (0, GenerateSalesReportComposer_1.GenerateSalesReportComposer)());
    res.status(adapter.statusCode).json(adapter.body);
});
exports.default = router;
