import {
    UpdateDisputesStatusInputDto,
    UpdateDisputesStatusOutputDto,
} from "@src/application/dtos/Admin/UpdateDisputesStatusDto";
import { IUpdateDisputesStatusUseCase } from "../IUpdateDisputesStatusUseCase";
import { IDisputes } from "@domain/IRepository/IDisputesRepo";

export class UpdateDisputesStatusUseCase
implements IUpdateDisputesStatusUseCase
{
    constructor(private _disputesRepo: IDisputes) {}
    async execute(
        input: UpdateDisputesStatusInputDto
    ): Promise<UpdateDisputesStatusOutputDto> {
        const existingDispute = await this._disputesRepo.findById(input.disputesId);
        if (!existingDispute) throw new Error("Dispute not found");
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
