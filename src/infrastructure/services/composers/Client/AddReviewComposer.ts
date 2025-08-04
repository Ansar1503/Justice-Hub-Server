import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { AddReviewController } from "@interfaces/controller/Client/AddReviewController";

export function AddReviewComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new AddReviewController(usecase);
}
