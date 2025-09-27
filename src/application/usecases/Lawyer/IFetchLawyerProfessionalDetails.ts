import { LawyerprofessionalDetailsDto } from "@src/application/dtos/Lawyer/LawyerProfessionalDetailsDto";
import { IUseCase } from "../IUseCases/IUseCase";

export interface IFetchLawyerProfessionalDetails extends IUseCase<string, LawyerprofessionalDetailsDto> {}
