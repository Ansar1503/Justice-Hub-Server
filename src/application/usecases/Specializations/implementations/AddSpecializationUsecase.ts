import { ISpecializationRepo } from "@domain/IRepository/ISpecialization";
import { IAddSpecializationUsecase } from "../IAddSpecializationUsecase";
import { AddSpecializationInputDto } from "@src/application/dtos/Specializations/AddSpecializationDto";
import { SpecializationDto } from "@src/application/dtos/Specializations/SpecializationDto";
import { Specialization } from "@domain/entities/Specialization";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";

export class AddSpecializationUsecase implements IAddSpecializationUsecase {
    constructor(private specializationRepo: ISpecializationRepo) {}
    async execute(input: AddSpecializationInputDto): Promise<SpecializationDto> {
        if (!input.id?.trim()) {
            const exist = await this.specializationRepo.findByName(input.name);
            if (exist && exist.name == input.name) {
                throw new Error("Specialization Already exsits");
            }
            const newSpec = Specialization.create({ name: input.name });
            const specialization = await this.specializationRepo.create(newSpec);
            return {
                createdAt: specialization.createdAt,
                id: specialization.id,
                name: specialization.name,
                updatedAt: specialization.updatedAt,
            };
        }
        const exist = await this.specializationRepo.findById(input.id);
        if (!exist) throw new ValidationError("No spc found with the id");
        exist.updateName(input.name);
        const updated = await this.specializationRepo.updateName(
            exist.id,
            exist.name
        );
        return {
            createdAt: updated.createdAt,
            id: updated.id,
            name: updated.name,
            updatedAt: updated.updatedAt,
        };
    }
}
