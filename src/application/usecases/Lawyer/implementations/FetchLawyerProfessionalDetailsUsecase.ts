import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { LawyerprofessionalDetailsDto } from "@src/application/dtos/Lawyer/LawyerProfessionalDetailsDto";
import { IFetchLawyerProfessionalDetails } from "../IFetchLawyerProfessionalDetails";

export class FetchLawyerProfessionalDetailsUsecase implements IFetchLawyerProfessionalDetails {
    constructor(private _lawyerRepo: ILawyerRepository) {}
    async execute(input: string): Promise<LawyerprofessionalDetailsDto> {
        const details = await this._lawyerRepo.findUserId(input);
        if (!details) throw new Error("no lawyer details found");
        return details;
    }
}
