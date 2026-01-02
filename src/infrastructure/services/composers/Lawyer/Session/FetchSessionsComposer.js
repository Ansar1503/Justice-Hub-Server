"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchSessionsComposer = FetchSessionsComposer;
const FetchSessionsController_1 = require("@interfaces/controller/Lawyer/Sessions/FetchSessionsController");
const SessionRepo_1 = require("@infrastructure/database/repo/SessionRepo");
const FetchSessionsUseCase_1 = require("@src/application/usecases/Client/implementations/FetchSessionsUseCase");
function FetchSessionsComposer() {
    const usecase = new FetchSessionsUseCase_1.FetchSessionsUseCase(new SessionRepo_1.SessionsRepository());
    return new FetchSessionsController_1.FetchSessionsController(usecase);
}
