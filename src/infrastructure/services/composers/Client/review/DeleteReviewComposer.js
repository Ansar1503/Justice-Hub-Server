"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteReviewComposer = DeleteReviewComposer;
const DeleteReviewController_1 = require("@interfaces/controller/Client/Reviews/DeleteReviewController");
const DeleteReviewUseCase_1 = require("@src/application/usecases/Client/implementations/DeleteReviewUseCase");
const ReviewRepo_1 = require("@infrastructure/database/repo/ReviewRepo");
function DeleteReviewComposer() {
    const usecase = new DeleteReviewUseCase_1.DelereReviewUseCase(new ReviewRepo_1.ReviewRepo());
    return new DeleteReviewController_1.DeleteReviewController(usecase);
}
