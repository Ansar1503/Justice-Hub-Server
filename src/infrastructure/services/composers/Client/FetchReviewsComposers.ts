import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { FetchReviewsController } from "@interfaces/controller/Client/FetchReviewController";

export function FetchReviewsComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new FetchReviewsController(usecase);
}
