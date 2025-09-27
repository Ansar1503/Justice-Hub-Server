import { ILawyerRepository } from "@domain/IRepository/ILawyerRepo";
import { LawyerprofessionalDetailsDto } from "@src/application/dtos/Lawyer/LawyerProfessionalDetailsDto";
import { Lawyer } from "@domain/entities/Lawyer";
import { IUpdateProfessionalDetailsUsecase } from "../IUpdateProfessionalDetails";

export class UpdateProfessionalDetailsUsecase implements IUpdateProfessionalDetailsUsecase {
    constructor(private _lawyerProfessionRepo: ILawyerRepository) {}
    async execute(input: {
        userId: string;
        description: string;
        practiceAreas: { id: string; name: string }[];
        specialisations: { id: string; name: string }[];
        experience: number;
        consultationFee: number;
    }): Promise<LawyerprofessionalDetailsDto> {
        const professionalInfo = await this._lawyerProfessionRepo.findUserId(input.userId);
        const practiceAreas = input.practiceAreas.map((p) => p.id);
        const specialisation = input.specialisations.map((s) => s.id);
        if (!professionalInfo) {
            const lawyerPayload = Lawyer.create({
                consultationFee: input.consultationFee,
                description: input.description,
                experience: input.experience,
                practiceAreas: practiceAreas,
                specializations: specialisation,
                userId: input.userId,
            });
            await this._lawyerProfessionRepo.create(lawyerPayload);
        } else {
            await this._lawyerProfessionRepo.update({
                consultationFee: input.consultationFee,
                description: input.description,
                experience: input.experience,
                practiceAreas: practiceAreas,
                specializations: specialisation,
                updatedAt: new Date(),
                userId: input.userId,
            });
        }
        const data = await this._lawyerProfessionRepo.findUserId(input.userId);
        if (!data) throw new Error("adding professional details error");
        return data;
    }
}
