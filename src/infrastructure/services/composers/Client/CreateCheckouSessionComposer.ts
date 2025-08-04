import { CreateCheckoutSessionController } from "@interfaces/controller/Client/CreateCheckoutSessionController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";

export const CreateCheckoutSessionComposer = () => {
  const useCase = ClientUseCaseComposer();
  return new CreateCheckoutSessionController(useCase);
};
