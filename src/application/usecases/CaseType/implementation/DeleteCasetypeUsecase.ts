import { ICasetype } from "@domain/IRepository/ICasetype";
import { CaseTypeDto } from "@src/application/dtos/CaseType/CaseTypeDto";
import { IDeleteCasetypeUsecase } from "../IDeleteCasetypeUsecase";

export class DeleteCasetypeUsecase implements IDeleteCasetypeUsecase {
    constructor(private casetypeRepo: ICasetype) {}
    async execute(input: string): Promise<CaseTypeDto> {
        const casetypeExists = await this.casetypeRepo.findById(input);
        if (!casetypeExists) throw new Error("case type doesnot exists");
        await this.casetypeRepo.delete(input);
        return {
            createdAt: casetypeExists.createdAt,
            id: casetypeExists.id,
            name: casetypeExists.name,
            practiceareaId: casetypeExists.practiceareaId,
            updatedAt: casetypeExists.updatedAt,
        };
    }
}
