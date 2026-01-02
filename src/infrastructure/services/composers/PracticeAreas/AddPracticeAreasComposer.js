"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddPracticeAreasComposer = AddPracticeAreasComposer;
const PracticeAreaRepo_1 = require("@infrastructure/database/repo/PracticeAreaRepo");
const SpecializationsRepo_1 = require("@infrastructure/database/repo/SpecializationsRepo");
const PracticeAreaMapper_1 = require("@infrastructure/Mapper/Implementations/PracticeAreaMapper");
const SpecializationMapper_1 = require("@infrastructure/Mapper/Implementations/SpecializationMapper");
const AddPracticeAreaController_1 = require("@interfaces/controller/PracticeArea/AddPracticeAreaController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const AddPracticeAreasUsecase_1 = require("@src/application/usecases/PracitceAreas/Implementation/AddPracticeAreasUsecase");
function AddPracticeAreasComposer() {
    const usecase = new AddPracticeAreasUsecase_1.AddPracticeAreaUsecase(new PracticeAreaRepo_1.PracticeAreaRepo(new PracticeAreaMapper_1.PracticeAreaMapper()), new SpecializationsRepo_1.SpecializationRepo(new SpecializationMapper_1.SpecializationMapper()));
    return new AddPracticeAreaController_1.AddPracticeAreaController(usecase, new HttpSuccess_1.HttpSuccess(), new HttpErrors_1.HttpErrors());
}
