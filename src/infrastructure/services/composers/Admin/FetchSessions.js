"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSessionsComposer = fetchSessionsComposer;
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const FetchSessions_1 = require("@interfaces/controller/Admin/FetchSessions");
const FetchSessionUseCase_1 = require("@src/application/usecases/Admin/Implementations/FetchSessionUseCase");
function fetchSessionsComposer() {
    const repo = new SessionRepo_1.SessionsRepository();
    const usecase = new FetchSessionUseCase_1.FetchSessionUseCase(repo);
    const controller = new FetchSessions_1.FetchSessions(usecase);
    return controller;
}
