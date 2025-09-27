import { PracticeAreaDto } from "../PracticeAreas/PracticeAreasDto";
import { SpecializationDto } from "../Specializations/SpecializationDto";

export interface LawyerprofessionalDetailsDto {
    id: string;
    userId: string;
    description: string;
    practiceAreas: PracticeAreaDto[] | [];
    experience: number;
    specializations: SpecializationDto[] | [];
    consultationFee: number;
    createdAt: Date;
    updatedAt: Date;
}
