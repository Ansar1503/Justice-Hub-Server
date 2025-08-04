import { GetLawyerSlotDetailsController } from "@interfaces/controller/Client/GetLawyerSlotDetailsController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";

export const GetLawyerSlotDetailsComposer = () => {
  const useCase = ClientUseCaseComposer();
  return new GetLawyerSlotDetailsController(useCase);
};
