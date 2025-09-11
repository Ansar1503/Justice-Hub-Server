import { LawyerRepository } from "@infrastructure/database/repo/LawyerRepo";
import { LawyerMapper } from "@infrastructure/Mapper/Implementations/LawyerMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { UpdateLawyersProfessionalDetails } from "@interfaces/controller/Lawyer/UpdateLawyersProfessionalDetails";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { UpdateProfessionalDetailsUsecase } from "@src/application/usecases/Lawyer/implementations/UpdateProfessionalDetailsUsecase";

export function UpdateLawyersProfessionalDetailsComposer(): IController {
  const usecase = new UpdateProfessionalDetailsUsecase(
    new LawyerRepository(new LawyerMapper())
  );
  return new UpdateLawyersProfessionalDetails(
    usecase,
    new HttpErrors(),
    new HttpSuccess()
  );
}
