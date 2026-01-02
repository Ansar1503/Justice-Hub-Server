"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchAppointmentsClientUseCase = void 0;
class FetchAppointmentsClientUseCase {
    appointmentRepo;
    constructor(appointmentRepo) {
        this.appointmentRepo = appointmentRepo;
    }
    async execute(input) {
        return await this.appointmentRepo.findAllAggregate(input);
    }
}
exports.FetchAppointmentsClientUseCase = FetchAppointmentsClientUseCase;
