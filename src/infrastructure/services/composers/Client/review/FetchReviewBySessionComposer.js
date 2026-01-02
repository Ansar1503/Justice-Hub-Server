"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewsBySessionComposer = FetchReviewsBySessionComposer;
const FetchReviewBySessionController_1 = require("@interfaces/controller/Client/Reviews/FetchReviewBySessionController");
const FetchReviewBySessionUseCase_1 = require("@src/application/usecases/Client/implementations/FetchReviewBySessionUseCase");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const ReviewRepo_1 = require("@infrastructure/database/repo/ReviewRepo");
function FetchReviewsBySessionComposer() {
    const usecase = new FetchReviewBySessionUseCase_1.FetchReviewBySessionUseCase(new SessionRepo_1.SessionsRepository(), new ReviewRepo_1.ReviewRepo());
    return new FetchReviewBySessionController_1.FetchReviewsBySessionController(usecase);
}
