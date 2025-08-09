import { IController } from "@interfaces/controller/Interface/IController";
import { RemoveOverrideSlotsController } from "@interfaces/controller/Lawyer/Slots/RemoveOverrideSlotsController";
import { RemoveOverrideSlots } from "@src/application/usecases/Lawyer/implementations/RemoveOverrideSlotsUseCase";
import { OverrideSlotsRepository } from "@infrastructure/database/repo/OverrideSlotsRepo";

export function RemoveOverriedSlotsComposer(): IController {
  const usecase = new RemoveOverrideSlots(new OverrideSlotsRepository());
  return new RemoveOverrideSlotsController(usecase);
}
