"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateOrUpdateCommissionSettingsComposer = CreateOrUpdateCommissionSettingsComposer;
const CommissionSettingsRepo_1 = require("@infrastructure/database/repo/CommissionSettingsRepo");
const CommissionSettingsMapper_1 = require("@infrastructure/Mapper/Implementations/CommissionSettingsMapper");
const CreateOrUpdateCommissionSettingsController_1 = require("@interfaces/controller/Commission/CreateOrUpdateCommissionSettingsController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const CreateOrUpdateCommissionSettingsUsecase_1 = require("@src/application/usecases/Commission/Implementations/CreateOrUpdateCommissionSettingsUsecase");
function CreateOrUpdateCommissionSettingsComposer() {
    const usecase = new CreateOrUpdateCommissionSettingsUsecase_1.CreateOrUpdateCommissionSettingsUseCase(new CommissionSettingsRepo_1.CommissionSettingsRepo(new CommissionSettingsMapper_1.CommissionSettingsMapper()));
    return new CreateOrUpdateCommissionSettingsController_1.CreateOrUpdateCommissionSettingsController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
