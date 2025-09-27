import {
    FetchSpecializationInputDto,
    FetchSpecializationOutputDto,
} from "@src/application/dtos/Specializations/FetchSpecializationDto";
import { IFetchAllSpecializationsUsecase } from "../IFetchAllSpecializationsUsecase";
import { ISpecializationRepo } from "@domain/IRepository/ISpecialization";

export class FetchAllSpecializationsUsecase
implements IFetchAllSpecializationsUsecase
{
    constructor(private specializationRepo: ISpecializationRepo) {}
    async execute(
        input: FetchSpecializationInputDto
    ): Promise<FetchSpecializationOutputDto> {
        const specializations = await this.specializationRepo.findAll(input);
        return {
            data: specializations.data
                ? specializations.data.map((sp) => ({
                    name: sp.name,
                    id: sp.id,
                    createdAt: sp.createdAt,
                    updatedAt: sp.updatedAt,
                }))
                : [],
            currentPage: specializations.currentPage,
            totalCount: specializations.totalCount,
            totalPage: specializations.totalPage,
        };
    }
}
