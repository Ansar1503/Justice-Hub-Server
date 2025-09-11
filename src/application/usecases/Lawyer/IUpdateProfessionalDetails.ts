import { ProfessionalDetailsFormData } from "@interfaces/middelwares/validator/zod/lawyer/LawyerProfessionalDetailsUpdateSchema";
import { IUseCase } from "../IUseCases/IUseCase";
import { LawyerprofessionalDetailsDto } from "@src/application/dtos/Lawyer/LawyerProfessionalDetailsDto";

export interface IUpdateProfessionalDetailsUsecase
  extends IUseCase<
    ProfessionalDetailsFormData & { userId: string },
    LawyerprofessionalDetailsDto
  > {}
