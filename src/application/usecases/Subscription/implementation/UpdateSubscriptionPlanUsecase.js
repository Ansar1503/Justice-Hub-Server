"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionPlanUsecase = void 0;
class UpdateSubscriptionPlanUsecase {
    _subscriptionRepo;
    _stripeSubscriptionService;
    constructor(_subscriptionRepo, _stripeSubscriptionService) {
        this._subscriptionRepo = _subscriptionRepo;
        this._stripeSubscriptionService = _stripeSubscriptionService;
    }
    async execute(input) {
        const planExists = await this._subscriptionRepo.findById(input.id);
        if (!planExists)
            throw new Error("No plan exists with the provided ID");
        if (input.name !== planExists.name ||
            input.description !== planExists.description) {
            await this._stripeSubscriptionService.updateProduct(planExists.stripeProductId, { name: input.name, description: input.description });
        }
        let newStripePriceId = planExists.stripePriceId;
        if (input.price !== planExists.price ||
            input.interval !== planExists.interval) {
            if (planExists.stripePriceId) {
                await this._stripeSubscriptionService.deactivatePrice(planExists.stripePriceId);
            }
            newStripePriceId = await this._stripeSubscriptionService.createPrice({
                productId: planExists.stripeProductId,
                amount: input.price,
                currency: "INR",
                interval: input.interval === "none"
                    ? "none"
                    : input.interval === "monthly"
                        ? "month"
                        : "year",
            });
        }
        const updatedData = await this._subscriptionRepo.update({
            ...input,
            stripePriceId: newStripePriceId,
        });
        if (!updatedData)
            throw new Error("subscription plan update failed");
        return {
            id: updatedData.id,
            name: updatedData.name,
            description: updatedData.description,
            price: updatedData.price,
            interval: updatedData.interval,
            stripeProductId: updatedData.stripeProductId,
            stripePriceId: updatedData.stripePriceId,
            isFree: updatedData.isFree,
            isActive: updatedData.isActive,
            benefits: {
                autoRenew: updatedData.benefits.autoRenew,
                bookingsPerMonth: updatedData.benefits.bookingsPerMonth,
                chatAccess: updatedData.benefits.chatAccess,
                discountPercent: updatedData.benefits.discountPercent,
                documentUploadLimit: updatedData.benefits.documentUploadLimit,
                expiryAlert: updatedData.benefits.expiryAlert,
                followupBookingsPerCase: updatedData.benefits.followupBookingsPerCase,
            },
            createdAt: updatedData.createdAt,
            updatedAt: updatedData.updatedAt,
        };
    }
}
exports.UpdateSubscriptionPlanUsecase = UpdateSubscriptionPlanUsecase;
