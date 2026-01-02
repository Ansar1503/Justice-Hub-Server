"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewsByUserIdComposer = FetchReviewsByUserIdComposer;
const ReviewRepo_1 = require("@infrastructure/database/repo/ReviewRepo");
const FetchReviewsList_1 = require("@interfaces/controller/Client/Reviews/FetchReviewsList");
const FetchReviewUseCase_1 = require("@src/application/usecases/Review/implementations/FetchReviewUseCase");
function FetchReviewsByUserIdComposer() {
    const usecase = new FetchReviewUseCase_1.FetchReviewUseCase(new ReviewRepo_1.ReviewRepo());
    return new FetchReviewsList_1.FetchReviewsList(usecase);
}
