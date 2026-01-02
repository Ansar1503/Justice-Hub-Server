"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSubscriptionPlanUsecase = void 0;
const SubscriptionEntity_1 = require("@domain/entities/SubscriptionEntity");
class AddSubscriptionPlanUsecase {
    _subscriptionRepo;
    _stripeSubscriptionService;
    constructor(_subscriptionRepo, _stripeSubscriptionService) {
        this._subscriptionRepo = _subscriptionRepo;
        this._stripeSubscriptionService = _stripeSubscriptionService;
    }
    async execute(input) {
        console.log("input", input);
        const existingSubscriptionPlans = await this._subscriptionRepo.findAll();
        if (existingSubscriptionPlans.length >= 3) {
            throw new Error("You can only add up to 3 subscription plans");
        }
        const duplicatePlan = existingSubscriptionPlans.find((plan) => plan.name === input.name ||
            plan.price === input.price ||
            plan.interval === input.interval);
        if (duplicatePlan !== null && duplicatePlan !== undefined) {
            throw new Error("A similar subscription plan already exists");
        }
        let stripeProductId;
        let stripePriceId;
        try {
            const productId = await this._stripeSubscriptionService.createProduct({
                name: input.name,
                description: input.description,
            });
            stripeProductId = productId;
            stripePriceId = await this._stripeSubscriptionService.createPrice({
                productId,
                amount: input.price,
                currency: "INR",
                interval: input.interval === "none"
                    ? "none"
                    : input.interval === "monthly"
                        ? "month"
                        : "year",
            });
            const subscriptionPayload = SubscriptionEntity_1.SubscriptionPlan.create({
                benefits: input.benefits,
                interval: input.interval,
                name: input.name,
                price: input.price,
                description: input.description,
                isFree: input.isFree,
                stripePriceId,
                stripeProductId,
            });
            const newSubscriptionPlan = await this._subscriptionRepo.create(subscriptionPayload);
            return {
                benefits: {
                    autoRenew: newSubscriptionPlan.benefits.autoRenew,
                    bookingsPerMonth: newSubscriptionPlan.benefits.bookingsPerMonth,
                    chatAccess: newSubscriptionPlan.benefits.chatAccess,
                    discountPercent: newSubscriptionPlan.benefits.discountPercent,
                    documentUploadLimit: newSubscriptionPlan.benefits.documentUploadLimit,
                    expiryAlert: newSubscriptionPlan.benefits.expiryAlert,
                    followupBookingsPerCase: newSubscriptionPlan.benefits.followupBookingsPerCase,
                },
                createdAt: newSubscriptionPlan.createdAt,
                id: newSubscriptionPlan.id,
                interval: newSubscriptionPlan.interval,
                isActive: newSubscriptionPlan.isActive,
                isFree: newSubscriptionPlan.isFree,
                name: newSubscriptionPlan.name,
                price: newSubscriptionPlan.price,
                updatedAt: newSubscriptionPlan.updatedAt,
                description: newSubscriptionPlan.description,
                stripePriceId: newSubscriptionPlan.stripePriceId,
                stripeProductId: newSubscriptionPlan.stripeProductId,
            };
        }
        catch (error) {
            console.error("Error while creating subscription plan:", error);
            if (stripeProductId) {
                try {
                    await this._stripeSubscriptionService.deleteProduct(stripeProductId);
                }
                catch (cleanupError) {
                    console.error("Failed to clean up Stripe product:", cleanupError);
                }
            }
            throw new Error("Failed to create subscription plan");
        }
    }
}
exports.AddSubscriptionPlanUsecase = AddSubscriptionPlanUsecase;
