"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EndSessionComposer = EndSessionComposer;
const EndSessionController_1 = require("@interfaces/controller/Lawyer/Sessions/EndSessionController");
const EndSessionUseCase_1 = require("@src/application/usecases/Lawyer/implementations/EndSessionUseCase");
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
function EndSessionComposer() {
    const usecase = new EndSessionUseCase_1.EndSessionUseCase(new UnitofWork_1.MongoUnitofWork());
    return new EndSessionController_1.EndSessionController(usecase);
}
