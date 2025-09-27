import { ProfessionalDetailsFormData } from "@interfaces/middelwares/validator/zod/lawyer/LawyerProfessionalDetailsUpdateSchema";
import { LawyerprofessionalDetailsDto } from "@src/application/dtos/Lawyer/LawyerProfessionalDetailsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IUpdateProfessionalDetailsUsecase
    extends IUseCase<ProfessionalDetailsFormData & { userId: string }, LawyerprofessionalDetailsDto> {}
