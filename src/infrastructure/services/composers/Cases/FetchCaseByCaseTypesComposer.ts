import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { FetchCaseByCaseTypesIdsController } from "@interfaces/controller/Cases/FetchCasesByCaseTypesIdsController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchCaseByCaseidsUsecase } from "@src/application/usecases/Case/Implimentations/FetchCaseByCaseidsUsecase";

export function FetchCaseByCaseTypesComposer(): IController {
  const usecase = new FetchCaseByCaseidsUsecase(
    new CaseRepository(new CaseMapper())
  );
  return new FetchCaseByCaseTypesIdsController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
