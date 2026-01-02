"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAllSubscriptionPlansComposer = FetchAllSubscriptionPlansComposer;
const SubscriptionRepository_1 = require("@infrastructure/database/repo/SubscriptionRepository");
const SubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/SubscriptionMapper");
const FetchAllSubscriptionPlansController_1 = require("@interfaces/controller/Subscription/FetchAllSubscriptionPlansController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchAllSubscriptionPlansUsecase_1 = require("@src/application/usecases/Subscription/implementation/FetchAllSubscriptionPlansUsecase");
function FetchAllSubscriptionPlansComposer() {
    const usecase = new FetchAllSubscriptionPlansUsecase_1.FetchAllSubscriptionPlansUsecase(new SubscriptionRepository_1.SubscriptionRepository(new SubscriptionMapper_1.SubscriptionPlanMapper()));
    return new FetchAllSubscriptionPlansController_1.FetchAllSubscriptionPlansController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
