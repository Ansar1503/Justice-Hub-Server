"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchStripeSessionDetailsUseCase = void 0;
const stripe_service_1 = require("@src/application/services/stripe.service");
class FetchStripeSessionDetailsUseCase {
    async execute(input) {
        const sessionDetails = await (0, stripe_service_1.getSessionDetails)(input);
        return {
            lawyer: sessionDetails?.metadata?.lawyer_name,
            slot: sessionDetails?.metadata?.time,
            date: sessionDetails?.metadata?.date,
            amount: sessionDetails?.metadata?.amount,
        };
    }
}
exports.FetchStripeSessionDetailsUseCase = FetchStripeSessionDetailsUseCase;
