"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAdminDashboardDataComposer = FetchAdminDashboardDataComposer;
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const CommissionTransactionRepo_1 = require("@infrastructure/database/repo/CommissionTransactionRepo");
const DisputesRepo_1 = require("@infrastructure/database/repo/DisputesRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const UserSubscriptionRepository_1 = require("@infrastructure/database/repo/UserSubscriptionRepository");
const WalletTransactionsRepo_1 = require("@infrastructure/database/repo/WalletTransactionsRepo");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const CommissionTransactionMapper_1 = require("@infrastructure/Mapper/Implementations/CommissionTransactionMapper");
const UserSubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/UserSubscriptionMapper");
const FetchAdminDashboardDataController_1 = require("@interfaces/controller/Admin/FetchAdminDashboardDataController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchAdminDashboardDataUsecase_1 = require("@src/application/usecases/Admin/Implementations/FetchAdminDashboardDataUsecase");
function FetchAdminDashboardDataComposer() {
    const usecase = new FetchAdminDashboardDataUsecase_1.FetchAdminDashboardDataUsecase(new UserRepo_1.UserRepository(), new WalletTransactionsRepo_1.WalletTransactionsRepo(), new DisputesRepo_1.DisputesRepo(), new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper()), new CommissionTransactionRepo_1.CommissionTransactionRepo(new CommissionTransactionMapper_1.CommissionTransactionMapper()), new UserSubscriptionRepository_1.UserSubscriptionRepository(new UserSubscriptionMapper_1.UserSubscriptionMapper()));
    return new FetchAdminDashboardDataController_1.FetchAdminDashboardDataController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
