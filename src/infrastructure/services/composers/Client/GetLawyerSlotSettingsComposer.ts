import { GetLawyerSlotSettingsController } from "@interfaces/controller/Client/GetLawyerSlotSettings";
import { ClientUseCaseComposer } from "./clientusecasecomposer";

export const GetLawyerSlotSettingsComposer = () => {
  const useCase = ClientUseCaseComposer();
  return new GetLawyerSlotSettingsController(useCase);
};
