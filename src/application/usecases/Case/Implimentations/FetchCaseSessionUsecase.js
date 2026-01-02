"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCaseSessionUsecase = void 0;
class FetchCaseSessionUsecase {
    _sessionRepo;
    constructor(_sessionRepo) {
        this._sessionRepo = _sessionRepo;
    }
    async execute(input) {
        return this._sessionRepo.findByCase(input);
    }
}
exports.FetchCaseSessionUsecase = FetchCaseSessionUsecase;
