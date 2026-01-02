"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelSubscriptionComposer = CancelSubscriptionComposer;
const UserSubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/UserSubscriptionMapper");
const UserSubscriptionRepository_1 = require("@infrastructure/database/repo/UserSubscriptionRepository");
const CancelSubscriptoinController_1 = require("@interfaces/controller/Subscription/CancelSubscriptoinController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const StripeSubscriptionService_1 = require("@src/application/services/StripeSubscriptionService");
const CancelSubscriptionUsecase_1 = require("@src/application/usecases/Subscription/implementation/CancelSubscriptionUsecase");
function CancelSubscriptionComposer() {
    const usecase = new CancelSubscriptionUsecase_1.CancelSubscriptionUsecase(new UserSubscriptionRepository_1.UserSubscriptionRepository(new UserSubscriptionMapper_1.UserSubscriptionMapper()), new StripeSubscriptionService_1.StripeSubscriptionService());
    return new CancelSubscriptoinController_1.CancelSubscriptionController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
