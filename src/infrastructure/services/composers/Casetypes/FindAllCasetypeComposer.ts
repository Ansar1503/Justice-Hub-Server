import { CaseTypeRepo } from "@infrastructure/database/repo/CaseTypeRepo";
import { CaseTypeMapper } from "@infrastructure/Mapper/Implementations/CaseTypeMapper";
import { FetchAllCasetypeController } from "@interfaces/controller/CaseType/FetchAllCasetypeController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchCasetypeUsecase } from "@src/application/usecases/CaseType/implementation/FetchCasetypeUsecase";

export function FindAllCasetypeComposer(): IController {
  const casetypeRepo = new CaseTypeRepo(new CaseTypeMapper());
  const usecase = new FetchCasetypeUsecase(casetypeRepo);
  return new FetchAllCasetypeController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
