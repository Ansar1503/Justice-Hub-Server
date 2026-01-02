"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscribePlanComposer = SubscribePlanComposer;
const SubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/SubscriptionMapper");
const UserSubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/UserSubscriptionMapper");
const SubscriptionRepository_1 = require("@infrastructure/database/repo/SubscriptionRepository");
const UserRepo_1 = require("@infrastructure/database/repo/UserRepo");
const UserSubscriptionRepository_1 = require("@infrastructure/database/repo/UserSubscriptionRepository");
const SubscribePlanController_1 = require("@interfaces/controller/Subscription/SubscribePlanController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const StripeSubscriptionService_1 = require("@src/application/services/StripeSubscriptionService");
const SubscribePlanUsecase_1 = require("@src/application/usecases/Subscription/implementation/SubscribePlanUsecase");
function SubscribePlanComposer() {
    const usecase = new SubscribePlanUsecase_1.SubscribePlanUsecase(new SubscriptionRepository_1.SubscriptionRepository(new SubscriptionMapper_1.SubscriptionPlanMapper()), new UserSubscriptionRepository_1.UserSubscriptionRepository(new UserSubscriptionMapper_1.UserSubscriptionMapper()), new StripeSubscriptionService_1.StripeSubscriptionService(), new UserRepo_1.UserRepository());
    return new SubscribePlanController_1.SubscribePlanController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
