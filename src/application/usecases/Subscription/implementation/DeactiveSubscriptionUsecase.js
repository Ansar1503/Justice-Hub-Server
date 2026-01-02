"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeActiveSubscriptionStatusUsecase = void 0;
class ChangeActiveSubscriptionStatusUsecase {
    _subscriptionRepo;
    _stripeService;
    constructor(_subscriptionRepo, _stripeService) {
        this._subscriptionRepo = _subscriptionRepo;
        this._stripeService = _stripeService;
    }
    async execute(input) {
        const planExists = await this._subscriptionRepo.findById(input.id);
        if (!planExists)
            throw new Error("plan not found");
        try {
            if (planExists.stripeProductId) {
                await this._stripeService.updateProductActiveStatus(planExists.stripeProductId, input.status);
            }
            if (planExists.stripePriceId) {
                await this._stripeService.updatePriceActiveStatus(planExists.stripePriceId, input.status);
            }
        }
        catch (error) {
            throw error;
        }
        const updated = await this._subscriptionRepo.updateActiveStatus(input.id, input.status);
        if (!updated)
            throw new Error(input.status === true
                ? "Subscription plan activation failed"
                : "Subscription Plan Deactivation Failed");
        return {
            benefits: {
                autoRenew: updated.benefits.autoRenew,
                bookingsPerMonth: updated.benefits.bookingsPerMonth,
                chatAccess: updated.benefits.chatAccess,
                discountPercent: updated.benefits.discountPercent,
                documentUploadLimit: updated.benefits.documentUploadLimit,
                expiryAlert: updated.benefits.expiryAlert,
                followupBookingsPerCase: updated.benefits.followupBookingsPerCase,
            },
            createdAt: updated.createdAt,
            id: updated.id,
            interval: updated.interval,
            isActive: updated.isActive,
            isFree: updated.isFree,
            name: updated.name,
            price: updated.price,
            updatedAt: updated.updatedAt,
            description: updated.description,
            stripePriceId: updated.stripePriceId,
            stripeProductId: updated.stripeProductId,
        };
    }
}
exports.ChangeActiveSubscriptionStatusUsecase = ChangeActiveSubscriptionStatusUsecase;
