import { IOverrideRepo } from "@domain/IRepository/IOverrideRepo";
import { IFetchOverrideSlotsUseCase } from "../IFetchOverrideSlotsUseCase";
import { OverrideSlotsDto } from "@src/application/dtos/Lawyer/OverrideSlotsDto";

export class FetchOverrideSlotsUseCase implements IFetchOverrideSlotsUseCase {
  constructor(private overrideRepo: IOverrideRepo) {}
  async execute(input: string): Promise<OverrideSlotsDto> {
    const existingOverrideSlots = await this.overrideRepo.fetchOverrideSlots(
      input
    );
    if (!existingOverrideSlots) throw new Error("No Override Slots found");
    return {
      lawyer_id: existingOverrideSlots.lawyerId,
      overrideDates: existingOverrideSlots.overrideDates,
    };
  }
}
