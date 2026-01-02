"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewDipsutesComposer = FetchReviewDipsutesComposer;
const DisputesRepo_1 = require("@infrastructure/database/repo/DisputesRepo");
const FetchReviewDisputes_1 = require("@interfaces/controller/Admin/FetchReviewDisputes");
const FetchReviewDisputesUseCase_1 = require("@src/application/usecases/Admin/Implementations/FetchReviewDisputesUseCase");
function FetchReviewDipsutesComposer() {
    const repo = new DisputesRepo_1.DisputesRepo();
    const usecase = new FetchReviewDisputesUseCase_1.FetchReviewDisputesUseCase(repo);
    const controller = new FetchReviewDisputes_1.FetchReviewDisputes(usecase);
    return controller;
}
