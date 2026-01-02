"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteSpecializationComposer = DeleteSpecializationComposer;
const PracticeAreaRepo_1 = require("@infrastructure/database/repo/PracticeAreaRepo");
const SpecializationsRepo_1 = require("@infrastructure/database/repo/SpecializationsRepo");
const PracticeAreaMapper_1 = require("@infrastructure/Mapper/Implementations/PracticeAreaMapper");
const SpecializationMapper_1 = require("@infrastructure/Mapper/Implementations/SpecializationMapper");
const DeleteSpecializationController_1 = require("@interfaces/controller/Specializations/DeleteSpecializationController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const DeleteSpecializationUsecase_1 = require("@src/application/usecases/Specializations/implementations/DeleteSpecializationUsecase");
function DeleteSpecializationComposer() {
    const usecase = new DeleteSpecializationUsecase_1.DeleteSpecializationUsecase(new SpecializationsRepo_1.SpecializationRepo(new SpecializationMapper_1.SpecializationMapper()), new PracticeAreaRepo_1.PracticeAreaRepo(new PracticeAreaMapper_1.PracticeAreaMapper()));
    return new DeleteSpecializationController_1.DeleteSpecializationController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
