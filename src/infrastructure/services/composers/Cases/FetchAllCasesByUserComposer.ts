import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { FetchAllCasesByUserController } from "@interfaces/controller/Cases/FetchAllCasesByUserController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchAllCasesByUserUsecase } from "@src/application/usecases/Case/Implimentations/FetchAllCasesByUserUsecase";

export function FetchAllCasesByUserComposer(): IController {
  const usecase = new FetchAllCasesByUserUsecase(
    new CaseRepository(new CaseMapper())
  );
  return new FetchAllCasesByUserController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
