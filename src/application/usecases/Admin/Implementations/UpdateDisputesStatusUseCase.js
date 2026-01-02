"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateDisputesStatusUseCase = void 0;
class UpdateDisputesStatusUseCase {
    _disputesRepo;
    constructor(_disputesRepo) {
        this._disputesRepo = _disputesRepo;
    }
    async execute(input) {
        const existingDispute = await this._disputesRepo.findById(input.disputesId);
        if (!existingDispute)
            throw new Error("Dispute not found");
        switch (existingDispute.status) {
            case "rejected":
                throw new Error("Dispute is already rejected");
            case "resolved":
                throw new Error("Dispute is already resolved");
        }
        existingDispute.updateStatus("resolved");
        existingDispute.updateAction(input.action);
        const dataUpdated = await this._disputesRepo.update(input);
        if (!dataUpdated) {
            throw new Error("Failed to update dispute");
        }
        return {
            action: input.action,
            disputesId: dataUpdated.id,
            status: dataUpdated.status,
        };
    }
}
exports.UpdateDisputesStatusUseCase = UpdateDisputesStatusUseCase;
