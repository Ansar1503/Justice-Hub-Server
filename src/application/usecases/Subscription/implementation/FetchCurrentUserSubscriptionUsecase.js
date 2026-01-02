"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCurrentUserSubscriptionUsecase = void 0;
class FetchCurrentUserSubscriptionUsecase {
    _userSubscriptionRepo;
    constructor(_userSubscriptionRepo) {
        this._userSubscriptionRepo = _userSubscriptionRepo;
    }
    async execute(input) {
        const userSub = await this._userSubscriptionRepo.findByUser(input);
        if (!userSub)
            return null;
        return {
            id: userSub.id,
            userId: userSub.userId,
            planId: userSub.planId,
            stripeSubscriptionId: userSub.stripeSubscriptionId,
            stripeCustomerId: userSub.stripeCustomerId,
            status: userSub.status,
            startDate: userSub.startDate,
            endDate: userSub.endDate,
            autoRenew: userSub.autoRenew,
            benefitsSnapshot: userSub.benefitsSnapshot,
            createdAt: userSub.createdAt,
            updatedAt: userSub.updatedAt,
        };
    }
}
exports.FetchCurrentUserSubscriptionUsecase = FetchCurrentUserSubscriptionUsecase;
