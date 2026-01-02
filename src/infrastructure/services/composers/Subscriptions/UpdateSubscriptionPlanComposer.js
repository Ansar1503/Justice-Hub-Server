"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSubscriptionPlanComposer = UpdateSubscriptionPlanComposer;
const SubscriptionRepository_1 = require("@infrastructure/database/repo/SubscriptionRepository");
const SubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/SubscriptionMapper");
const UpdateSubscriptionPlanController_1 = require("@interfaces/controller/Subscription/UpdateSubscriptionPlanController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const StripeSubscriptionService_1 = require("@src/application/services/StripeSubscriptionService");
const UpdateSubscriptionPlanUsecase_1 = require("@src/application/usecases/Subscription/implementation/UpdateSubscriptionPlanUsecase");
function UpdateSubscriptionPlanComposer() {
    const usecase = new UpdateSubscriptionPlanUsecase_1.UpdateSubscriptionPlanUsecase(new SubscriptionRepository_1.SubscriptionRepository(new SubscriptionMapper_1.SubscriptionPlanMapper()), new StripeSubscriptionService_1.StripeSubscriptionService());
    return new UpdateSubscriptionPlanController_1.UpdateSubscriptionPlanController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
