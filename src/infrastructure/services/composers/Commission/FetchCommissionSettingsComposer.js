"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCommissionSettingsComposer = FetchCommissionSettingsComposer;
const CommissionSettingsRepo_1 = require("@infrastructure/database/repo/CommissionSettingsRepo");
const CommissionSettingsMapper_1 = require("@infrastructure/Mapper/Implementations/CommissionSettingsMapper");
const FetchCommissionSettingsController_1 = require("@interfaces/controller/Commission/FetchCommissionSettingsController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchCommmissionSettingsUsecase_1 = require("@src/application/usecases/Commission/Implementations/FetchCommmissionSettingsUsecase");
function FetchCommissionSettingsComposer() {
    const usecase = new FetchCommmissionSettingsUsecase_1.FetchCommissionSettingsUsecase(new CommissionSettingsRepo_1.CommissionSettingsRepo(new CommissionSettingsMapper_1.CommissionSettingsMapper()));
    return new FetchCommissionSettingsController_1.FetchCommissionSettingsController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
