import { IController } from "@interfaces/controller/Interface/IController";
import { FetchOverrideSlots } from "@interfaces/controller/Lawyer/Slots/FetchOverrideSlotsController";
import { FetchOverrideSlotsUseCase } from "@src/application/usecases/Lawyer/implementations/FetchOverrideSlotsUseCase";
import { OverrideSlotsRepository } from "@infrastructure/database/repo/OverrideSlotsRepo";

export function FetchOverrideSlotsComposer(): IController {
  const usecase = new FetchOverrideSlotsUseCase(new OverrideSlotsRepository());
  return new FetchOverrideSlots(usecase);
}
