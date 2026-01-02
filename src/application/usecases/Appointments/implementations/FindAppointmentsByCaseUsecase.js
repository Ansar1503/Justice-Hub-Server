"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindAppointmentsByCaseUsecase = void 0;
class FindAppointmentsByCaseUsecase {
    _appointmentsRepo;
    _caseRepo;
    constructor(_appointmentsRepo, _caseRepo) {
        this._appointmentsRepo = _appointmentsRepo;
        this._caseRepo = _caseRepo;
    }
    async execute(input) {
        const existingCase = await this._caseRepo.findById(input);
        if (!existingCase)
            throw new Error("Case not found");
        const existingAppointments = await this._appointmentsRepo.findByCaseId(existingCase.id);
        return existingAppointments;
    }
}
exports.FindAppointmentsByCaseUsecase = FindAppointmentsByCaseUsecase;
