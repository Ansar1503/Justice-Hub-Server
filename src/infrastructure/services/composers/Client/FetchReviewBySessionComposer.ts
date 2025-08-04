import { IController } from "@interfaces/controller/Interface/IController";
import { ClientUseCaseComposer } from "./clientusecasecomposer";
import { FetchReviewsBySessionController } from "@interfaces/controller/Client/FetchReviewBySessionController";

export function FetchReviewsBySessionComposer(): IController {
  const usecase = ClientUseCaseComposer();
  return new FetchReviewsBySessionController(usecase);
}
