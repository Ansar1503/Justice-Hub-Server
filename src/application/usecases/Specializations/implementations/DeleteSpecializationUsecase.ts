import { ISpecializationRepo } from "@domain/IRepository/ISpecialization";
import { SpecializationDto } from "@src/application/dtos/Specializations/SpecializationDto";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import { IDeleteSpecializationUsecase } from "../IDeleteSpecializationUseCase";

export class DeleteSpecializationUsecase implements IDeleteSpecializationUsecase {
    constructor(
        private _specializationRepo: ISpecializationRepo,
        private _practiceAreaRepo: IPracticAreaRepo,
    ) {}
    async execute(input: string): Promise<SpecializationDto> {
        const exists = await this._specializationRepo.findById(input);
        if (!exists) throw new ValidationError("specialization doesnt exist");
        const deleted = await this._specializationRepo.delete(input);
        if (!deleted) throw new ValidationError("specialization delete error");
        await this._practiceAreaRepo.deleteBySpec(deleted.id);
        return {
            createdAt: deleted.createdAt,
            id: deleted.id,
            name: deleted.name,
            updatedAt: deleted.updatedAt,
        };
    }
}
