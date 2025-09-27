import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { PracticeAreaDto } from "@src/application/dtos/PracticeAreas/PracticeAreasDto";
import { IDeletePracticeAreaUsecase } from "../IDeletePracticeAreaUsecase";

export class DeletePracticeAreaUsecase implements IDeletePracticeAreaUsecase {
    constructor(private practiceAreaRepo: IPracticAreaRepo) {}
    async execute(input: string): Promise<PracticeAreaDto> {
        const exists = await this.practiceAreaRepo.findById(input);
        if (!exists) throw new ValidationError("no practice area found");
        const delted = await this.practiceAreaRepo.delete(input);
        if (!delted) throw new Error("practice area delte error");
        return {
            id: exists.id,
            createdAt: exists.createdAt,
            name: exists.name,
            specializationId: exists.specializationId,
            updatedAt: exists.udpatedAt,
        };
    }
}
