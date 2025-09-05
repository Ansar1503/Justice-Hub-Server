import { PracticeAreaRepo } from "@infrastructure/database/repo/PracticeAreaRepo";
import { SpecializationRepo } from "@infrastructure/database/repo/SpecializationsRepo";
import { PracticeAreaMapper } from "@infrastructure/Mapper/Implementations/PracticeAreaMapper";
import { SpecializationMapper } from "@infrastructure/Mapper/Implementations/SpecializationMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { AddPracticeAreaController } from "@interfaces/controller/PracticeArea/AddPracticeAreaController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { AddPracticeAreaUsecase } from "@src/application/usecases/PracitceAreas/Implementation/AddPracticeAreasUsecase";

export function PracticeAreasComposer(): IController {
  const usecase = new AddPracticeAreaUsecase(
    new PracticeAreaRepo(new PracticeAreaMapper()),
    new SpecializationRepo(new SpecializationMapper())
  );
  return new AddPracticeAreaController(
    usecase,
    new HttpSuccess(),
    new HttpErrors()
  );
}
