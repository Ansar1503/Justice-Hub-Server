"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetLawyersComposer = GetLawyersComposer;
const GetLawyersController_1 = require("@interfaces/controller/Client/GetLawyersController");
const GetLawyersUseCase_1 = require("@src/application/usecases/Client/implementations/GetLawyersUseCase");
const LawyerRepo_1 = require("@infrastructure/database/repo/LawyerRepo");
function GetLawyersComposer() {
    const usecase = new GetLawyersUseCase_1.GetLawyersUseCase(new LawyerRepo_1.LawyerRepository());
    return new GetLawyersController_1.GetLawyersController(usecase);
}
