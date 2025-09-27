import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import { PracticeAreaDto } from "@src/application/dtos/PracticeAreas/PracticeAreasDto";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { IUpdatePracticeAreaUsecase } from "../IUpdatePracticeAreaUsecase";

export class UpdatePracticeAreasUsecase implements IUpdatePracticeAreaUsecase {
    constructor(private practiceAreasRepo: IPracticAreaRepo) {}
    async execute(input: { id: string; name: string; specId: string }): Promise<PracticeAreaDto> {
        const existing = await this.practiceAreasRepo.findById(input.id);
        if (!existing) throw new ValidationError("no practice area found");
        const existingname = await this.practiceAreasRepo.findByName(input.name);
        if (existingname?.name) {
            throw new ValidationError("practice already exists with the name " + existingname.name);
        }
        existing.updateName(input.name);
        existing.updateSpecialisation(input.specId);
        const updated = await this.practiceAreasRepo.update(existing.id, existing.name, existing.specializationId);
        if (!updated) throw new Error("Practice Area Update Failed!");
        return {
            createdAt: updated.createdAt,
            id: updated.id,
            name: updated.name,
            specializationId: updated.specializationId,
            updatedAt: updated.udpatedAt,
        };
    }
}
