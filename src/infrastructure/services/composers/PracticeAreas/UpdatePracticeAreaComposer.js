"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePracticeAreaComposer = UpdatePracticeAreaComposer;
const PracticeAreaRepo_1 = require("@infrastructure/database/repo/PracticeAreaRepo");
const PracticeAreaMapper_1 = require("@infrastructure/Mapper/Implementations/PracticeAreaMapper");
const UpdatePracticeAreaController_1 = require("@interfaces/controller/PracticeArea/UpdatePracticeAreaController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const UpdatePracticeAreasUsecase_1 = require("@src/application/usecases/PracitceAreas/Implementation/UpdatePracticeAreasUsecase");
function UpdatePracticeAreaComposer() {
    const usecase = new UpdatePracticeAreasUsecase_1.UpdatePracticeAreasUsecase(new PracticeAreaRepo_1.PracticeAreaRepo(new PracticeAreaMapper_1.PracticeAreaMapper()));
    return new UpdatePracticeAreaController_1.UpdatePracticeAreaController(usecase, new HttpSuccess_1.HttpSuccess(), new HttpErrors_1.HttpErrors());
}
