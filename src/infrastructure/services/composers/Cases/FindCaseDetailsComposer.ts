import { CaseRepository } from "@infrastructure/database/repo/CaseRepository";
import { CaseMapper } from "@infrastructure/Mapper/Implementations/CaseMapper";
import { FetchCaseDetailsControlller } from "@interfaces/controller/Cases/FetchCaseDetailsById";
import { IController } from "@interfaces/controller/Interface/IController";
import { HttpErrors } from "@interfaces/helpers/implementation/HttpErrors";
import { HttpSuccess } from "@interfaces/helpers/implementation/HttpSuccess";
import { FindCaseDetailsUsecase } from "@src/application/usecases/Case/Implimentations/FindCaseDetailsUsecase";

export function FindCaseDetailsComposer(): IController {
    const usecase = new FindCaseDetailsUsecase(
        new CaseRepository(new CaseMapper())
    );
    return new FetchCaseDetailsControlller(
        usecase,
        new HttpErrors(),
        new HttpSuccess()
    );
}
