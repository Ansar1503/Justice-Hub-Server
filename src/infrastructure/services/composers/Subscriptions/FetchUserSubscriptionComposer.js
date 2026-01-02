"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCurrentUserSubscriptionComposer = FetchCurrentUserSubscriptionComposer;
const UserSubscriptionMapper_1 = require("@infrastructure/Mapper/Implementations/UserSubscriptionMapper");
const UserSubscriptionRepository_1 = require("@infrastructure/database/repo/UserSubscriptionRepository");
const FetchCurrentUserSubscriptionController_1 = require("@interfaces/controller/Subscription/FetchCurrentUserSubscriptionController");
const HttpErrors_1 = require("@interfaces/helpers/implementation/HttpErrors");
const HttpSuccess_1 = require("@interfaces/helpers/implementation/HttpSuccess");
const FetchCurrentUserSubscriptionUsecase_1 = require("@src/application/usecases/Subscription/implementation/FetchCurrentUserSubscriptionUsecase");
function FetchCurrentUserSubscriptionComposer() {
    const usecase = new FetchCurrentUserSubscriptionUsecase_1.FetchCurrentUserSubscriptionUsecase(new UserSubscriptionRepository_1.UserSubscriptionRepository(new UserSubscriptionMapper_1.UserSubscriptionMapper()));
    return new FetchCurrentUserSubscriptionController_1.FetchCurrentUserSubscriptionController(usecase, new HttpErrors_1.HttpErrors(), new HttpSuccess_1.HttpSuccess());
}
