import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import { AddPracticeAreaInputDto } from "@src/application/dtos/PracticeAreas/AddPracticeAreaDto";
import { PracticeAreaDto } from "@src/application/dtos/PracticeAreas/PracticeAreasDto";
import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
import { PracticeArea } from "@domain/entities/PracticeArea";
import { ISpecializationRepo } from "@domain/IRepository/ISpecialization";
import { IAddPracticeAreasUsecase } from "../IAddPracticeAreasUseCase";

export class AddPracticeAreaUsecase implements IAddPracticeAreasUsecase {
    constructor(
        private _practiceAreaRepo: IPracticAreaRepo,
        private _specRepo: ISpecializationRepo,
    ) {}
    async execute(input: AddPracticeAreaInputDto): Promise<PracticeAreaDto> {
        const exsits = await this._practiceAreaRepo.findByName(input.name);
        if (exsits?.name === input.name) {
            throw new ValidationError("Name already exists");
        }
        const specExist = await this._specRepo.findById(input.specId);
        if (!specExist) {
            throw new ValidationError("specification not found");
        }
        const newPractice = PracticeArea.create({
            name: input.name,
            specializationId: input.specId,
        });
        const created = await this._practiceAreaRepo.create(newPractice);
        return {
            createdAt: created.createdAt,
            id: created.id,
            name: created.name,
            specializationId: created.specializationId,
            updatedAt: created.udpatedAt,
        };
    }
}
