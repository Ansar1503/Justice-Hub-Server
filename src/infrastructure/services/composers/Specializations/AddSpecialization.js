"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSpecializationComposer = AddSpecializationComposer;
const SpecializationsRepo_1 = require("@infrastructure/database/repo/SpecializationsRepo");
const SpecializationMapper_1 = require("@infrastructure/Mapper/Implementations/SpecializationMapper");
const AddSpecializationController_1 = require("@interfaces/controller/Specializations/AddSpecializationController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const AddSpecializationUsecase_1 = require("@src/application/usecases/Specializations/implementations/AddSpecializationUsecase");
function AddSpecializationComposer() {
    const usecase = new AddSpecializationUsecase_1.AddSpecializationUsecase(new SpecializationsRepo_1.SpecializationRepo(new SpecializationMapper_1.SpecializationMapper()));
    return new AddSpecializationController_1.AddSpecializationController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
