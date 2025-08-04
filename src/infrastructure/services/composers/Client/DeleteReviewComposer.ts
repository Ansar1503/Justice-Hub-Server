import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { DeleteReviewController } from "@interfaces/controller/Client/DeleteReviewController";

export function DeleteReviewComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new DeleteReviewController(usecase);
}
