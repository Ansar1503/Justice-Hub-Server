"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddSubscriptionPlanComposer = AddSubscriptionPlanComposer;
const SubscriptionRepository_1 = require("@infrastructure/database/repo/SubscriptionRepository");
const SubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/SubscriptionMapper");
const AddSubscriptionPlanController_1 = require("@interfaces/controller/Subscription/AddSubscriptionPlanController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const AddSubscriptionPlanUsecase_1 = require("@src/application/usecases/Subscription/implementation/AddSubscriptionPlanUsecase");
const StripeSubscriptionService_1 = require("@src/application/services/StripeSubscriptionService");
function AddSubscriptionPlanComposer() {
    const usecase = new AddSubscriptionPlanUsecase_1.AddSubscriptionPlanUsecase(new SubscriptionRepository_1.SubscriptionRepository(new SubscriptionMapper_1.SubscriptionPlanMapper()), new StripeSubscriptionService_1.StripeSubscriptionService());
    return new AddSubscriptionPlanController_1.AddSubscriptionPlanController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
