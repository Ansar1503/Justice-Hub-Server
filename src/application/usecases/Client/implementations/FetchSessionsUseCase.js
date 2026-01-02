"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchSessionsUseCase = void 0;
class FetchSessionsUseCase {
    _sessionRepo;
    constructor(_sessionRepo) {
        this._sessionRepo = _sessionRepo;
    }
    async execute(input) {
        return await this._sessionRepo.aggregate({ ...input, role: "client" });
    }
}
exports.FetchSessionsUseCase = FetchSessionsUseCase;
