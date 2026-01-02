"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddReviewComposer = AddReviewComposer;
const AddReviewController_1 = require("@interfaces/controller/Client/Reviews/AddReviewController");
const AddReviewUseCase_1 = require("@src/application/usecases/Client/implementations/AddReviewUseCase");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const ReviewRepo_1 = require("@infrastructure/database/repo/ReviewRepo");
const LawyerVerificationRepo_1 = require("@infrastructure/database/repo/LawyerVerificationRepo");
const LawyerVerificaitionMapper_1 = require("@infrastructure/Mapper/Implementations/LawyerVerificaitionMapper");
function AddReviewComposer() {
    const usecase = new AddReviewUseCase_1.AddReviewUseCase(new UserRepo_1.UserRepository(), new LawyerVerificationRepo_1.LawyerVerificationRepo(new LawyerVerificaitionMapper_1.LawyerVerificationMapper()), new ReviewRepo_1.ReviewRepo());
    return new AddReviewController_1.AddReviewController(usecase);
}
