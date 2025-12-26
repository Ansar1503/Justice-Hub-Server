import { IPracticAreaRepo } from "@domain/IRepository/IPracticeAreas";
import { findPracticeAreasBySpecIdsInputDto } from "@src/application/dtos/PracticeAreas/FindAllPracticeAreaDto";
import { PracticeAreaDto } from "@src/application/dtos/PracticeAreas/PracticeAreasDto";
import { IFindPracticeareasByspecIdsUsecase } from "../IFindPracticeAreasBySpecIdsUsecase";

export class FindPracticeAreasBySpecIdsUsecase implements IFindPracticeareasByspecIdsUsecase {
    constructor(private _PracticeAreaRepo: IPracticAreaRepo) {}
    async execute(input: findPracticeAreasBySpecIdsInputDto): Promise<PracticeAreaDto[] | []> {
        const practiceArea = await this._PracticeAreaRepo.findBySpecIds(input.specIds);
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
