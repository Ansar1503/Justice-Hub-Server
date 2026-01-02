"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeLawyerVerificationComposer = ChangeLawyerVerificationComposer;
const LawyerVerificationRepo_1 = require("@infrastructure/database/repo/LawyerVerificationRepo");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const LawyerVerificaitionMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper");
const UserMapper_1 = require("@infrastructure/Mapper/Implementations/UserMapper");
const ChangeLawyerVerification_1 = require("@interfaces/controller/Admin/ChangeLawyerVerification");
const ChangeLawyerVerificationUseCase_1 = require("@src/application/usecases/Admin/Implementations/ChangeLawyerVerificationUseCase");
function ChangeLawyerVerificationComposer() {
    const lawyerMapper = new LawyerVerificaitionMapper_1.LawyerVerificationMapper();
    const userMapper = new UserMapper_1.UserMapper();
    const lawyerRepo = new LawyerVerificationRepo_1.LawyerVerificationRepo(lawyerMapper);
    const userRepo = new UserRepo_1.UserRepository(userMapper);
    const useCase = new ChangeLawyerVerificationUseCase_1.ChangeLawyerVerificationStatus(userRepo, lawyerRepo);
    const controller = new ChangeLawyerVerification_1.ChangeLawyerVerificationStatusController(useCase);
    return controller;
}
