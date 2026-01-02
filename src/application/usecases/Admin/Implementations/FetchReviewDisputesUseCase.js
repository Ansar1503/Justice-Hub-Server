"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchReviewDisputesUseCase = void 0;
class FetchReviewDisputesUseCase {
    DisputesRepo;
    constructor(DisputesRepo) {
        this.DisputesRepo = DisputesRepo;
    }
    async execute(input) {
        const disputes = await this.DisputesRepo.findReviewDisputes(input);
        return disputes;
    }
}
exports.FetchReviewDisputesUseCase = FetchReviewDisputesUseCase;
