"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchStripeSessionDetailsComposer = FetchStripeSessionDetailsComposer;
const FetchStripeSessionDetails_1 = require("@interfaces/controller/Client/FetchStripeSessionDetails");
const FethStripeSessionDetailsUseCase_1 = require("@src/application/usecases/Client/implementations/FethStripeSessionDetailsUseCase");
function FetchStripeSessionDetailsComposer() {
    const usecase = new FethStripeSessionDetailsUseCase_1.FetchStripeSessionDetailsUseCase();
    return new FetchStripeSessionDetails_1.FetchStripeSessionDetailsController(usecase);
}
