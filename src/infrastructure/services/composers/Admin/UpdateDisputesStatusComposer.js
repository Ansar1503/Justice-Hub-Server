"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDisputesStatusComposer = UpdateDisputesStatusComposer;
const DisputesRepo_1 = require("@infrastructure/database/repo/DisputesRepo");
const ChangeDisputesStatus_1 = require("@interfaces/controller/Admin/ChangeDisputesStatus");
const UpdateDisputesStatusUseCase_1 = require("@src/application/usecases/Admin/Implementations/UpdateDisputesStatusUseCase");
function UpdateDisputesStatusComposer() {
    const usecase = new UpdateDisputesStatusUseCase_1.UpdateDisputesStatusUseCase(new DisputesRepo_1.DisputesRepo());
    return new ChangeDisputesStatus_1.ChangeDisputesStatusController(usecase);
}
