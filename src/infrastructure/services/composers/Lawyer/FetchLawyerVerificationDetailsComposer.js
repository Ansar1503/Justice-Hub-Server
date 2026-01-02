"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyerVerificationDetailsComposer = FetchLawyerVerificationDetailsComposer;
const LawyerVerificationRepo_1 = require("@infrastructure/database/repo/LawyerVerificationRepo");
const LawyerVerificaitionMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper");
const FetchLawyersVerificationDetails_1 = require("@interfaces/controller/Lawyer/FetchLawyersVerificationDetails");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchLawyerVerificationDetailsUsecase_1 = require("@src/application/usecases/Lawyer/implementations/FetchLawyerVerificationDetailsUsecase");
function FetchLawyerVerificationDetailsComposer() {
    const usecase = new FetchLawyerVerificationDetailsUsecase_1.FetchLawyerVerificationDetailsUsecase(new LawyerVerificationRepo_1.LawyerVerificationRepo(new LawyerVerificaitionMapper_1.LawyerVerificationMapper()));
    return new FetchLawyersVerificationDetails_1.FetchLawyersVerificationDataController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
