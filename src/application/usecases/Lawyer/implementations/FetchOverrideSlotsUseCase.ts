import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { OverrideSlotsDto } from "@src/application/dtos/Lawyer/OverrideSlotsDto";
import { IFetchOverrideSlotsUseCase } from "../IFetchOverrideSlotsUseCase";

export class FetchOverrideSlotsUseCase implements IFetchOverrideSlotsUseCase {
    constructor(private overrideRepo: IOverrideRepo) {}
    async execute(input: string): Promise<OverrideSlotsDto | null> {
        const existingOverrideSlots = await this.overrideRepo.fetchOverrideSlots(input);
        if (!existingOverrideSlots) return null;
        return {
            lawyer_id: existingOverrideSlots.lawyerId,
            overrideDates: existingOverrideSlots.overrideDates,
        };
    }
}
