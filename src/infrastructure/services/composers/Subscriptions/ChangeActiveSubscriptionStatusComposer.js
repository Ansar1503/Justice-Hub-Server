"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangeActiveSubscriptionStatusComposer = ChangeActiveSubscriptionStatusComposer;
const SubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/SubscriptionMapper");
const SubscriptionRepository_1 = require("@infrastructure/database/repo/SubscriptionRepository");
const ChangeActiveSubscriptionStatusController_1 = require("@interfaces/controller/Subscription/ChangeActiveSubscriptionStatusController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const StripeSubscriptionService_1 = require("@src/application/services/StripeSubscriptionService");
const DeactiveSubscriptionUsecase_1 = require("@src/application/usecases/Subscription/implementation/DeactiveSubscriptionUsecase");
function ChangeActiveSubscriptionStatusComposer() {
    const usecase = new DeactiveSubscriptionUsecase_1.ChangeActiveSubscriptionStatusUsecase(new SubscriptionRepository_1.SubscriptionRepository(new SubscriptionMapper_1.SubscriptionPlanMapper()), new StripeSubscriptionService_1.StripeSubscriptionService());
    return new ChangeActiveSubscriptionStatusController_1.ChangeActiveSubscriptionStatusController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
