import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { FetchAllCasesByQueryController } from "@interfaces/controller/Cases/FetchAllCasesByQueryController";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FetchAllCasesByQueryUsecase } from "@src/application/usecases/Case/Implimentations/FetchCasesByQuery";

export function FindAllCasesByQueryComposer(): IController {
    const usecase = new FetchAllCasesByQueryUsecase(new CaseRepository(new CaseMapper()));
    return new FetchAllCasesByQueryController(usecase, new HttpErrors(), new HttpSuccess());
}
