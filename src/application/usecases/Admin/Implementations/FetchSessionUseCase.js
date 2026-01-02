"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchSessionUseCase = void 0;
class FetchSessionUseCase {
    sessionRepo;
    constructor(sessionRepo) {
        this.sessionRepo = sessionRepo;
    }
    async execute(input) {
        const sessions = await this.sessionRepo.findSessionsAggregate(input);
        return sessions;
    }
}
exports.FetchSessionUseCase = FetchSessionUseCase;
