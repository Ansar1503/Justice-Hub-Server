import { SessionsRepository } from "@infrastructure/database/repo/SessionRepo";
import { AddSessionSummaryController } from "@interfaces/controller/Cases/AddSessionSummaryController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { AddSessionSummaryUsecase } from "@src/application/usecases/Case/Implimentations/AddSessionSummaryUsecase";

export function AddSessionSummaryComposer() {
  const usecase = new AddSessionSummaryUsecase(new SessionsRepository());
  return new AddSessionSummaryController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
