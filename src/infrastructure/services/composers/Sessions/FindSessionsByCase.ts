import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { FetchCaseSessionController } from "@interfaces/controller/Cases/FetchCaseSessionsController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchCaseSessionUsecase } from "@src/application/usecases/Case/Implimentations/FetchCaseSessionUsecase";

export function FindSessionsByCaseComposer() {
  const usecase = new FetchCaseSessionUsecase(new SessionsRepository());
  return new FetchCaseSessionController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
