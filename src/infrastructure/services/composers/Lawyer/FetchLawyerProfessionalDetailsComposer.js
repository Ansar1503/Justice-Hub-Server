"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyersProfessionalDetailscomposer = FetchLawyersProfessionalDetailscomposer;
const LawyerRepo_1 = require("@infrastructure/database/repo/LawyerRepo");
const LawyerMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerMapper");
const FetchLawyerProfessionalDetailsController_1 = require("@interfaces/controller/Lawyer/FetchLawyerProfessionalDetailsController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchLawyerProfessionalDetailsUsecase_1 = require("@src/application/usecases/Lawyer/implementations/FetchLawyerProfessionalDetailsUsecase");
function FetchLawyersProfessionalDetailscomposer() {
    const usecase = new FetchLawyerProfessionalDetailsUsecase_1.FetchLawyerProfessionalDetailsUsecase(new LawyerRepo_1.LawyerRepository(new LawyerMapper_1.LawyerMapper()));
    return new FetchLawyerProfessionalDetailsController_1.FetchLawyerProfessionalDetailsController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
