"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchClientDashboardDataComposer = FetchClientDashboardDataComposer;
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
const CaseRepository_1 = require("@infrastructure/database/repo/CaseRepository");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const WalletRepo_1 = require("@infrastructure/database/repo/WalletRepo");
const CaseMapper_1 = require("@infrastructure/Mapper/Implementations/CaseMapper");
const SessionMapper_1 = require("@infrastructure/Mapper/Implementations/SessionMapper");
const UserMapper_1 = require("@infrastructure/Mapper/Implementations/UserMapper");
const FetchClientDashboardDataController_1 = require("@interfaces/controller/Cases/FetchClientDashboardDataController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchClientDashboardDataUsecase_1 = require("@src/application/usecases/Case/Implimentations/FetchClientDashboardDataUsecase");
function FetchClientDashboardDataComposer() {
    const usecase = new FetchClientDashboardDataUsecase_1.FetchClientDashboardDataUsecase(new CaseRepository_1.CaseRepository(new CaseMapper_1.CaseMapper()), new AppointmentsRepo_1.AppointmentsRepository(), new WalletRepo_1.WalletRepo(), new UserRepo_1.UserRepository(new UserMapper_1.UserMapper()), new SessionRepo_1.SessionsRepository(new SessionMapper_1.SessionMapper()));
    return new FetchClientDashboardDataController_1.FetchClientDashboardDataController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
