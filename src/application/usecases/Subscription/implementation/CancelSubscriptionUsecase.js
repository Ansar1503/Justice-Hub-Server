"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelSubscriptionUsecase = void 0;
class CancelSubscriptionUsecase {
    _userSubscriptionRepo;
    _stripeSubscriptionService;
    constructor(_userSubscriptionRepo, _stripeSubscriptionService) {
        this._userSubscriptionRepo = _userSubscriptionRepo;
        this._stripeSubscriptionService = _stripeSubscriptionService;
    }
    async execute(input) {
        const existingSub = await this._userSubscriptionRepo.findByUser(input.userId);
        if (!existingSub)
            throw new Error("No active subscription found.");
        if (!existingSub.isActive()) {
            throw new Error("Subscription is already inactive or canceled.");
        }
        if (existingSub.stripeSubscriptionId) {
            try {
                await this._stripeSubscriptionService.cancelAtPeriodEnd(existingSub.stripeSubscriptionId);
            }
            catch (error) {
                console.error("❌ Failed to schedule cancellation:", error);
                throw new Error("Failed to cancel subscription at period end.");
            }
        }
        existingSub.setStatus("canceled");
        await this._userSubscriptionRepo.createOrUpdate(existingSub);
        return {
            message: "Your subscription will remain active until the end of your billing period.",
        };
    }
}
exports.CancelSubscriptionUsecase = CancelSubscriptionUsecase;
