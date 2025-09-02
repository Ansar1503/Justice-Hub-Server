import { SpecializationRepo } from "@infrastructure/database/repo/SpecializationsRepo";
import { SpecializationMapper } from "@infrastructure/Mapper/Implementations/SpecializationMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { AddSpecializationController } from "@interfaces/controller/Specializations/AddSpecializationController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { AddSpecializationUsecase } from "@src/application/usecases/Specializations/implementations/AddSpecializationUsecase";

export function AddSpecializationComposer(): IController {
  const usecase = new AddSpecializationUsecase(
    new SpecializationRepo(new SpecializationMapper())
  );
  return new AddSpecializationController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
