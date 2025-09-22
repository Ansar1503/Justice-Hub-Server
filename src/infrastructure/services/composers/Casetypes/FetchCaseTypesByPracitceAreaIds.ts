import { CaseTypeRepo } from "@infrastructure/database/repo/CaseTypeRepo";
import { CaseTypeMapper } from "@infrastructure/Mapper/Implementations/CaseTypeMapper";
import { FindCaseTypesByPracticeAreasController } from "@interfaces/controller/CaseType/FindCaseTypeByPracticeAreaController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FindCaseTypesByPracticeAreas } from "@src/application/usecases/CaseType/implementation/FetchCasesTypesByPracticeAreaIds";
export function FindCaseTypesByPracticeAreasComposer(): IController {
  const usecase = new FindCaseTypesByPracticeAreas(
    new CaseTypeRepo(new CaseTypeMapper())
  );
  return new FindCaseTypesByPracticeAreasController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
