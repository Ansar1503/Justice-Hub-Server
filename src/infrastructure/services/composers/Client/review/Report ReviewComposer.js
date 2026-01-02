"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportReviewComposer = void 0;
const ReportReviewController_1 = require("@interfaces/controller/Client/Reviews/ReportReviewController");
const ReportReviewUseCase_1 = require("@src/application/usecases/Client/implementations/ReportReviewUseCase");
const ReviewRepo_1 = require("@infrastructure/database/repo/ReviewRepo");
const DisputesRepo_1 = require("@infrastructure/database/repo/DisputesRepo");
const ReportReviewComposer = () => {
    const useCase = new ReportReviewUseCase_1.ReportReviewUseCase(new ReviewRepo_1.ReviewRepo(), new DisputesRepo_1.DisputesRepo());
    return new ReportReviewController_1.ReportReviewController(useCase);
};
exports.ReportReviewComposer = ReportReviewComposer;
