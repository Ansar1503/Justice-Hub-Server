"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoveFailedSessionComposer = RemoveFailedSessionComposer;
const RemoveFailedSessionController_1 = require("@interfaces/controller/Client/Sessions/RemoveFailedSessionController");
const GetSessionMetadataUseCase_1 = require("@src/application/usecases/Client/implementations/GetSessionMetadataUseCase");
const AppointmentsRepo_1 = require("@infrastructure/database/repo/AppointmentsRepo");
function RemoveFailedSessionComposer() {
    const usecase = new GetSessionMetadataUseCase_1.GetSessionMetadataUseCase(new AppointmentsRepo_1.AppointmentsRepository());
    return new RemoveFailedSessionController_1.RemoveFailedSessionController(usecase);
}
