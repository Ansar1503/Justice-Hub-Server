"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLawyersProfessionalDetailsComposer = UpdateLawyersProfessionalDetailsComposer;
const LawyerRepo_1 = require("@infrastructure/database/repo/LawyerRepo");
const LawyerMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerMapper");
const UpdateLawyersProfessionalDetails_1 = require("@interfaces/controller/Lawyer/UpdateLawyersProfessionalDetails");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const UpdateProfessionalDetailsUsecase_1 = require("@src/application/usecases/Lawyer/implementations/UpdateProfessionalDetailsUsecase");
function UpdateLawyersProfessionalDetailsComposer() {
    const usecase = new UpdateProfessionalDetailsUsecase_1.UpdateProfessionalDetailsUsecase(new LawyerRepo_1.LawyerRepository(new LawyerMapper_1.LawyerMapper()));
    return new UpdateLawyersProfessionalDetails_1.UpdateLawyersProfessionalDetails(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
