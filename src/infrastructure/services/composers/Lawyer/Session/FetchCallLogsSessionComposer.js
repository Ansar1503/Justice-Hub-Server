"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FetchCallLogsSessionComposer = FetchCallLogsSessionComposer;
const FetchCallLogsController_1 = require("@interfaces/controller/Lawyer/FetchCallLogsController");
const FetchCallLogsUseCase_1 = require("@src/application/usecases/Lawyer/implementations/FetchCallLogsUseCase");
const CallLogsRepo_1 = require("@infrastructure/database/repo/CallLogsRepo");
function FetchCallLogsSessionComposer() {
    const usecase = new FetchCallLogsUseCase_1.FetchCallLogsUseCase(new CallLogsRepo_1.CallLogsRepository());
    return new FetchCallLogsController_1.FetchCallLogsController(usecase);
}
