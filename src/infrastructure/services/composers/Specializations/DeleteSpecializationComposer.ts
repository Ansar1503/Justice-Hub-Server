import { PracticeAreaRepo } from "@infrastructure/database/repo/PracticeAreaRepo";
import { SpecializationRepo } from "@infrastructure/database/repo/SpecializationsRepo";
import { PracticeAreaMapper } from "@infrastructure/Mapper/Implementations/PracticeAreaMapper";
import { SpecializationMapper } from "@infrastructure/Mapper/Implementations/SpecializationMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { DeleteSpecializationController } from "@interfaces/controller/Specializations/DeleteSpecializationController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { DeleteSpecializationUsecase } from "@src/application/usecases/Specializations/implementations/DeleteSpecializationUsecase";

export function DeleteSpecializationComposer(): IController {
  const usecase = new DeleteSpecializationUsecase(
    new SpecializationRepo(new SpecializationMapper()),
    new PracticeAreaRepo(new PracticeAreaMapper())
  );
  return new DeleteSpecializationController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
