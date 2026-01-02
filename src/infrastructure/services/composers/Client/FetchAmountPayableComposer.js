"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAmountPayableComposer = FetchAmountPayableComposer;
const CommissionSettingsMapper_1 = require("@infrastructure/Mapper/Implementations/CommissionSettingsMapper");
const UserSubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/UserSubscriptionMapper");
const CommissionSettingsRepo_1 = require("@infrastructure/database/repo/CommissionSettingsRepo");
const LawyerRepo_1 = require("@infrastructure/database/repo/LawyerRepo");
const UserSubscriptionRepository_1 = require("@infrastructure/database/repo/UserSubscriptionRepository");
const FetchAmountPayableController_1 = require("@interfaces/controller/Client/FetchAmountPayableController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchAmountPayableUsecase_1 = require("@src/application/usecases/Client/implementations/FetchAmountPayableUsecase");
function FetchAmountPayableComposer() {
    const usecase = new FetchAmountPayableUsecase_1.FetchAmountPayableUsecase(new LawyerRepo_1.LawyerRepository(), new UserSubscriptionRepository_1.UserSubscriptionRepository(new UserSubscriptionMapper_1.UserSubscriptionMapper()), new CommissionSettingsRepo_1.CommissionSettingsRepo(new CommissionSettingsMapper_1.CommissionSettingsMapper()));
    return new FetchAmountPayableController_1.FetchAmountPayableController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
