"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyerDashboardDataComposer = FetchLawyerDashboardDataComposer;
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const CommissionTransactionRepo_1 = require("@infrastructure/database/repo/CommissionTransactionRepo");
const ReviewRepo_1 = require("@infrastructure/database/repo/ReviewRepo");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const WalletRepo_1 = require("@infrastructure/database/repo/WalletRepo");
const WalletTransactionsRepo_1 = require("@infrastructure/database/repo/WalletTransactionsRepo");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const CommissionTransactionMapper_1 = require("@infrastructure/Mapper/Implementations/CommissionTransactionMapper");
const ReviewMapper_1 = require("@infrastructure/Mapper/Implementations/ReviewMapper");
const SessionMapper_1 = require("@infrastructure/Mapper/Implementations/SessionMapper");
const FetchLawyerDashboardController_1 = require("@interfaces/controller/Cases/FetchLawyerDashboardController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchLawyerDashboardDataUsecase_1 = require("@src/application/usecases/Case/Implimentations/FetchLawyerDashboardDataUsecase");
function FetchLawyerDashboardDataComposer() {
    const usecase = new FetchLawyerDashboardDataUsecase_1.FetchLawyerDashboardDataUsecase(new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper()), new AppointmentsRepo_1.AppointmentsRepository(), new SessionRepo_1.SessionsRepository(new SessionMapper_1.SessionMapper()), new WalletRepo_1.WalletRepo(), new WalletTransactionsRepo_1.WalletTransactionsRepo(), new ReviewRepo_1.ReviewRepo(new ReviewMapper_1.ReviewMapper()), new CommissionTransactionRepo_1.CommissionTransactionRepo(new CommissionTransactionMapper_1.CommissionTransactionMapper()));
    return new FetchLawyerDashboardController_1.FetchLawyerDashboardDataController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
