"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HandleSubscribeWebhookComposer = HandleSubscribeWebhookComposer;
const SubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/SubscriptionMapper");
const UnitofWork_1 = require("@infrastructure/database/UnitofWork/implementations/UnitofWork");
const SubscriptionRepository_1 = require("@infrastructure/database/repo/SubscriptionRepository");
const HandleSubscriptionWebhookController_1 = require("@interfaces/controller/Subscription/HandleSubscriptionWebhookController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const StripeSubscriptionService_1 = require("@src/application/services/StripeSubscriptionService");
const SubscriptionWebhookHandlerUsecase_1 = require("@src/application/usecases/Subscription/implementation/SubscriptionWebhookHandlerUsecase");
function HandleSubscribeWebhookComposer() {
    const usecase = new SubscriptionWebhookHandlerUsecase_1.SubscriptionWebhookHandlerUsecase(new SubscriptionRepository_1.SubscriptionRepository(new SubscriptionMapper_1.SubscriptionPlanMapper()), new StripeSubscriptionService_1.StripeSubscriptionService(), new UnitofWork_1.MongoUnitofWork());
    return new HandleSubscriptionWebhookController_1.HandleSubscribeWebhookController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
