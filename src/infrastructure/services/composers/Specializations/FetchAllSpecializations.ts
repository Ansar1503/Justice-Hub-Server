import { SpecializationRepo } from "@infrastructure/database/repo/SpecializationsRepo";
import { SpecializationMapper } from "@infrastructure/Mapper/Implementations/SpecializationMapper";
import { IController } from "@interfaces/controller/Interface/IController";
import { FetchAllSpecializationsController } from "@interfaces/controller/Specializations/FetchAllSpecializationsController";
import { FetchAllSpecializationsUsecase } from "@src/application/usecases/Specializations/implementations/FetchAllSpecializationsUsecase";

export function FetchAllSpecializationsComposer(): IController {
    const usecase = new FetchAllSpecializationsUsecase(
        new SpecializationRepo(new SpecializationMapper())
    );
    return new FetchAllSpecializationsController(usecase);
}
