"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetSessionMetadataUseCase = void 0;
const stripe_service_1 = require("@src/application/services/stripe.service");
class GetSessionMetadataUseCase {
    appointmentRepo;
    constructor(appointmentRepo) {
        this.appointmentRepo = appointmentRepo;
    }
    async execute(input) {
        const metadata = await (0, stripe_service_1.getSessionMetaData)(input);
        const { client_id, date, duration, lawyer_id, time } = metadata;
        if (!client_id || !date || !duration || !lawyer_id || !time) {
            const error = new Error("metatdata not found");
            error.code = 404;
            throw error;
        }
        return await this.appointmentRepo.delete({
            client_id,
            date: new Date(date),
            duration: Number(duration),
            time,
            lawyer_id,
        });
    }
}
exports.GetSessionMetadataUseCase = GetSessionMetadataUseCase;
