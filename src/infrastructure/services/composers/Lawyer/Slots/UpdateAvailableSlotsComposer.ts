import { IController } from "@interfaces/controller/Interface/IController";
import { lawyerUseCaseComposer } from "../LawyerUseCaseComposer";
import { UpdateAvailableSlotsController } from "@interfaces/controller/Lawyer/Slots/UpdateAvailableSlots";

export function UpdateAvailableSlotsComposer():IController{
    const usecase = lawyerUseCaseComposer()
    return new UpdateAvailableSlotsController(usecase)
}