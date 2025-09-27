import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import { IFindPracticeareasByspecIdsUsecase } from "../IFindPracticeAreasBySpecIdsUsecase";
import { findPracticeAreasBySpecIdsInputDto } from "@src/application/dtos/PracticeAreas/FindAllPracticeAreaDto";
import { PracticeAreaDto } from "@src/application/dtos/PracticeAreas/PracticeAreasDto";

export class FindPracticeAreasBySpecIdsUsecase
implements IFindPracticeareasByspecIdsUsecase
{
    constructor(private PracticeAreaRepo: IPracticAreaRepo) {}
    async execute(
        input: findPracticeAreasBySpecIdsInputDto
    ): Promise<PracticeAreaDto[] | []> {
        const practiceArea = await this.PracticeAreaRepo.findBySpecIds(
            input.specIds
        );
        if (!practiceArea) return [];
        return practiceArea.map((p) => ({
            createdAt: p.createdAt,
            id: p.id,
            name: p.name,
            specializationId: p.specializationId,
            updatedAt: p.udpatedAt,
        }));
    }
}
