"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyLawyerComposer = VerifyLawyerComposer;
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
const VerifyLawyerController_1 = require("@interfaces/controller/Lawyer/VerifyLawyerController");
const VerifyLawyerUseCase_1 = require("@src/application/usecases/Lawyer/implementations/VerifyLawyerUseCase");
function VerifyLawyerComposer() {
    const usecase = new VerifyLawyerUseCase_1.VerifyLawyerUseCase(new UnitofWork_1.MongoUnitofWork());
    return new VerifyLawyerController_1.VerifyLawyerController(usecase);
}
