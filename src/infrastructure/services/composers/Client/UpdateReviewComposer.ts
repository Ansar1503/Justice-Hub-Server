import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { UpdateReviewsController } from "@interfaces/controller/Client/UpdateReviewController";

export function UpdateReviewsComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new UpdateReviewsController(usecase);
}
