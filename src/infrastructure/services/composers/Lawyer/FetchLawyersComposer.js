"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchLawyerComposer = FetchLawyerComposer;
const FetchLawyerController_1 = require("@interfaces/controller/Lawyer/FetchLawyerController");
const FetchLawyerDataUseCase_1 = require("@src/application/usecases/Lawyer/implementations/FetchLawyerDataUseCase");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const LawyerRepo_1 = require("@infrastructure/database/repo/LawyerRepo");
const LawyerDocuemtsRepo_1 = require("@infrastructure/database/repo/LawyerDocuemtsRepo");
const LawyerVerificationRepo_1 = require("@infrastructure/database/repo/LawyerVerificationRepo");
const LawyerVerificaitionMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper");
function FetchLawyerComposer() {
    const userRepo = new UserRepo_1.UserRepository();
    const lawyerRepo = new LawyerRepo_1.LawyerRepository();
    const lawyerDocsRepo = new LawyerDocuemtsRepo_1.LawyerDocumentsRepository();
    const lawyerVerificationRepo = new LawyerVerificationRepo_1.LawyerVerificationRepo(new LawyerVerificaitionMapper_1.LawyerVerificationMapper());
    const usecase = new FetchLawyerDataUseCase_1.FetchLawyerDataUseCase(userRepo, lawyerRepo, lawyerDocsRepo, lawyerVerificationRepo);
    return new FetchLawyerController_1.FetchLawyerController(usecase);
}
