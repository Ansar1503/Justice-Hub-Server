"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReviewsComposer = UpdateReviewsComposer;
const UpdateReviewController_1 = require("@interfaces/controller/Client/Reviews/UpdateReviewController");
const UpdateReviewUseCase_1 = require("@src/application/usecases/Client/implementations/UpdateReviewUseCase");
const ReviewRepo_1 = require("@infrastructure/database/repo/ReviewRepo");
function UpdateReviewsComposer() {
    const usecase = new UpdateReviewUseCase_1.UpdateReviewUseCase(new ReviewRepo_1.ReviewRepo());
    return new UpdateReviewController_1.UpdateReviewsController(usecase);
}
