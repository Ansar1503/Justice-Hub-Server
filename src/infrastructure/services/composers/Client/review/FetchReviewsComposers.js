"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewsComposer = FetchReviewsComposer;
const FetchReviewController_1 = require("@interfaces/controller/Client/Reviews/FetchReviewController");
const FetchReviewUseCase_1 = require("@src/application/usecases/Client/implementations/FetchReviewUseCase");
const ReviewRepo_1 = require("@infrastructure/database/repo/ReviewRepo");
function FetchReviewsComposer() {
    const usecase = new FetchReviewUseCase_1.FetchReviewUseCase(new ReviewRepo_1.ReviewRepo());
    return new FetchReviewController_1.FetchReviewsController(usecase);
}
