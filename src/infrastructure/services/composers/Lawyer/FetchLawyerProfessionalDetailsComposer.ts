import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { LawyerMapper } from "@infrastructure/Mapper/Implementations/LawyerMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchLawyerProfessionalDetailsController } from "@interfaces/controller/Lawyer/FetchLawyerProfessionalDetailsController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchLawyerProfessionalDetailsUsecase } from "@src/application/usecases/Lawyer/implementations/FetchLawyerProfessionalDetailsUsecase";

export function FetchLawyersProfessionalDetailscomposer(): IController {
  const usecase = new FetchLawyerProfessionalDetailsUsecase(
    new LawyerRepository(new LawyerMapper())
  );
  return new FetchLawyerProfessionalDetailsController(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
