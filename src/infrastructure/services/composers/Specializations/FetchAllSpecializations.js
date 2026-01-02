"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllSpecializationsComposer = FetchAllSpecializationsComposer;
const SpecializationsRepo_1 = require("@infrastructure/database/repo/SpecializationsRepo");
const SpecializationMapper_1 = require("@infrastructure/Mapper/Implementations/SpecializationMapper");
const FetchAllSpecializationsController_1 = require("@interfaces/controller/Specializations/FetchAllSpecializationsController");
const FetchAllSpecializationsUsecase_1 = require("@src/application/usecases/Specializations/implementations/FetchAllSpecializationsUsecase");
function FetchAllSpecializationsComposer() {
    const usecase = new FetchAllSpecializationsUsecase_1.FetchAllSpecializationsUsecase(new SpecializationsRepo_1.SpecializationRepo(new SpecializationMapper_1.SpecializationMapper()));
    return new FetchAllSpecializationsController_1.FetchAllSpecializationsController(usecase);
}
