"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllSubscriptionPlansUsecase = void 0;
class FetchAllSubscriptionPlansUsecase {
    _subscriptionRepo;
    constructor(_subscriptionRepo) {
        this._subscriptionRepo = _subscriptionRepo;
    }
    async execute() {
        const existingPlans = await this._subscriptionRepo.findAll();
        if (!existingPlans || existingPlans.length === 0) {
            throw new Error("No existing subscription plans found");
        }
        return existingPlans.map((plan) => ({
            id: plan.id,
            name: plan.name,
            description: plan.description,
            price: plan.price,
            interval: plan.interval,
            stripeProductId: plan.stripeProductId,
            stripePriceId: plan.stripePriceId,
            isFree: plan.isFree,
            isActive: plan.isActive,
            benefits: {
                autoRenew: plan.benefits.autoRenew,
                bookingsPerMonth: plan.benefits.bookingsPerMonth,
                chatAccess: plan.benefits.chatAccess,
                discountPercent: plan.benefits.discountPercent,
                documentUploadLimit: plan.benefits.documentUploadLimit,
                expiryAlert: plan.benefits.expiryAlert,
                followupBookingsPerCase: plan.benefits.followupBookingsPerCase,
            },
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt,
        }));
    }
}
exports.FetchAllSubscriptionPlansUsecase = FetchAllSubscriptionPlansUsecase;
