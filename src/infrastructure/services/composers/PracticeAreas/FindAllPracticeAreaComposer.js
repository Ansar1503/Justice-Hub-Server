"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAllPracticeAreaComposer = FindAllPracticeAreaComposer;
const PracticeAreaRepo_1 = require("@infrastructure/database/repo/PracticeAreaRepo");
const PracticeAreaMapper_1 = require("@infrastructure/Mapper/Implementations/PracticeAreaMapper");
const FindAllPracticeAreasController_1 = require("@interfaces/controller/PracticeArea/FindAllPracticeAreasController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FindAllPracticeAreasUsecase_1 = require("@src/application/usecases/PracitceAreas/Implementation/FindAllPracticeAreasUsecase");
function FindAllPracticeAreaComposer() {
    const usecase = new FindAllPracticeAreasUsecase_1.FindAllpracticeAreasUsecase(new PracticeAreaRepo_1.PracticeAreaRepo(new PracticeAreaMapper_1.PracticeAreaMapper()));
    return new FindAllPracticeAreasController_1.FindAllPracticeAreasController(usecase, new HttpSuccess_1.HttpSuccess(), new HttpErrors_1.HttpErrors());
}
