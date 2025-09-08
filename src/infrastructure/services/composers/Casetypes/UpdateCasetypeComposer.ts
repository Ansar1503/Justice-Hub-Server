import { CaseTypeRepo } from "@infrastructure/database/repo/CaseTypeRepo";
import { PracticeAreaRepo } from "@infrastructure/database/repo/PracticeAreaRepo";
import { CaseTypeMapper } from "@infrastructure/Mapper/Implementations/CaseTypeMapper";
import { PracticeAreaMapper } from "@infrastructure/Mapper/Implementations/PracticeAreaMapper";
import { UpdateCasetypeController } from "@interfaces/controller/CaseType/UpdateCasetypeController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { UpdateCasetypeUsecase } from "@src/application/usecases/CaseType/implementation/UpdateCasetypeUsecase";

export function UpdateCasetypeComposer(): IController {
  const practiceAreaRepo = new PracticeAreaRepo(new PracticeAreaMapper());
  const casetypeRepo = new CaseTypeRepo(new CaseTypeMapper());
  const usecase = new UpdateCasetypeUsecase(casetypeRepo, practiceAreaRepo);
  return new UpdateCasetypeController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
